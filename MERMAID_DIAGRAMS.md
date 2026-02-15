# Mermaid.js Diagram Prompts for Content Shapeshifter Pro

## Prompt 1: Application Flow Diagram

```
Create a Mermaid.js flowchart diagram showing the complete application flow for "Content Shapeshifter Pro". Include:

1. User Journey:
   - User enters URL or text
   - Input validation
   - API request initiated

2. Backend Processing:
   - URL detection logic
   - Web scraping (Cheerio + Axios) for URLs
   - Content extraction (text + image)
   - Parallel AI generation (4 Groq API calls)
   - Response aggregation

3. Frontend Display:
   - Loading states
   - Source preview (image + text)
   - Results grid (4 platform cards)
   - Copy functionality

4. Error Handling:
   - Invalid URL errors
   - Scraping failures
   - API errors
   - Network issues

Use a flowchart with clear decision points (diamonds), processes (rectangles), and data flow. Color-code: green for success paths, red for error paths, blue for AI processing, purple for user interactions.
```

**Expected Output:**

```mermaid
flowchart TD
    Start([User Opens App]) --> Input[Enter URL or Text]
    Input --> Validate{Is Valid Input?}
    Validate -->|No| Error1[Show Error Toast]
    Error1 --> Input
    Validate -->|Yes| Submit[Click Shapeshift]
    Submit --> Loading[Show Loading State]
    Loading --> API[POST /api/transform]
    API --> CheckURL{Is URL?}
    CheckURL -->|Yes| Scrape[Scrape with Cheerio]
    CheckURL -->|No| UseText[Use Input as Text]
    Scrape --> Extract{Extraction Success?}
    Extract -->|No| Error2[Scraping Error]
    Error2 --> ShowError[Display Toast]
    ShowError --> Input
    Extract -->|Yes| Content[Extracted Content]
    UseText --> Content
    Content --> Parallel[Parallel AI Generation]
    Parallel --> Groq1[Groq: Twitter]
    Parallel --> Groq2[Groq: LinkedIn]
    Parallel --> Groq3[Groq: Newsletter]
    Parallel --> Groq4[Groq: Instagram]
    Groq1 --> Results[Aggregate Results]
    Groq2 --> Results
    Groq3 --> Results
    Groq4 --> Results
    Results --> Response[Return JSON Response]
    Response --> Display[Display Results Grid]
    Display --> Preview[Source Preview Card]
    Display --> Grid[2x2 Platform Cards]
    Grid --> Copy[Copy to Clipboard]
    Copy --> End([Done])
    
    style Start fill:#8b5cf6,color:#fff
    style End fill:#10b981,color:#fff
    style Error1 fill:#ef4444,color:#fff
    style Error2 fill:#ef4444,color:#fff
    style Parallel fill:#3b82f6,color:#fff
    style Groq1 fill:#3b82f6,color:#fff
    style Groq2 fill:#3b82f6,color:#fff
    style Groq3 fill:#3b82f6,color:#fff
    style Groq4 fill:#3b82f6,color:#fff
```

---

## Prompt 2: Repository Structure Diagram

```
Create a Mermaid.js mindmap showing the complete repository structure for "Content Shapeshifter Pro". Organize by:

1. Root Configuration Files:
   - package.json
   - tsconfig.json
   - next.config.js
   - tailwind.config.ts
   - postcss.config.js
   - .env.local
   - README.md

2. App Directory (Next.js App Router):
   - api/transform/route.ts
   - globals.css
   - layout.tsx
   - page.tsx

3. Source Code:
   - lib/scraper.ts
   - lib/prompts.ts
   - lib/utils.ts

4. Dependencies:
   - Framework: Next.js 14, React 18
   - Language: TypeScript 5
   - Styling: Tailwind CSS
   - AI: Groq SDK
   - Scraping: Cheerio, Axios
   - UI: Lucide React, Sonner

Use different colors for different categories and show the relationship between files.
```

**Expected Output:**

```mermaid
mindmap
  root((Content Shapeshifter Pro))
    Configuration
      package.json
      tsconfig.json
      next.config.js
      tailwind.config.ts
      postcss.config.js
      .env.local
      next-env.d.ts
    App Directory
      api
        transform
          route.ts
      globals.css
      layout.tsx
      page.tsx
    Source
      lib
        scraper.ts
        prompts.ts
        utils.ts
    Dependencies
      Core
        Next.js 14
        React 18
        TypeScript 5
      Styling
        Tailwind CSS 3
        PostCSS
        Autoprefixer
      AI/Scraping
        Groq SDK
        Cheerio
        Axios
      UI
        Lucide React
        Sonner
```

---

## Prompt 3: System Architecture Diagram

```
Create a Mermaid.js architecture diagram showing the complete system architecture for "Content Shapeshifter Pro". Include layers:

1. Presentation Layer:
   - Browser/Client
   - React Components
   - State Management
   - UI Components (Lucide, Tailwind)

2. Application Layer:
   - Next.js App Router
   - API Routes
   - Server Actions
   - Middleware

3. Business Logic Layer:
   - Content Scraping Service
   - AI Generation Service
   - Transformation Engine
   - Error Handler

4. External Services:
   - Groq API (Llama 3)
   - Target Websites (for scraping)

5. Infrastructure:
   - Vercel (hosting)
   - Environment Variables
   - Build Process

Show data flow between layers with arrows. Use component diagrams with clear separation of concerns.
```

**Expected Output:**

```mermaid
graph TB
    subgraph Client["Client Layer"]
        Browser["Browser"]
        React["React Components"]
        State["State Management"]
        UI["Tailwind + Lucide"]
    end
    
    subgraph App["Application Layer"]
        Router["Next.js App Router"]
        API["API Routes"]
        Actions["Server Actions"]
    end
    
    subgraph Logic["Business Logic"]
        Scraper["Content Scraper"]
        Transformer["AI Transformer"]
        Validator["Input Validator"]
        ErrorHandler["Error Handler"]
    end
    
    subgraph External["External Services"]
        Groq["Groq API (Llama 3)"]
        Websites["Target Websites"]
    end
    
    subgraph Infra["Infrastructure"]
        Vercel["Vercel Hosting"]
        Env["Environment Config"]
        Build["Build Pipeline"]
    end
    
    Browser --> React
    React --> State
    React --> UI
    React --> Router
    Router --> API
    API --> Validator
    Validator --> Scraper
    Validator --> Transformer
    Scraper -->|HTTP| Websites
    Transformer -->|API| Groq
    API --> ErrorHandler
    Build --> Vercel
    Env --> API
    
    style Client fill:#e0e7ff,color:#1e1b4b
    style App fill:#dbeafe,color:#1e3a8a
    style Logic fill:#dcfce7,color:#14532d
    style External fill:#fef3c7,color:#92400e
    style Infra fill:#f3e8ff,color:#581c87
```

---

## Prompt 4: Data Flow Sequence Diagram

```
Create a Mermaid.js sequence diagram showing the data flow for transforming a URL into 4 platform variants. Include:

Actors:
- User
- Browser (Frontend)
- Next.js API Route
- Scraper Service
- Groq Service

Sequence:
1. User submits URL
2. Frontend validates and sends to API
3. API detects URL and calls scraper
4. Scraper fetches and parses webpage
5. Scraper returns extracted content
6. API parallel calls Groq 4 times
7. Groq returns AI-generated content
8. API aggregates and returns response
9. Frontend displays results
10. User copies content

Include timing annotations and show parallel processing clearly.
```

**Expected Output:**

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant F as Browser/Frontend
    participant A as API Route
    participant S as Scraper Service
    participant G as Groq API
    participant W as Target Website

    U->>F: 1. Enter URL & Submit
    F->>F: 2. Validate Input
    F->>A: 3. POST /api/transform<br/>{input: url}
    A->>A: 4. Detect URL Pattern
    A->>S: 5. Call extractContent(url)
    S->>W: 6. HTTP GET Request
    W-->>S: 7. HTML Response
    S->>S: 8. Parse with Cheerio
    S-->>A: 9. Return {text, imageUrl}
    
    Note over A,G: Parallel AI Generation
    
    par Twitter Generation
        A->>G: 10a. Request Twitter Thread
        G-->>A: 11a. Twitter Content
    and LinkedIn Generation
        A->>G: 10b. Request LinkedIn Post
        G-->>A: 11b. LinkedIn Content
    and Newsletter Generation
        A->>G: 10c. Request Newsletter
        G-->>A: 11c. Newsletter Content
    and Instagram Generation
        A->>G: 10d. Request Instagram
        G-->>A: 11d. Instagram Content
    end
    
    A->>A: 12. Aggregate Results
    A-->>F: 13. Return JSON Response
    F->>F: 14. Render Results Grid
    F-->>U: 15. Display 4 Platform Cards
    U->>F: 16. Click Copy Button
    F->>F: 17. Copy to Clipboard
    F-->>U: 18. Show Success Toast
```

---

## How to Use These Diagrams

1. **Mermaid Live Editor**: Visit https://mermaid.live/ and paste the code
2. **GitHub/GitLab**: Mermaid diagrams render natively in Markdown
3. **VS Code**: Install Mermaid extension for live preview
4. **Documentation**: Embed in README.md or documentation sites

## Tips for Best Results

- Use `%%{init: {'theme': 'dark'}}%%` at the top for dark mode
- Add `autonumber` for sequence diagrams
- Use `style` or `classDef` for custom colors
- Keep diagrams under 30 nodes for readability
- Use subgraphs to organize complex diagrams