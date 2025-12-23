import { generateEmbedding, cosineSimilarity } from "../gemini/embeddings";

export interface VectorDocument {
  id: string;
  content: string;
  embedding: number[];
  metadata?: Record<string, unknown>;
}

export interface SearchResult {
  document: VectorDocument;
  score: number;
}

/**
 * Simple in-memory vector store
 * Good for prototypes, replace with Pinecone/Supabase for production
 */
export class InMemoryVectorStore {
  private documents: VectorDocument[] = [];

  /**
   * Add a document to the store
   */
  async addDocument(
    id: string,
    content: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    const embedding = await generateEmbedding(content);
    this.documents.push({ id, content, embedding, metadata });
  }

  /**
   * Add multiple documents
   */
  async addDocuments(
    docs: Array<{ id: string; content: string; metadata?: Record<string, unknown> }>
  ): Promise<void> {
    for (const doc of docs) {
      await this.addDocument(doc.id, doc.content, doc.metadata);
    }
  }

  /**
   * Search for similar documents
   */
  async search(query: string, topK: number = 5): Promise<SearchResult[]> {
    const queryEmbedding = await generateEmbedding(query);

    const results = this.documents
      .map((doc) => ({
        document: doc,
        score: cosineSimilarity(queryEmbedding, doc.embedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return results;
  }

  /**
   * Get all documents
   */
  getAll(): VectorDocument[] {
    return [...this.documents];
  }

  /**
   * Clear all documents
   */
  clear(): void {
    this.documents = [];
  }

  /**
   * Get document count
   */
  get size(): number {
    return this.documents.length;
  }
}
