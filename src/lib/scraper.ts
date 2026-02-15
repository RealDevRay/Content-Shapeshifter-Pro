import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ExtractedContent {
  text: string;
  imageUrl: string | null;
  title: string | null;
}

/**
 * Extracts main content and hero image from a URL
 */
export async function extractContent(url: string): Promise<ExtractedContent> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 10000,
      maxRedirects: 5,
    });

    const $ = cheerio.load(response.data);

    // Extract title
    const title = $('meta[property="og:title"]').attr('content') ||
                  $('title').text() ||
                  $('h1').first().text() ||
                  null;

    // Extract Open Graph image first
    let imageUrl = $('meta[property="og:image"]').attr('content') ||
                   $('meta[name="twitter:image"]').attr('content') ||
                   null;

    // If no OG image, try to find the largest image in content area
    if (!imageUrl) {
      const contentSelectors = [
        'article',
        'main',
        '.content',
        '.post',
        '.entry',
        '.article',
        '#content',
        '[role="main"]',
      ];

      let contentArea: cheerio.Cheerio | null = null;

      for (const selector of contentSelectors) {
        const element = $(selector);
        if (element.length > 0) {
          contentArea = element;
          break;
        }
      }

      if (contentArea) {
        let largestImage: { src: string; size: number } | null = null;

        contentArea.find('img').each((_, element) => {
          const src = $(element).attr('src');
          const width = parseInt($(element).attr('width') || '0', 10);
          const height = parseInt($(element).attr('height') || '0', 10);
          const size = width * height;

          if (src && !src.startsWith('data:') && size > (largestImage?.size || 0)) {
            largestImage = { src, size };
          }
        });

        if (largestImage) {
          imageUrl = largestImage.src;
        }
      }
    }

    // Make image URL absolute
    if (imageUrl && !imageUrl.startsWith('http')) {
      const baseUrl = new URL(url);
      imageUrl = imageUrl.startsWith('/')
        ? `${baseUrl.protocol}//${baseUrl.host}${imageUrl}`
        : `${baseUrl.protocol}//${baseUrl.host}/${imageUrl}`;
    }

    // Extract main text content
    let text = '';
    
    // Try to find main content area
    const contentSelectors = [
      'article',
      'main',
      '.content',
      '.post',
      '.entry',
      '.article-content',
      '#content',
      '[role="main"]',
    ];

    let contentArea: cheerio.Cheerio | null = null;

    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        contentArea = element;
        break;
      }
    }

    if (contentArea) {
      // Extract paragraphs from content area
      contentArea.find('p').each((_, element) => {
        const paragraphText = $(element).text().trim();
        if (paragraphText.length > 50) { // Filter out short paragraphs (likely ads/nav)
          text += paragraphText + '\n\n';
        }
      });

      // If no good paragraphs found, try headings
      if (!text) {
        contentArea.find('h1, h2, h3, h4, h5, h6').each((_, element) => {
          text += $(element).text().trim() + '\n\n';
        });
      }
    }

    // Fallback: extract from body if no content found
    if (!text) {
      $('p').each((_, element) => {
        const paragraphText = $(element).text().trim();
        if (paragraphText.length > 50 && !$(element).closest('nav, header, footer, aside').length) {
          text += paragraphText + '\n\n';
        }
      });
    }

    // Clean up the text
    text = text
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive newlines
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    // Limit text length
    const MAX_LENGTH = 8000;
    if (text.length > MAX_LENGTH) {
      text = text.substring(0, MAX_LENGTH) + '...';
    }

    return {
      text: text || 'No content could be extracted from this URL.',
      imageUrl,
      title,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Could not connect to the server. Please check the URL.');
      }
      if (error.code === 'ETIMEDOUT') {
        throw new Error('Request timed out. The server took too long to respond.');
      }
      if (error.response?.status === 404) {
        throw new Error('Page not found. Please check the URL.');
      }
      if (error.response?.status === 403) {
        throw new Error('Access denied. This site may block automated requests.');
      }
      throw new Error(`Failed to fetch URL: ${error.message}`);
    }
    throw new Error('An unexpected error occurred while scraping the URL.');
  }
}