import {
  DetectDocumentTextCommand,
  AnalyzeDocumentCommand,
  AnalyzeExpenseCommand,
  type Block,
} from "@aws-sdk/client-textract";
import { getTextractClient } from "./client";

export interface TextractLine {
  text: string;
  confidence: number;
  page: number;
}

export interface TextractTable {
  rows: string[][];
  confidence: number;
}

export interface TextractKeyValue {
  key: string;
  value: string;
  confidence: number;
}

export interface TextractExpenseItem {
  description: string;
  quantity: string;
  unitPrice: string;
  price: string;
}

export interface TextractExpense {
  vendorName: string;
  total: string;
  date: string;
  items: TextractExpenseItem[];
}

/**
 * Basic text detection (fastest, cheapest)
 */
export async function detectDocumentText(
  imageBytes: Buffer
): Promise<TextractLine[]> {
  const client = getTextractClient();

  const command = new DetectDocumentTextCommand({
    Document: { Bytes: imageBytes },
  });

  const response = await client.send(command);

  return (
    response.Blocks?.filter((block: Block) => block.BlockType === "LINE").map(
      (block: Block) => ({
        text: block.Text ?? "",
        confidence: block.Confidence ?? 0,
        page: block.Page ?? 1,
      })
    ) ?? []
  );
}

/**
 * Extract plain text from document
 */
export async function extractTextWithTextract(
  imageBytes: Buffer
): Promise<string> {
  const lines = await detectDocumentText(imageBytes);
  return lines.map((l) => l.text).join("\n");
}

/**
 * Analyze document for forms and tables
 */
export async function analyzeDocument(
  imageBytes: Buffer
): Promise<{
  text: string;
  tables: TextractTable[];
  keyValues: TextractKeyValue[];
}> {
  const client = getTextractClient();

  const command = new AnalyzeDocumentCommand({
    Document: { Bytes: imageBytes },
    FeatureTypes: ["TABLES", "FORMS"],
  });

  const response = await client.send(command);
  const blocks = response.Blocks ?? [];

  const blockMap = new Map<string, Block>();
  blocks.forEach((block) => {
    if (block.Id) blockMap.set(block.Id, block);
  });

  const lines = blocks
    .filter((b) => b.BlockType === "LINE")
    .map((b) => b.Text ?? "")
    .join("\n");

  const tables: TextractTable[] = [];
  const tableBlocks = blocks.filter((b) => b.BlockType === "TABLE");

  for (const table of tableBlocks) {
    const rows: string[][] = [];
    const cells = table.Relationships?.find((r) => r.Type === "CHILD")?.Ids ?? [];

    const cellBlocks = cells
      .map((id) => blockMap.get(id))
      .filter((b): b is Block => b !== undefined && b.BlockType === "CELL");

    const rowMap = new Map<number, Block[]>();
    cellBlocks.forEach((cell) => {
      const rowIndex = cell.RowIndex ?? 0;
      if (!rowMap.has(rowIndex)) rowMap.set(rowIndex, []);
      rowMap.get(rowIndex)?.push(cell);
    });

    Array.from(rowMap.keys())
      .sort((a, b) => a - b)
      .forEach((rowIndex) => {
        const rowCells = rowMap.get(rowIndex) ?? [];
        rowCells.sort((a, b) => (a.ColumnIndex ?? 0) - (b.ColumnIndex ?? 0));
        rows.push(rowCells.map((cell) => getCellText(cell, blockMap)));
      });

    tables.push({
      rows,
      confidence: table.Confidence ?? 0,
    });
  }

  const keyValues: TextractKeyValue[] = [];
  const keyBlocks = blocks.filter(
    (b) => b.BlockType === "KEY_VALUE_SET" && b.EntityTypes?.includes("KEY")
  );

  for (const keyBlock of keyBlocks) {
    const valueBlockId = keyBlock.Relationships?.find(
      (r) => r.Type === "VALUE"
    )?.Ids?.[0];
    const valueBlock = valueBlockId ? blockMap.get(valueBlockId) : undefined;

    if (valueBlock) {
      keyValues.push({
        key: getBlockText(keyBlock, blockMap),
        value: getBlockText(valueBlock, blockMap),
        confidence: keyBlock.Confidence ?? 0,
      });
    }
  }

  return { text: lines, tables, keyValues };
}

/**
 * Analyze expense documents (receipts, invoices)
 */
export async function analyzeExpense(
  imageBytes: Buffer
): Promise<TextractExpense> {
  const client = getTextractClient();

  const command = new AnalyzeExpenseCommand({
    Document: { Bytes: imageBytes },
  });

  const response = await client.send(command);
  const doc = response.ExpenseDocuments?.[0];

  let vendorName = "";
  let total = "";
  let date = "";

  doc?.SummaryFields?.forEach((field) => {
    const type = field.Type?.Text;
    const value = field.ValueDetection?.Text ?? "";

    if (type === "VENDOR_NAME") vendorName = value;
    if (type === "TOTAL") total = value;
    if (type === "INVOICE_RECEIPT_DATE") date = value;
  });

  const items: TextractExpenseItem[] =
    doc?.LineItemGroups?.flatMap(
      (group) =>
        group.LineItems?.map((item) => {
          const fields = item.LineItemExpenseFields ?? [];
          return {
            description:
              fields.find((f) => f.Type?.Text === "ITEM")?.ValueDetection
                ?.Text ?? "",
            quantity:
              fields.find((f) => f.Type?.Text === "QUANTITY")?.ValueDetection
                ?.Text ?? "",
            unitPrice:
              fields.find((f) => f.Type?.Text === "UNIT_PRICE")?.ValueDetection
                ?.Text ?? "",
            price:
              fields.find((f) => f.Type?.Text === "PRICE")?.ValueDetection
                ?.Text ?? "",
          };
        }) ?? []
    ) ?? [];

  return { vendorName, total, date, items };
}

// Helper functions
function getCellText(cell: Block, blockMap: Map<string, Block>): string {
  const childIds = cell.Relationships?.find((r) => r.Type === "CHILD")?.Ids ?? [];
  return childIds
    .map((id) => blockMap.get(id))
    .filter((b): b is Block => b !== undefined && b.BlockType === "WORD")
    .map((b) => b.Text ?? "")
    .join(" ");
}

function getBlockText(block: Block, blockMap: Map<string, Block>): string {
  const childIds = block.Relationships?.find((r) => r.Type === "CHILD")?.Ids ?? [];
  return childIds
    .map((id) => blockMap.get(id))
    .filter((b): b is Block => b !== undefined)
    .map((b) => b.Text ?? "")
    .join(" ");
}
