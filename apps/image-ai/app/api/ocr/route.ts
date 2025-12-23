import { NextRequest, NextResponse } from "next/server";
import { extractText } from "@ai-prototypes/ai-core";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    const result = await extractText(image);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("OCR error:", error);
    return NextResponse.json(
      { error: "Failed to extract text" },
      { status: 500 }
    );
  }
}
