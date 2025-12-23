import { RekognitionClient } from "@aws-sdk/client-rekognition";

/**
 * AWS Rekognition Client
 *
 * Setup:
 * 1. Create an AWS account
 * 2. Create IAM user with Rekognition access
 * 3. Set environment variables:
 *    - AWS_ACCESS_KEY_ID
 *    - AWS_SECRET_ACCESS_KEY
 *    - AWS_REGION (default: us-east-1)
 */
export function createRekognitionClient(region?: string) {
  return new RekognitionClient({
    region: region ?? process.env.AWS_REGION ?? "us-east-1",
  });
}

// Lazy-loaded client
let client: RekognitionClient | null = null;

export function getRekognitionClient(): RekognitionClient {
  if (!client) {
    client = createRekognitionClient();
  }
  return client;
}
