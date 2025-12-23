import { DocumentProcessorServiceClient } from "@google-cloud/documentai";

/**
 * Google Document AI Client
 *
 * Setup:
 * 1. Create a GCP project
 * 2. Enable Document AI API
 * 3. Create a processor in the Document AI console
 * 4. Set GOOGLE_APPLICATION_CREDENTIALS env var
 *
 * Required env vars:
 * - GCP_PROJECT_ID: Your GCP project ID
 * - GCP_LOCATION: Processor location (e.g., 'us' or 'eu')
 * - GCP_PROCESSOR_ID: The processor ID from Document AI console
 */
export function createDocumentAIClient() {
  return new DocumentProcessorServiceClient();
}

// Lazy-loaded client
let client: DocumentProcessorServiceClient | null = null;

export function getDocumentAIClient(): DocumentProcessorServiceClient {
  if (!client) {
    client = createDocumentAIClient();
  }
  return client;
}

export interface ProcessorConfig {
  projectId: string;
  location: string;
  processorId: string;
}

export function getProcessorName(config: ProcessorConfig): string {
  return `projects/${config.projectId}/locations/${config.location}/processors/${config.processorId}`;
}
