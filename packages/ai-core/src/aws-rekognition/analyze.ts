import {
  DetectLabelsCommand,
  DetectTextCommand,
  DetectFacesCommand,
  DetectModerationLabelsCommand,
  RecognizeCelebritiesCommand,
  type Label,
  type TextDetection,
  type FaceDetail,
  type ModerationLabel,
} from "@aws-sdk/client-rekognition";
import { getRekognitionClient } from "./client";

export interface RekognitionLabel {
  name: string;
  confidence: number;
  categories: string[];
}

export interface RekognitionText {
  text: string;
  confidence: number;
  type: "LINE" | "WORD";
}

export interface RekognitionFace {
  confidence: number;
  ageRange: { low: number; high: number };
  gender: string;
  emotions: Array<{ type: string; confidence: number }>;
  smile: boolean;
  eyeglasses: boolean;
  sunglasses: boolean;
  beard: boolean;
  mustache: boolean;
}

export interface RekognitionModerationLabel {
  name: string;
  confidence: number;
  parentName: string;
}

/**
 * Detect labels/objects in an image
 */
export async function detectLabelsWithRekognition(
  imageBytes: Buffer
): Promise<RekognitionLabel[]> {
  const client = getRekognitionClient();

  const command = new DetectLabelsCommand({
    Image: { Bytes: imageBytes },
    MaxLabels: 20,
    MinConfidence: 70,
  });

  const response = await client.send(command);

  return (
    response.Labels?.map((label: Label) => ({
      name: label.Name ?? "",
      confidence: label.Confidence ?? 0,
      categories: label.Categories?.map((c) => c.Name ?? "") ?? [],
    })) ?? []
  );
}

/**
 * Detect text in an image (OCR)
 */
export async function detectTextWithRekognition(
  imageBytes: Buffer
): Promise<RekognitionText[]> {
  const client = getRekognitionClient();

  const command = new DetectTextCommand({
    Image: { Bytes: imageBytes },
  });

  const response = await client.send(command);

  return (
    response.TextDetections?.map((text: TextDetection) => ({
      text: text.DetectedText ?? "",
      confidence: text.Confidence ?? 0,
      type: (text.Type as "LINE" | "WORD") ?? "WORD",
    })) ?? []
  );
}

/**
 * Extract full text from image
 */
export async function extractTextWithRekognition(
  imageBytes: Buffer
): Promise<string> {
  const texts = await detectTextWithRekognition(imageBytes);
  return texts
    .filter((t) => t.type === "LINE")
    .map((t) => t.text)
    .join("\n");
}

/**
 * Detect faces and analyze attributes
 */
export async function detectFacesWithRekognition(
  imageBytes: Buffer
): Promise<RekognitionFace[]> {
  const client = getRekognitionClient();

  const command = new DetectFacesCommand({
    Image: { Bytes: imageBytes },
    Attributes: ["ALL"],
  });

  const response = await client.send(command);

  return (
    response.FaceDetails?.map((face: FaceDetail) => ({
      confidence: face.Confidence ?? 0,
      ageRange: {
        low: face.AgeRange?.Low ?? 0,
        high: face.AgeRange?.High ?? 0,
      },
      gender: face.Gender?.Value ?? "Unknown",
      emotions:
        face.Emotions?.map((e) => ({
          type: e.Type ?? "",
          confidence: e.Confidence ?? 0,
        })) ?? [],
      smile: face.Smile?.Value ?? false,
      eyeglasses: face.Eyeglasses?.Value ?? false,
      sunglasses: face.Sunglasses?.Value ?? false,
      beard: face.Beard?.Value ?? false,
      mustache: face.Mustache?.Value ?? false,
    })) ?? []
  );
}

/**
 * Detect inappropriate content
 */
export async function detectModerationLabels(
  imageBytes: Buffer
): Promise<RekognitionModerationLabel[]> {
  const client = getRekognitionClient();

  const command = new DetectModerationLabelsCommand({
    Image: { Bytes: imageBytes },
    MinConfidence: 60,
  });

  const response = await client.send(command);

  return (
    response.ModerationLabels?.map((label: ModerationLabel) => ({
      name: label.Name ?? "",
      confidence: label.Confidence ?? 0,
      parentName: label.ParentName ?? "",
    })) ?? []
  );
}

/**
 * Recognize celebrities in an image
 */
export async function recognizeCelebrities(
  imageBytes: Buffer
): Promise<Array<{ name: string; confidence: number; urls: string[] }>> {
  const client = getRekognitionClient();

  const command = new RecognizeCelebritiesCommand({
    Image: { Bytes: imageBytes },
  });

  const response = await client.send(command);

  return (
    response.CelebrityFaces?.map((celeb) => ({
      name: celeb.Name ?? "",
      confidence: celeb.MatchConfidence ?? 0,
      urls: celeb.Urls ?? [],
    })) ?? []
  );
}
