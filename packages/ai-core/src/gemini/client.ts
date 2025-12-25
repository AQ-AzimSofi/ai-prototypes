import { google } from "@ai-sdk/google";

/**
 * Gemini 2.5 Flash model
 */
export const geminiFlash = google("gemini-2.5-flash");

/**
 * Default model for all prototypes
 */
export const defaultModel = geminiFlash;
