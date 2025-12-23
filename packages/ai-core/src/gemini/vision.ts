import { generateText } from "ai";
import { geminiFlash } from "./client";

export interface VisionAnalysisResult {
  description: string;
  labels: string[];
  confidence: number;
}

/**
 * Analyze an image using Gemini Vision
 * @param imageBase64 - Base64 encoded image data
 * @param prompt - Custom prompt for analysis
 * @returns Analysis result
 */
export async function analyzeImage(
  imageBase64: string,
  prompt: string = "Describe this image in detail."
): Promise<string> {
  const result = await generateText({
    model: geminiFlash,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image",
            image: imageBase64,
          },
        ],
      },
    ],
  });

  return result.text;
}

/**
 * Detect defects in an image (for manufacturing use cases)
 */
export async function detectDefects(imageBase64: string): Promise<string> {
  return analyzeImage(
    imageBase64,
    `You are a quality control inspector. Analyze this image for any defects, damage, or quality issues.

    Provide your analysis in the following format:
    - Status: [PASS/FAIL/WARNING]
    - Defects Found: [List any defects or "None"]
    - Confidence: [High/Medium/Low]
    - Recommendations: [Any actions needed]`
  );
}

/**
 * Extract text from an image using OCR
 */
export async function extractText(imageBase64: string): Promise<string> {
  return analyzeImage(
    imageBase64,
    `Extract all text from this image. Return the text exactly as it appears, preserving the layout as much as possible. If no text is found, respond with "No text detected."`
  );
}

/**
 * Detect objects in an image
 */
export async function detectObjects(imageBase64: string): Promise<string> {
  return analyzeImage(
    imageBase64,
    `Identify and list all objects visible in this image. For each object, provide:
    - Object name
    - Approximate location (e.g., center, top-left, bottom-right)
    - Confidence level (High/Medium/Low)

    Format as a structured list.`
  );
}
