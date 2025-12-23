import { NextRequest, NextResponse } from "next/server";
import { analyzeImage, detectDefects, detectObjects } from "@ai-prototypes/ai-core";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { image, mode } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    let result: string;

    switch (mode) {
      case "defect":
        result = await detectDefects(image);
        break;
      case "objects":
        result = await detectObjects(image);
        break;
      default:
        result = await analyzeImage(image);
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze image" },
      { status: 500 }
    );
  }
}
