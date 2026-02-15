<div align="center">

# 🎨 Content Shapeshifter Pro

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Groq](https://img.shields.io/badge/Powered%20by-Groq-f54029?style=for-the-badge)](https://groq.com/)

### Transform any content into platform-optimized posts with AI

[Features](#features) • [Demo](#demo) • [Installation](#installation) • [Usage](#usage) • [API](#api)

</div>

---

## ✨ Features

- **🌐 URL Scraping**: Intelligently extracts clean content and hero images from any blog post or article
- **🤖 AI-Powered Transformation**: Leverages Groq API with Llama 3 to generate 4 distinct platform variants
  - **Twitter Thread** - Viral, attention-grabbing hooks
  - **LinkedIn Post** - Professional, thought-leadership style
  - **Newsletter** - Summarized with bullet points and clear structure
  - **Instagram Caption** - Emoji-rich, hashtag-optimized content
- **🎨 Modern UI/UX**: Elegant dark mode aesthetic with smooth animations
- **⚡ Real-time Feedback**: Toast notifications, loading states, and skeleton screens
- **📋 One-Click Copy**: Instant clipboard copying for all generated content
- **📱 Responsive Design**: Fully optimized for desktop, tablet, and mobile devices

---

## 🚀 Demo

![App Screenshot](https://via.placeholder.com/800x450/18181b/ffffff?text=Content+Shapeshifter+Pro)

**Live Demo**: [Coming Soon]

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) (Strict Mode) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) |
| **AI/LLM** | [Groq SDK](https://groq.com/) + Llama 3 |
| **Scraping** | [Cheerio](https://cheerio.js.org/) + [Axios](https://axios-http.com/) |
| **UI Components** | [Lucide React](https://lucide.dev/) |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) |

---

## 📦 Installation

### Prerequisites

- **Node.js** 18.0 or later
- **npm** 9.0 or later (or yarn/pnpm)
- **Groq API Key** - [Get yours here](https://console.groq.com/keys)

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/content-shapeshifter-pro.git
cd content-shapeshifter-pro

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and add your GROQ_API_KEY

# 4. Start development server
npm run dev

# 5. Open in browser
open http://localhost:3000
```

---

## 🎯 Usage

### Step 1: Enter Content
Paste a URL or type/paste text directly into the input field:

```
https://example.com/your-article
```

Or:

```
Your content here that you want to transform...
```

### Step 2: Transform
Click the **"Shapeshift Content"** button to process your input.

### Step 3: Review Results
- **Source Preview**: View extracted image and text (if URL)
- **Generated Content**: Browse 4 platform-specific variants
- **Copy**: Click the copy button on any card to use the content

---

## 🔌 API Reference

### Endpoint

```http
POST /api/transform
```

### Request

**Content-Type**: `application/json`

```json
{
  "input": "https://example.com/article" | "Your text content here..."
}
```

### Response

```json
{
  "extractedText": "Clean text content...",
  "imageUrl": "https://example.com/image.jpg",
  "title": "Article Title",
  "results": [
    {
      "platform": "Twitter Thread",
      "platformId": "twitter",
      "content": "Generated content..."
    },
    {
      "platform": "LinkedIn Post",
      "platformId": "linkedin",
      "content": "Generated content..."
    },
    {
      "platform": "Newsletter",
      "platformId": "newsletter",
      "content": "Generated content..."
    },
    {
      "platform": "Instagram Caption",
      "platformId": "instagram",
      "content": "Generated content..."
    }
  ]
}
```

### Error Responses

| Status | Description |
|--------|-------------|
| `400` | Bad Request - Invalid input or URL scraping failed |
| `500` | Internal Server Error - Groq API or processing error |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (Browser)                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │  Input Form  │→ │  Transform API   │→ │  Results Display │  │
│  └──────────────┘  └──────────────────┘  └──────────────────┘  │
│                           │                                      │
└───────────────────────────┼──────────────────────────────────────┘
                            │
                            ↓ POST /api/transform
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js Server                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │ URL Validation   │→ │ Content Scraping │→ │ AI Generation │ │
│  └──────────────────┘  └──────────────────┘  └───────────────┘ │
│         │                      │                      │         │
│         │                      │                      │         │
│         ▼                      ▼                      ▼         │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │ Axios + Cheerio  │  │ Groq SDK         │  │ Response      │ │
│  └──────────────────┘  └──────────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
content-shapeshifter-pro/
├── 📂 app/                          # Next.js App Router
│   ├── 📂 api/transform/            # API routes
│   │   └── route.ts                 # Main transformation endpoint
│   ├── globals.css                  # Global styles + Tailwind
│   ├── layout.tsx                   # Root layout with providers
│   └── page.tsx                     # Main application page
│
├── 📂 src/lib/                      # Utilities & configurations
│   ├── scraper.ts                   # Web scraping logic (Cheerio)
│   ├── prompts.ts                   # AI personas & prompts
│   └── utils.ts                     # Helper functions
│
├── 📄 .env.local                    # Environment variables
├── 📄 next.config.js                # Next.js configuration
├── 📄 tailwind.config.ts            # Tailwind CSS theme
├── 📄 tsconfig.json                 # TypeScript configuration
└── 📄 package.json                  # Dependencies & scripts
```

---

## 🎨 Customization

### Modifying AI Personas

Edit `src/lib/prompts.ts` to customize the content generation:

```typescript
export const personas: Persona[] = [
  {
    id: 'twitter',
    name: 'Twitter Thread',
    prompt: 'Your custom prompt here...',
    maxTokens: 1500,
    temperature: 0.8,
  },
  // ... other personas
];
```

### Adjusting Scraping Behavior

Modify `src/lib/scraper.ts` to change content extraction:

- **Content Selectors**: Update `contentSelectors` array
- **Image Detection**: Customize image prioritization logic
- **Text Processing**: Adjust filtering and cleaning rules

### Styling

All styles use Tailwind CSS with a custom dark theme:

```css
/* app/globals.css */
:root {
  --background: 240 10% 3.9%;    /* zinc-950 */
  --foreground: 0 0% 98%;         /* zinc-50 */
  /* ... */
}
```

---

## 🧪 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run typecheck # Run TypeScript compiler
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | ✅ Yes | Your Groq API key for AI content generation |

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variable `GROQ_API_KEY`
4. Deploy automatically

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Other Platforms

Make sure to configure:
- **Environment Variables**: `GROQ_API_KEY`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Groq](https://groq.com/) for blazing-fast LLM inference
- [Meta AI](https://ai.meta.com/) for Llama 3
- [Next.js](https://nextjs.org/) team for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling

---

<div align="center">

**Made with ❤️ and ⚡ by [Your Name]**

[Report Bug](https://github.com/yourusername/content-shapeshifter-pro/issues) • [Request Feature](https://github.com/yourusername/content-shapeshifter-pro/issues)

</div>