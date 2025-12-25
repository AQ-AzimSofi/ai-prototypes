import {
  PgVectorStore,
  type PgSearchResult,
} from "@ai-prototypes/ai-core";

// Server-side singleton for vector store
let vectorStore: PgVectorStore | null = null;

export function getVectorStore(): PgVectorStore {
  if (!vectorStore) {
    vectorStore = new PgVectorStore(process.env.DATABASE_URL);
  }
  return vectorStore;
}

export async function clearVectorStore(): Promise<void> {
  const store = getVectorStore();
  await store.clear();
}

export async function getVectorStoreSize(): Promise<number> {
  const store = getVectorStore();
  return store.size();
}

/**
 * Search with volume filter for novel mode
 * Only returns results from volumes before the current reading volume
 */
export async function searchWithVolumeFilter(
  query: string,
  maxVolume: number,
  topK: number = 10
): Promise<PgSearchResult[]> {
  const store = getVectorStore();
  return store.searchWithVolumeFilter(query, maxVolume, topK);
}

/**
 * Get all volumes that have been indexed
 */
export async function getIndexedVolumes(): Promise<number[]> {
  const store = getVectorStore();
  return store.getIndexedVolumes();
}

/**
 * Delete a volume from the store
 */
export async function deleteVolume(volumeNumber: number): Promise<void> {
  const store = getVectorStore();
  await store.deleteByVolume(volumeNumber);
}
