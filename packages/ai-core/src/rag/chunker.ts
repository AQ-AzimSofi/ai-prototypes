export interface TextChunk {
  content: string;
  index: number;
  startChar: number;
  endChar: number;
}

export interface ChunkOptions {
  /** Maximum characters per chunk */
  chunkSize?: number;
  /** Number of overlapping characters between chunks */
  overlap?: number;
}

const DEFAULT_CHUNK_SIZE = 1000;
const DEFAULT_OVERLAP = 200;

/**
 * Split text into overlapping chunks
 * Uses sentence boundaries when possible
 */
export function chunkText(text: string, options?: ChunkOptions): TextChunk[] {
  const chunkSize = options?.chunkSize ?? DEFAULT_CHUNK_SIZE;
  const overlap = options?.overlap ?? DEFAULT_OVERLAP;

  const chunks: TextChunk[] = [];
  let startChar = 0;
  let index = 0;

  while (startChar < text.length) {
    let endChar = Math.min(startChar + chunkSize, text.length);

    if (endChar < text.length) {
      const searchStart = Math.max(startChar + chunkSize - 100, startChar);
      const searchEnd = Math.min(startChar + chunkSize + 100, text.length);
      const searchText = text.slice(searchStart, searchEnd);

      const sentenceEnd = searchText.search(/[.!?]\s/);
      if (sentenceEnd !== -1) {
        endChar = searchStart + sentenceEnd + 2;
      }
    }

    chunks.push({
      content: text.slice(startChar, endChar).trim(),
      index,
      startChar,
      endChar,
    });

    startChar = endChar - overlap;
    if (startChar >= text.length) break;

    index++;
  }

  return chunks.filter((chunk) => chunk.content.length > 0);
}

/**
 * Split text by paragraphs (double newlines)
 */
export function chunkByParagraphs(text: string): TextChunk[] {
  const paragraphs = text.split(/\n\n+/);
  let charOffset = 0;

  return paragraphs
    .map((content, index) => {
      const chunk: TextChunk = {
        content: content.trim(),
        index,
        startChar: charOffset,
        endChar: charOffset + content.length,
      };
      charOffset += content.length + 2; // Account for \n\n
      return chunk;
    })
    .filter((chunk) => chunk.content.length > 0);
}
