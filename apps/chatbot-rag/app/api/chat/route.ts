import { streamText } from "ai";
import { geminiFlash } from "@ai-prototypes/ai-core";
import { searchWithVolumeFilter } from "@/lib/vector-store-manager";
import { getGeneralSystemPrompt, getNovelSystemPrompt } from "@/lib/prompts";
import { type PersonaType } from "@/lib/types";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, context, persona, currentVolume } = await req.json();

  const personaType = (persona as PersonaType) || "general";
  let systemMessage: string;

  if (personaType === "novel" && currentVolume) {
    // Get the user's latest message for semantic search
    const lastUserMessage = messages
      .filter((m: { role: string }) => m.role === "user")
      .pop();
    const query = lastUserMessage?.content || "";

    // Search for relevant context from previous volumes
    const results = await searchWithVolumeFilter(query, currentVolume, 8);
    const retrievedContext = results
      .map((r) => {
        const vol = r.document.metadata?.volumeNumber;
        return `[Volume ${vol}]: ${r.document.content}`;
      })
      .join("\n\n---\n\n");

    systemMessage = getNovelSystemPrompt(currentVolume, retrievedContext);
  } else {
    systemMessage = getGeneralSystemPrompt(context);
  }

  const result = streamText({
    model: geminiFlash,
    system: systemMessage,
    messages,
  });

  return result.toDataStreamResponse();
}
