import { getVisionClient } from "./client";
import type { protos } from "@google-cloud/vision";

type IEntityAnnotation = protos.google.cloud.vision.v1.IEntityAnnotation;
type ILocalizedObjectAnnotation = protos.google.cloud.vision.v1.ILocalizedObjectAnnotation;

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DetectedLabel {
  description: string;
  score: number;
}

export interface DetectedObject {
  name: string;
  score: number;
  boundingBox: BoundingBox;
}

export interface DetectedText {
  text: string;
  boundingBox?: BoundingBox;
}

export interface CloudVisionResult {
  labels: DetectedLabel[];
  objects: DetectedObject[];
  text: DetectedText[];
  faces: number;
  safeSearch: {
    adult: string;
    violence: string;
    racy: string;
  };
}

/**
 * Analyze image with multiple detection types
 */
export async function analyzeImageWithVision(
  imageBase64: string
): Promise<CloudVisionResult> {
  const client = getVisionClient();

  const [result] = await client.annotateImage({
    image: { content: imageBase64 },
    features: [
      { type: "LABEL_DETECTION", maxResults: 10 },
      { type: "OBJECT_LOCALIZATION", maxResults: 10 },
      { type: "TEXT_DETECTION" },
      { type: "FACE_DETECTION" },
      { type: "SAFE_SEARCH_DETECTION" },
    ],
  });

  return {
    labels:
      result.labelAnnotations?.map((label: IEntityAnnotation) => ({
        description: label.description ?? "",
        score: label.score ?? 0,
      })) ?? [],
    objects:
      result.localizedObjectAnnotations?.map((obj: ILocalizedObjectAnnotation) => ({
        name: obj.name ?? "",
        score: obj.score ?? 0,
        boundingBox: {
          x: obj.boundingPoly?.normalizedVertices?.[0]?.x ?? 0,
          y: obj.boundingPoly?.normalizedVertices?.[0]?.y ?? 0,
          width:
            (obj.boundingPoly?.normalizedVertices?.[1]?.x ?? 0) -
            (obj.boundingPoly?.normalizedVertices?.[0]?.x ?? 0),
          height:
            (obj.boundingPoly?.normalizedVertices?.[2]?.y ?? 0) -
            (obj.boundingPoly?.normalizedVertices?.[0]?.y ?? 0),
        },
      })) ?? [],
    text:
      result.textAnnotations?.map((text: IEntityAnnotation) => ({
        text: text.description ?? "",
        boundingBox: text.boundingPoly?.vertices?.[0]
          ? {
              x: text.boundingPoly.vertices[0].x ?? 0,
              y: text.boundingPoly.vertices[0].y ?? 0,
              width:
                (text.boundingPoly.vertices[1]?.x ?? 0) -
                (text.boundingPoly.vertices[0].x ?? 0),
              height:
                (text.boundingPoly.vertices[2]?.y ?? 0) -
                (text.boundingPoly.vertices[0].y ?? 0),
            }
          : undefined,
      })) ?? [],
    faces: result.faceAnnotations?.length ?? 0,
    safeSearch: {
      adult: String(result.safeSearchAnnotation?.adult ?? "UNKNOWN"),
      violence: String(result.safeSearchAnnotation?.violence ?? "UNKNOWN"),
      racy: String(result.safeSearchAnnotation?.racy ?? "UNKNOWN"),
    },
  };
}

/**
 * Detect labels/tags in an image
 */
export async function detectLabels(
  imageBase64: string
): Promise<DetectedLabel[]> {
  const client = getVisionClient();

  const [result] = await client.labelDetection({
    image: { content: imageBase64 },
  });

  return (
    result.labelAnnotations?.map((label: IEntityAnnotation) => ({
      description: label.description ?? "",
      score: label.score ?? 0,
    })) ?? []
  );
}

/**
 * Detect objects with bounding boxes
 */
export async function detectObjectsWithBoxes(
  imageBase64: string
): Promise<DetectedObject[]> {
  const client = getVisionClient();

  const [result] = await client.annotateImage({
    image: { content: imageBase64 },
    features: [{ type: "OBJECT_LOCALIZATION", maxResults: 20 }],
  });

  return (
    result.localizedObjectAnnotations?.map((obj: ILocalizedObjectAnnotation) => ({
      name: obj.name ?? "",
      score: obj.score ?? 0,
      boundingBox: {
        x: obj.boundingPoly?.normalizedVertices?.[0]?.x ?? 0,
        y: obj.boundingPoly?.normalizedVertices?.[0]?.y ?? 0,
        width:
          (obj.boundingPoly?.normalizedVertices?.[1]?.x ?? 0) -
          (obj.boundingPoly?.normalizedVertices?.[0]?.x ?? 0),
        height:
          (obj.boundingPoly?.normalizedVertices?.[2]?.y ?? 0) -
          (obj.boundingPoly?.normalizedVertices?.[0]?.y ?? 0),
      },
    })) ?? []
  );
}

/**
 * OCR - Extract text from image
 */
export async function extractTextWithVision(
  imageBase64: string
): Promise<string> {
  const client = getVisionClient();

  const [result] = await client.textDetection({
    image: { content: imageBase64 },
  });

  return result.textAnnotations?.[0]?.description ?? "";
}

/**
 * Document text detection (better for dense text)
 */
export async function extractDocumentText(
  imageBase64: string
): Promise<string> {
  const client = getVisionClient();

  const [result] = await client.documentTextDetection({
    image: { content: imageBase64 },
  });

  return result.fullTextAnnotation?.text ?? "";
}
