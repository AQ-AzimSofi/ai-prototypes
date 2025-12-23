import { google } from "@ai-sdk/google";

/**
 * Gemini Flash model (latest version)
 * Free tier, fast responses, good for most use cases
 */
export const geminiFlash = google("gemini-flash-latest");

/**
 * Default model for all prototypes
 */
export const defaultModel = geminiFlash;
