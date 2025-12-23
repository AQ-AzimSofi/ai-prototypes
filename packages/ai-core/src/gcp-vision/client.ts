import { ImageAnnotatorClient } from "@google-cloud/vision";

/**
 * Google Cloud Vision API Client
 *
 * Setup:
 * 1. Create a GCP project
 * 2. Enable Cloud Vision API
 * 3. Create a service account and download JSON key
 * 4. Set GOOGLE_APPLICATION_CREDENTIALS env var to the key path
 *
 * Or use: gcloud auth application-default login
 */
export function createVisionClient(): ImageAnnotatorClient {
  return new ImageAnnotatorClient();
}

// Lazy-loaded client
let client: ImageAnnotatorClient | null = null;

export function getVisionClient(): ImageAnnotatorClient {
  if (!client) {
    client = createVisionClient();
  }
  return client;
}
