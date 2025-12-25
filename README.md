# AI Prototypes

> My goal: Build 10 AI prototypes in 2025-2026

A collection of AI prototypes built with Next.js, TypeScript, and Google Gemini. This monorepo serves as a personal learning lab and component library for quickly spinning up AI applications.

## Prototypes (might or might not build lol)

| # | Prototype | Description | Status |
|---|-----------|-------------|--------|
| 1 | [chatbot-rag](./apps/chatbot-rag) | RAG-powered document Q&A chatbot | Done |
| 2 | [image-ai](./apps/image-ai) | Image recognition suite (defects, OCR, objects) | Done |
| 3 | Voice Assistant | Speech-to-text + LLM + TTS | Planned |
| 4 | AI Agent | Multi-step tool use with Gemini | Planned |
| 5 | Code Assistant | Code generation and explanation | Planned |
| 6 | Sentiment Analysis | Social media/review analysis | Planned |
| 7 | Content Generator | Blog/marketing copy | Planned |
| 8 | Data Extractor | Structured data from unstructured text | Planned |
| 9 | Recommendation Engine | Embedding-based similarity | Planned |
| 10 | Multimodal Search | Image + text search | Planned |

## Tech Stack

- **Build System**: Turborepo + pnpm workspaces
- **Frontend**: Next.js 15 (App Router, TypeScript)
- **AI**: Google Gemini 2.5/3.0 Flash (free tier)
- **Streaming**: Vercel AI SDK
- **UI**: shadcn/ui + Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Google AI Studio API key ([Get one free](https://aistudio.google.com/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/AQ-AzimSofi/ai-prototypes.git
cd ai-prototypes

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your GOOGLE_GENERATIVE_AI_API_KEY
```

### Development

```bash
# Run all apps in development mode
pnpm dev

# Run a specific app
pnpm dev --filter=@ai-prototypes/chatbot-rag
pnpm dev --filter=@ai-prototypes/image-ai
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps |
| `pnpm lint` | Run ESLint across all packages |
| `pnpm type-check` | Run TypeScript type checking |
| `pnpm clean` | Clean all build artifacts |

## Project Structure

```
ai-prototypes/
├── apps/
│   ├── chatbot-rag/        # RAG chatbot prototype
│   └── image-ai/           # Image recognition prototype
├── packages/
│   ├── ui/                 # Shared UI components (shadcn/ui)
│   ├── ai-core/            # Shared AI utilities (Gemini, RAG)
│   ├── eslint-config/      # Shared ESLint configuration
│   └── typescript-config/  # Shared TypeScript configuration
├── templates/              # README templates
├── turbo.json              # Turborepo configuration
└── pnpm-workspace.yaml     # pnpm workspace configuration
```

## Shared Packages

### @ai-prototypes/ai-core

Core AI utilities including:
- Gemini client wrapper (text, vision, embeddings)
- RAG utilities (PDF loading, text chunking, vector store)

### @ai-prototypes/ui

Shared UI components based on shadcn/ui:
- Button, Card, Input, Textarea
- FileUpload (drag-and-drop)
- LoadingSpinner
- MarkdownRenderer

## Cost

All prototypes are designed to run within free tier limits:

| Service | Free Tier | Monthly Cost |
|---------|-----------|--------------|
| Google Gemini | 1500 req/day | $0 |
| Local Development | Unlimited | $0 |

## License

MIT

---

Built with curiosity
