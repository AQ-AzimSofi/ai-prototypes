import { TextractClient } from "@aws-sdk/client-textract";

/**
 * AWS Textract Client
 *
 * Setup:
 * 1. Create an AWS account
 * 2. Create IAM user with Textract access
 * 3. Set environment variables:
 *    - AWS_ACCESS_KEY_ID
 *    - AWS_SECRET_ACCESS_KEY
 *    - AWS_REGION (default: us-east-1)
 */
export function createTextractClient(region?: string) {
  return new TextractClient({
    region: region ?? process.env.AWS_REGION ?? "us-east-1",
  });
}

// Lazy-loaded client
let client: TextractClient | null = null;

export function getTextractClient(): TextractClient {
  if (!client) {
    client = createTextractClient();
  }
  return client;
}
