// ===========================================
// AI Prototypes - Core AI Services Library
// ===========================================

// Gemini
export { geminiFlash, defaultModel } from "./gemini/client";
export {
  analyzeImage,
  detectDefects,
  extractText,
  detectObjects,
  type VisionAnalysisResult,
} from "./gemini/vision";
export {
  embeddingModel,
  generateEmbedding,
  generateEmbeddings,
  cosineSimilarity,
} from "./gemini/embeddings";

// RAG Utilities
export { loadPdf, loadPdfFromBase64, type LoadedDocument } from "./rag/pdf-loader";
export { chunkText, chunkByParagraphs, type TextChunk, type ChunkOptions } from "./rag/chunker";
export { InMemoryVectorStore, type VectorDocument, type SearchResult } from "./rag/vector-store";

// Google Cloud Vision API
export {
  createVisionClient,
  getVisionClient,
  analyzeImageWithVision,
  detectLabels,
  detectObjectsWithBoxes,
  extractTextWithVision,
  extractDocumentText,
  type BoundingBox,
  type DetectedLabel,
  type DetectedObject,
  type DetectedText,
  type CloudVisionResult,
} from "./gcp-vision";

// Google Document AI
export {
  createDocumentAIClient,
  getDocumentAIClient,
  getProcessorName,
  processDocument,
  processPdf,
  processImage,
  extractDocumentAIText,
  type ProcessorConfig,
  type ExtractedEntity,
  type ExtractedTable,
  type DocumentAIResult,
} from "./gcp-document-ai";

// AWS Rekognition
export {
  createRekognitionClient,
  getRekognitionClient,
  detectLabelsWithRekognition,
  detectTextWithRekognition,
  extractTextWithRekognition,
  detectFacesWithRekognition,
  detectModerationLabels,
  recognizeCelebrities,
  type RekognitionLabel,
  type RekognitionText,
  type RekognitionFace,
  type RekognitionModerationLabel,
} from "./aws-rekognition";

// AWS Textract
export {
  createTextractClient,
  getTextractClient,
  detectDocumentText,
  extractTextWithTextract,
  analyzeDocument,
  analyzeExpense,
  type TextractLine,
  type TextractTable,
  type TextractKeyValue,
  type TextractExpenseItem,
  type TextractExpense,
} from "./aws-textract";
