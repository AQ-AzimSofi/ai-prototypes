import { Pool, type PoolConfig } from "pg";
import { generateEmbedding } from "../gemini/embeddings";

export interface PgVectorDocument {
  id: string;
  content: string;
  metadata?: Record<string, unknown>;
  score?: number;
}

export interface PgSearchResult {
  document: PgVectorDocument;
  score: number;
}

/**
 * PostgreSQL + pgvector based vector store
 * Provides persistent storage for embeddings
 */
export class PgVectorStore {
  private pool: Pool;
  private initialized: boolean = false;

  constructor(connectionString?: string, config?: PoolConfig) {
    this.pool = new Pool({
      connectionString: connectionString || process.env.DATABASE_URL,
      ...config,
    });
  }

  /**
   * Initialize the database schema
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    await this.pool.query(`CREATE EXTENSION IF NOT EXISTS vector`);

    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        embedding vector(768),
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create indexes if they don't exist
    await this.pool.query(`
      CREATE INDEX IF NOT EXISTS documents_embedding_idx
        ON documents
        USING ivfflat (embedding vector_cosine_ops)
        WITH (lists = 100)
    `).catch(() => {
      // Index might fail if not enough rows, that's ok
    });

    await this.pool.query(`
      CREATE INDEX IF NOT EXISTS documents_metadata_idx
        ON documents
        USING gin (metadata)
    `);

    this.initialized = true;
  }

  /**
   * Add a single document to the store
   */
  async addDocument(
    id: string,
    content: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    await this.initialize();

    const embedding = await generateEmbedding(content);
    const embeddingStr = `[${embedding.join(",")}]`;

    await this.pool.query(
      `INSERT INTO documents (id, content, embedding, metadata)
       VALUES ($1, $2, $3::vector, $4)
       ON CONFLICT (id) DO UPDATE SET
         content = EXCLUDED.content,
         embedding = EXCLUDED.embedding,
         metadata = EXCLUDED.metadata`,
      [id, content, embeddingStr, JSON.stringify(metadata || {})]
    );
  }

  /**
   * Add multiple documents to the store
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
  async search(query: string, topK: number = 5): Promise<PgSearchResult[]> {
    await this.initialize();

    const queryEmbedding = await generateEmbedding(query);
    const embeddingStr = `[${queryEmbedding.join(",")}]`;

    const result = await this.pool.query(
      `SELECT id, content, metadata, 1 - (embedding <=> $1::vector) as score
       FROM documents
       ORDER BY embedding <=> $1::vector
       LIMIT $2`,
      [embeddingStr, topK]
    );

    return result.rows.map((row) => ({
      document: {
        id: row.id,
        content: row.content,
        metadata: row.metadata,
      },
      score: parseFloat(row.score),
    }));
  }

  /**
   * Search with volume filter for novel mode
   * Only returns results from volumes before maxVolume
   */
  async searchWithVolumeFilter(
    query: string,
    maxVolume: number,
    topK: number = 10
  ): Promise<PgSearchResult[]> {
    await this.initialize();

    const queryEmbedding = await generateEmbedding(query);
    const embeddingStr = `[${queryEmbedding.join(",")}]`;

    const result = await this.pool.query(
      `SELECT id, content, metadata, 1 - (embedding <=> $1::vector) as score
       FROM documents
       WHERE (metadata->>'volumeNumber')::int < $2
       ORDER BY embedding <=> $1::vector
       LIMIT $3`,
      [embeddingStr, maxVolume, topK]
    );

    return result.rows.map((row) => ({
      document: {
        id: row.id,
        content: row.content,
        metadata: row.metadata,
      },
      score: parseFloat(row.score),
    }));
  }

  /**
   * Get all documents
   */
  async getAll(): Promise<PgVectorDocument[]> {
    await this.initialize();

    const result = await this.pool.query(
      `SELECT id, content, metadata FROM documents ORDER BY created_at`
    );

    return result.rows.map((row) => ({
      id: row.id,
      content: row.content,
      metadata: row.metadata,
    }));
  }

  /**
   * Get document count
   */
  async size(): Promise<number> {
    await this.initialize();

    const result = await this.pool.query(`SELECT COUNT(*) FROM documents`);
    return parseInt(result.rows[0].count);
  }

  /**
   * Delete a document by ID
   */
  async delete(id: string): Promise<void> {
    await this.pool.query(`DELETE FROM documents WHERE id = $1`, [id]);
  }

  /**
   * Delete documents by volume number
   */
  async deleteByVolume(volumeNumber: number): Promise<void> {
    await this.pool.query(
      `DELETE FROM documents WHERE (metadata->>'volumeNumber')::int = $1`,
      [volumeNumber]
    );
  }

  /**
   * Clear all documents
   */
  async clear(): Promise<void> {
    await this.pool.query(`DELETE FROM documents`);
  }

  /**
   * Get all indexed volume numbers
   */
  async getIndexedVolumes(): Promise<number[]> {
    await this.initialize();

    const result = await this.pool.query(
      `SELECT DISTINCT (metadata->>'volumeNumber')::int as volume
       FROM documents
       WHERE metadata->>'volumeNumber' IS NOT NULL
       ORDER BY volume`
    );

    return result.rows.map((row) => row.volume);
  }

  /**
   * Close the connection pool
   */
  async close(): Promise<void> {
    await this.pool.end();
  }
}
