import pdf from "pdf-parse";

export interface LoadedDocument {
  content: string;
  metadata: {
    pageCount: number;
    title?: string;
    author?: string;
  };
}

/**
 * Load and extract text from a PDF buffer
 */
export async function loadPdf(buffer: Buffer): Promise<LoadedDocument> {
  const data = await pdf(buffer);

  return {
    content: data.text,
    metadata: {
      pageCount: data.numpages,
      title: data.info?.Title,
      author: data.info?.Author,
    },
  };
}

/**
 * Load PDF from base64 string
 */
export async function loadPdfFromBase64(
  base64: string
): Promise<LoadedDocument> {
  const buffer = Buffer.from(base64, "base64");
  return loadPdf(buffer);
}
