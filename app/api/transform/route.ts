import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { extractContent } from '@/src/lib/scraper';
import { personas, TransformResult } from '@/src/lib/prompts';
import { Mistral } from '@mistralai/mistralai';
import crypto from 'crypto';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

function getCacheKey(input: string, settings?: any): string {
  const payload = JSON.stringify({ input, settings });
  return crypto.createHash('md5').update(payload).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input, settings } = body;

    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Input is required' },
        { status: 400 }
      );
    }

    const trimmedInput = input.trim();
    const cacheKey = getCacheKey(trimmedInput, settings);
    const cachedResponse = cache.get(cacheKey);

    if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_TTL) {
      console.log('Serving from cache for input:', trimmedInput.substring(0, 50) + '...');
      return NextResponse.json(cachedResponse.data);
    }

    let extractedText: string;
    let imageUrl: string | null = null;
    let title: string | null = null;

    // Check if input is a URL
    const isUrl = trimmedInput.startsWith('http://') || trimmedInput.startsWith('https://');

    if (isUrl) {
      try {
        const extracted = await extractContent(trimmedInput);
        extractedText = extracted.text;
        imageUrl = extracted.imageUrl;
        title = extracted.title;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to scrape URL';
        return NextResponse.json(
          { error: errorMessage },
          { status: 400 }
        );
      }
    } else {
      extractedText = trimmedInput;
    }

    if (!extractedText || extractedText.length < 50) {
      return NextResponse.json(
        { error: 'Content too short. Please provide at least 50 characters.' },
        { status: 400 }
      );
    }

    // Generate content for all personas in parallel
    const generationPromises = personas.map(async (persona) => {
      try {
        // --- STEP 1: DRAFTER AGENT (GROQ) ---
        // Groq focuses strictly on creative drafting based on the original persona.
        let drafterSystemPrompt = persona.prompt;
        
        // --- Drafter Overrides ---
        // Strip emoji instructions if disabled, otherwise enforce them
        if (settings && settings.includeEmojis === false) {
           drafterSystemPrompt = drafterSystemPrompt.replace(/-.*emoji.*\n/gi, '');
           drafterSystemPrompt += '\n\nIMPORTANT CRITICAL RULE: DO NOT use any emojis in your response. Emojis are strictly forbidden.';
        } else {
           drafterSystemPrompt += '\n\nIMPORTANT RULE: Liberally sprinkle relevant emojis throughout the content to increase visual appeal. Every output must contain emojis.';
        }

        // X Platform Overrides for Drafter
        if (persona.id === 'x' && settings) {
           if (settings.xFormat === 'post') {
             // Remove thread references from the prompt completely
             drafterSystemPrompt = drafterSystemPrompt.replace(/viral X thread \(post\)/gi, 'single viral X post');
             drafterSystemPrompt = drafterSystemPrompt.replace(/- Break content into 5-10 bite-sized tweets\n/gi, '');
             drafterSystemPrompt = drafterSystemPrompt.replace(/Format as a thread with tweet numbers like "1\/", "2\/", etc\./gi, 'IMPORTANT: Format as EXACTLY ONE single standalone post. DO NOT make a thread.');
           }
        }

        const draftCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: drafterSystemPrompt,
            },
            {
              role: 'user',
              content: extractedText,
            },
          ],
          model: 'llama-3.1-8b-instant',
          temperature: persona.temperature, // Use the persona's ideal creative temp for drafting
          max_tokens: persona.maxTokens,
          top_p: 1,
          stream: false,
        });

        const draftContent = draftCompletion.choices[0]?.message?.content || '';

        // --- STEP 2: EDITOR AGENT (MISTRAL) ---
        // Mistral acts as the strict compliance and formatting editor.
        let editorSystemPrompt = `You are a strict QA Editor for a social media agency. 
Your job is to take the provided draft, review it, and return ONLY the final polished version. 
Do not add any conversational text (e.g., "Here is your draft"). Just output the final content perfectly formatting according to these strict rules:\n`;

        // Editor Rule 1: Hashtags
        if (settings && settings.includeHashtags === false) {
           editorSystemPrompt += '\n- CRITICAL: Remove every single hashtag from the draft. The final output must have ZERO hashtags.';
        } else {
           editorSystemPrompt += '\n- Ensure hashtags are placed naturally at the end of the post.';
        }

        // Editor Rule 1.5: Emojis
        if (settings && settings.includeEmojis === false) {
           editorSystemPrompt += '\n- CRITICAL: Remove every single emoji from the draft. The final output must contain absolutely NO emojis.';
        } else {
           editorSystemPrompt += '\n- Ensure relevant emojis are naturally included in the text to enhance engagement and readability.';
        }

        // Editor Rule 2: Length Preferences
        if (settings && settings.lengthPreference === 'short') {
           editorSystemPrompt += '\n- Condense the draft. Make it extremely concise, brief, and punchy.';
        } else if (settings && settings.lengthPreference === 'long') {
           editorSystemPrompt += '\n- Ensure the draft is detailed and elaborate.';
        }

        // Editor Rule 3: Platform Format Overrides
        if (persona.id === 'x' && settings) {
           if (settings.xFormat === 'post') {
              editorSystemPrompt += '\n- CRITICAL: The draft must be formatted as exactly ONE single standalone post. Remove any thread numbering (like 1/, 2/). ABSOLUTELY DO NOT make it a thread.';
           } else {
              editorSystemPrompt += '\n- Ensure the draft is properly formatted as a multi-part thread with clear breaks and numbering (e.g., 1/, 2/).';
           }
           
           if (settings.xAccountType === 'basic') {
              editorSystemPrompt += '\n- CRITICAL: The user has a basic X account. You MUST edit the draft so that NO single post or thread section exceeds 280 characters.';
           }
        }

        if (persona.id === 'linkedin' && settings) {
           if (settings.linkedinFormat === 'article') {
              editorSystemPrompt += '\n- Format this as a comprehensive LinkedIn article with clear headings and in-depth sections.';
           } else {
              editorSystemPrompt += '\n- Format this as a standard short-form LinkedIn feed post with line breaks for readability.';
           }
        }

        const finalCompletion = await mistral.chat.complete({
          model: 'mistral-small-latest',
          messages: [
            {
              role: 'system',
              content: editorSystemPrompt,
            },
            {
              role: 'user',
              content: `Please edit and finalize this draft according to your system rules:\n\n${draftContent}`,
            },
          ],
          temperature: settings?.temperature ?? 0.2, // Mistral uses the user's requested temp (or low temp for strict editing)
        });

        // @ts-ignore - Temporary bypass for mistral sdk types
        const finalContent = finalCompletion.choices[0]?.message?.content || draftContent;

        return {
          platform: persona.name,
          platformId: persona.id,
          content: typeof finalContent === 'string' ? finalContent.trim() : draftContent.trim(),
        };
      } catch (error) {
        console.error(`Error generating content for ${persona.name}:`, error);
        return {
          platform: persona.name,
          platformId: persona.id,
          content: `Error: Could not generate ${persona.name} content. Please try again.`,
        };
      }
    });

    const results = await Promise.all(generationPromises);

    const responseData = {
      extractedText,
      imageUrl,
      title,
      results: results as TransformResult[],
    };

    // Store in cache
    cache.set(cacheKey, { data: responseData, timestamp: Date.now() });

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}