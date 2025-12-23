import { google } from "@ai-sdk/google";
import { embed, embedMany, type EmbeddingModel } from "ai";

/**
 * Gemini embedding model
 * Used for RAG and semantic search
 */
export const embeddingModel: EmbeddingModel<string> = google.textEmbeddingModel("text-embedding-004");

/**
 * Generate embedding for a single text
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const result = await embed({
    model: embeddingModel,
    value: text,
  });
  return result.embedding;
}

/**
 * Generate embeddings for multiple texts
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const result = await embedMany({
    model: embeddingModel,
    values: texts,
  });
  return result.embeddings;
}

/**
 * Calculate cosine similarity between two embeddings
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += (a[i] ?? 0) * (b[i] ?? 0);
    normA += (a[i] ?? 0) ** 2;
    normB += (b[i] ?? 0) ** 2;
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
