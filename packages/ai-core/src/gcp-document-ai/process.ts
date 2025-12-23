import { getDocumentAIClient, getProcessorName, type ProcessorConfig } from "./client";

export interface ExtractedEntity {
  type: string;
  mentionText: string;
  confidence: number;
}

export interface ExtractedTable {
  headers: string[];
  rows: string[][];
}

export interface DocumentAIResult {
  text: string;
  pages: number;
  entities: ExtractedEntity[];
  tables: ExtractedTable[];
}

/**
 * Process a document with Document AI
 * Supports PDF, images, and other document formats
 */
export async function processDocument(
  content: string,
  mimeType: string,
  config: ProcessorConfig
): Promise<DocumentAIResult> {
  const client = getDocumentAIClient();
  const name = getProcessorName(config);

  const [result] = await client.processDocument({
    name,
    rawDocument: {
      content,
      mimeType,
    },
  });

  const document = result.document;

  return {
    text: document?.text ?? "",
    pages: document?.pages?.length ?? 0,
    entities:
      document?.entities?.map((entity) => ({
        type: entity.type ?? "",
        mentionText: entity.mentionText ?? "",
        confidence: entity.confidence ?? 0,
      })) ?? [],
    tables:
      document?.pages?.flatMap(
        (page) =>
          page.tables?.map((table) => ({
            headers:
              table.headerRows?.flatMap(
                (row) =>
                  row.cells?.map(
                    (cell) =>
                      cell.layout?.textAnchor?.textSegments
                        ?.map((seg) =>
                          document.text?.slice(
                            Number(seg.startIndex ?? 0),
                            Number(seg.endIndex ?? 0)
                          )
                        )
                        .join("") ?? ""
                  ) ?? []
              ) ?? [],
            rows:
              table.bodyRows?.map(
                (row) =>
                  row.cells?.map(
                    (cell) =>
                      cell.layout?.textAnchor?.textSegments
                        ?.map((seg) =>
                          document.text?.slice(
                            Number(seg.startIndex ?? 0),
                            Number(seg.endIndex ?? 0)
                          )
                        )
                        .join("") ?? ""
                  ) ?? []
              ) ?? [],
          })) ?? []
      ) ?? [],
  };
}

/**
 * Process a PDF document
 */
export async function processPdf(
  pdfBase64: string,
  config: ProcessorConfig
): Promise<DocumentAIResult> {
  return processDocument(pdfBase64, "application/pdf", config);
}

/**
 * Process an image document
 */
export async function processImage(
  imageBase64: string,
  config: ProcessorConfig,
  mimeType: string = "image/png"
): Promise<DocumentAIResult> {
  return processDocument(imageBase64, mimeType, config);
}

/**
 * Extract text only (simpler output)
 */
export async function extractDocumentAIText(
  content: string,
  mimeType: string,
  config: ProcessorConfig
): Promise<string> {
  const result = await processDocument(content, mimeType, config);
  return result.text;
}
