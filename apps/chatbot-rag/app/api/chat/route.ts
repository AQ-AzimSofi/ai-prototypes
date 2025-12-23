import { streamText } from "ai";
import { geminiFlash } from "@ai-prototypes/ai-core";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, context } = await req.json();

  const systemMessage = context
    ? `You are a helpful AI assistant. Use the following document context to answer questions accurately. If the answer cannot be found in the context, say so clearly.

DOCUMENT CONTEXT:
${context}

INSTRUCTIONS:
- Answer based on the document context provided
- If information is not in the context, acknowledge this
- Be concise but thorough
- Use markdown formatting for better readability`
    : `You are a helpful AI assistant. Answer questions clearly and concisely. Use markdown formatting when appropriate.`;

  const result = streamText({
    model: geminiFlash,
    system: systemMessage,
    messages,
  });

  return result.toDataStreamResponse();
}
