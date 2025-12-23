# RAG Chatbot

> Chat with your PDF documents using RAG (Retrieval-Augmented Generation) and Google Gemini AI

<!-- ![Demo](./public/demo/demo.gif) -->

## Business Use Case

This prototype demonstrates a document-based Q&A system that enables users to upload PDF documents and ask questions about their content. The AI retrieves relevant sections and generates accurate, context-aware responses.

**Industries:** Legal, Healthcare, Education, Customer Support, Knowledge Management

## Features

- **PDF Upload**: Drag-and-drop interface for PDF documents
- **Text Chunking**: Automatic document segmentation for better retrieval
- **Streaming Responses**: Real-time AI response generation
- **Markdown Rendering**: Rich text formatting in chat responses

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 15 | Full-stack React framework |
| Vercel AI SDK | Streaming chat implementation |
| Google Gemini | LLM for text generation |
| pdf-parse | PDF text extraction |

## Cost Analysis

### API Costs (Gemini Free Tier)

| Metric | Free Tier Limit | This Demo Uses |
|--------|-----------------|----------------|
| Requests/day | 1500 | ~50 per session |
| Input tokens | Free | ~2000 per request (with context) |
| Output tokens | Free | ~500 per response |

**Estimated Monthly Cost: $0** (within free tier)

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Google AI Studio API key

### Installation

```bash
# From repository root
pnpm install

# Set up environment
cp .env.example .env.local
# Add your GOOGLE_GENERATIVE_AI_API_KEY

# Run development server
pnpm dev --filter=@ai-prototypes/chatbot-rag
```

Then open [http://localhost:3001](http://localhost:3001)

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini API key from [AI Studio](https://aistudio.google.com/apikey) | Yes |

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   PDF Upload    │────▶│  Text Chunking  │────▶│  Context Store  │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                          │
┌─────────────────┐     ┌─────────────────┐              │
│   User Query    │────▶│  Gemini + RAG   │◀─────────────┘
└─────────────────┘     └────────┬────────┘
                                  │
                        ┌────────▼────────┐
                        │ Streaming Chat  │
                        └─────────────────┘
```

## Limitations & Future Improvements

- [ ] Add vector embeddings for semantic search (currently uses full context)
- [ ] Support for multiple documents
- [ ] Persistent storage for documents
- [ ] Citation/source highlighting
- [ ] Support for other file types (DOCX, TXT)

---

Built as part of [AI Prototypes Repository](../../README.md) | 2025
