# Image AI

> Image recognition suite powered by Google Gemini Vision API

<!-- ![Demo](./public/demo/demo.gif) -->

## Business Use Case

This prototype demonstrates various image recognition capabilities that can be applied across industries:

- **Manufacturing**: Automated quality control and defect detection
- **Document Processing**: OCR for digitizing paper documents
- **Retail**: Product recognition and inventory management
- **Healthcare**: Medical image analysis assistance

## Features

- **Defect Detection**: Analyze products for manufacturing defects, damage, or quality issues
- **OCR / Text Extraction**: Extract text from images, documents, receipts
- **Object Detection**: Identify and locate objects with confidence levels
- **Drag-and-Drop Upload**: Easy image upload interface

## Demos

| Demo | Description | Use Case |
|------|-------------|----------|
| `/defect-detection` | Quality control analysis | Manufacturing |
| `/ocr` | Text extraction from images | Document processing |
| `/object-detection` | Object identification | General purpose |

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 15 | Full-stack React framework |
| Gemini Vision | Image analysis API |
| react-dropzone | File upload handling |

## Cost Analysis

### API Costs (Gemini Free Tier)

| Metric | Free Tier Limit | This Demo Uses |
|--------|-----------------|----------------|
| Requests/day | 1500 | ~1 per analysis |
| Image input | Free | 1 image per request |

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
pnpm dev --filter=@ai-prototypes/image-ai
```

Then open [http://localhost:3002](http://localhost:3002)

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini API key from [AI Studio](https://aistudio.google.com/apikey) | Yes |

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│  Image Upload   │────▶│  Base64 Encode  │
└─────────────────┘     └────────┬────────┘
                                  │
                        ┌────────▼────────┐
                        │  Gemini Vision  │
                        │      API        │
                        └────────┬────────┘
                                  │
                        ┌────────▼────────┐
                        │  Markdown       │
                        │  Response       │
                        └─────────────────┘
```

## Limitations & Future Improvements

- [ ] Add batch image processing
- [ ] Support for video analysis
- [ ] Bounding box visualization
- [ ] Custom prompt templates
- [ ] Image comparison (before/after)

---

Built as part of [AI Prototypes Repository](../../README.md) | 2025
