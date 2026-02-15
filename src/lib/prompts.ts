export interface Persona {
  id: string;
  name: string;
  icon: string;
  description: string;
  prompt: string;
  maxTokens: number;
  temperature: number;
}

export interface TransformResult {
  platform: string;
  content: string;
}

export interface TransformResponse {
  extractedText: string;
  imageUrl: string | null;
  title: string | null;
  results: TransformResult[];
}

export const personas: Persona[] = [
  {
    id: 'twitter',
    name: 'Twitter Thread',
    icon: 'Twitter',
    description: 'Viral, attention-grabbing thread with hooks',
    prompt: `Transform the following content into a viral Twitter thread (X post).

Guidelines:
- Start with an irresistible hook that stops the scroll
- Break content into 5-10 bite-sized tweets
- Each tweet should be under 280 characters
- Use line breaks between tweets
- Include numbers or bullets for easy reading
- Add 1-2 relevant hashtags on the final tweet
- Use casual, conversational language
- Ask questions or use controversy to drive engagement
- Focus on the most surprising or valuable insights

Format as a thread with tweet numbers like "1/", "2/", etc.

Content to transform:`,
    maxTokens: 1500,
    temperature: 0.8,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Post',
    icon: 'Linkedin',
    description: 'Professional, thought-leadership style',
    prompt: `Transform the following content into a professional LinkedIn post.

Guidelines:
- Start with a compelling personal story or insight
- Use short paragraphs (1-2 sentences max) for readability
- Include 3-5 key takeaways formatted with bullet points
- Add a thoughtful question at the end to drive comments
- Use professional but approachable tone
- Mention lessons learned or actionable advice
- Keep it under 1500 characters
- Add 3-5 relevant hashtags at the end
- Sign off with your name or initials (use "CS" as placeholder)

Content to transform:`,
    maxTokens: 1000,
    temperature: 0.7,
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    icon: 'Mail',
    description: 'Summarized with bullet points and clear structure',
    prompt: `Transform the following content into a newsletter format.

Guidelines:
- Create a catchy subject line (label as "Subject:")
- Write a brief, engaging introduction (2-3 sentences)
- Break down main points into 3-5 clear bullet points
- Add a "Key Takeaway" section at the end
- Include a "What to do next" or action item section
- Use formatting like **bold** for emphasis
- Keep it scannable and easy to read
- Professional but conversational tone
- Include placeholders for [Your Name] and [Company/Brand]

Content to transform:`,
    maxTokens: 1200,
    temperature: 0.6,
  },
  {
    id: 'instagram',
    name: 'Instagram Caption',
    icon: 'Instagram',
    description: 'Emoji-rich, hashtag-optimized caption',
    prompt: `Transform the following content into an engaging Instagram caption.

Guidelines:
- Start with a hook line with emojis
- Use line breaks after every 1-2 sentences
- Include 8-12 relevant emojis throughout the text
- Keep the main caption under 150 words
- Add a clear call-to-action ("Comment below", "Save this", "Tag a friend")
- Include 15-20 relevant hashtags (mix of popular and niche)
- Add a one-sentence "ALT text" description for accessibility
- Use casual, friendly tone
- Format with spacing for readability
- Can include "Save this post 📌" or similar engagement prompt

Content to transform:`,
    maxTokens: 800,
    temperature: 0.9,
  },
];

export function getPersonaById(id: string): Persona | undefined {
  return personas.find((p) => p.id === id);
}