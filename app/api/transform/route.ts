import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { extractContent } from '@/src/lib/scraper';
import { personas, TransformResult } from '@/src/lib/prompts';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

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

    let extractedText: string;
    let imageUrl: string | null = null;
    let title: string | null = null;

    // Check if input is a URL
    const isUrl = input.trim().startsWith('http://') || input.trim().startsWith('https://');

    if (isUrl) {
      try {
        const extracted = await extractContent(input.trim());
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
      extractedText = input.trim();
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

    return NextResponse.json({
      extractedText,
      imageUrl,
      title,
      results: results as TransformResult[],
    });
  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}