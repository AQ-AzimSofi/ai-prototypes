import { NextRequest, NextResponse } from "next/server";
import { loadPdf, chunkText } from "@ai-prototypes/ai-core";
import { getVectorStore } from "@/lib/vector-store-manager";
import { type PersonaType } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const persona = (formData.get("persona") as PersonaType) || "general";
    const volumeNumber = parseInt(formData.get("volumeNumber") as string) || 1;

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

    // For general mode, return full context
    if (persona === "general") {
      const context = chunks.map((c) => c.content).join("\n\n");

      return NextResponse.json({
        success: true,
        filename: file.name,
        pageCount: document.metadata.pageCount,
        chunkCount: chunks.length,
        context,
      });
    }

    // For novel mode, add chunks to vector store with volume metadata
    const vectorStore = getVectorStore();

    await vectorStore.addDocuments(
      chunks.map((chunk, index) => ({
        id: `${file.name}-vol${volumeNumber}-chunk${index}`,
        content: chunk.content,
        metadata: {
          volumeNumber,
          filename: file.name,
          chunkIndex: index,
        },
      }))
    );

    return NextResponse.json({
      success: true,
      id: `vol-${volumeNumber}`,
      filename: file.name,
      pageCount: document.metadata.pageCount,
      chunkCount: chunks.length,
      volumeNumber,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process PDF" },
      { status: 500 }
    );
  }
}
