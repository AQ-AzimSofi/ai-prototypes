import { NextRequest, NextResponse } from "next/server";
import { loadPdf, chunkText } from "@ai-prototypes/ai-core";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.name.endsWith(".pdf")) {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const document = await loadPdf(buffer);

    // Chunk the text for better context
    const chunks = chunkText(document.content, {
      chunkSize: 1000,
      overlap: 200,
    });

    // TODO: Implement vector store and retrieval
    const context = chunks.map((c) => c.content).join("\n\n");

    return NextResponse.json({
      success: true,
      filename: file.name,
      pageCount: document.metadata.pageCount,
      chunkCount: chunks.length,
      context,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process PDF" },
      { status: 500 }
    );
  }
}
