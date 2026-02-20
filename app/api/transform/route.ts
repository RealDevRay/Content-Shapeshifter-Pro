import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { extractContent } from '@/src/lib/scraper';
import { personas, TransformResult } from '@/src/lib/prompts';
import crypto from 'crypto';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

function getCacheKey(input: string): string {
  return crypto.createHash('md5').update(input).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input } = body;

    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Input is required' },
        { status: 400 }
      );
    }

    const trimmedInput = input.trim();
    const cacheKey = getCacheKey(trimmedInput);
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
        const completion = await groq.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: persona.prompt,
            },
            {
              role: 'user',
              content: extractedText,
            },
          ],
          model: 'llama3-8b-8192',
          temperature: persona.temperature,
          max_tokens: persona.maxTokens,
          top_p: 1,
          stream: false,
        });

        const content = completion.choices[0]?.message?.content || '';

        return {
          platform: persona.name,
          platformId: persona.id,
          content: content.trim(),
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