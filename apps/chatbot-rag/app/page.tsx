"use client";

import { ChatInterface } from "@/components/chat-interface";
import { DocumentPanel } from "@/components/document-panel";
import { NovelDocumentPanel } from "@/components/novel-document-panel";
import { PersonaSelector } from "@/components/persona-selector";
import { useState } from "react";
import { type PersonaType, type VolumeInfo, PERSONAS } from "@/lib/types";

export default function Home() {
  // Persona state
  const [persona, setPersona] = useState<PersonaType>("general");

  // General mode state
  const [context, setContext] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Novel mode state
  const [volumes, setVolumes] = useState<VolumeInfo[]>([]);
  const [currentVolume, setCurrentVolume] = useState<number>(1);

  const handlePersonaChange = (newPersona: PersonaType) => {
    // Clear state when switching personas
    setPersona(newPersona);
    setContext("");
    setVolumes([]);
    setCurrentVolume(1);
  };

  const handleVolumeUploaded = (volume: VolumeInfo) => {
    setVolumes((prev) => {
      const filtered = prev.filter((v) => v.volumeNumber !== volume.volumeNumber);
      return [...filtered, volume].sort((a, b) => a.volumeNumber - b.volumeNumber);
    });
    // Update current volume to be at least the uploaded volume
    if (volume.volumeNumber >= currentVolume) {
      setCurrentVolume(volume.volumeNumber);
    }
  };

  const handleVolumeRemoved = (volumeNumber: number) => {
    setVolumes((prev) => prev.filter((v) => v.volumeNumber !== volumeNumber));
  };

  return (
    <main className="flex h-screen">
      {/* Document Panel - Left Side */}
      <aside className="w-80 border-r bg-muted/30 flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold mb-2">RAG Chatbot</h1>
          <PersonaSelector
            selected={persona}
            onSelect={handlePersonaChange}
            disabled={isProcessing}
          />
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <p className="text-sm text-muted-foreground mb-4">
            {PERSONAS[persona].description}
          </p>

          {persona === "general" ? (
            <DocumentPanel
              onContextReady={setContext}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
            />
          ) : (
            <NovelDocumentPanel
              volumes={volumes}
              currentVolume={currentVolume}
              onVolumeUploaded={handleVolumeUploaded}
              onVolumeRemoved={handleVolumeRemoved}
              onCurrentVolumeChange={setCurrentVolume}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
            />
          )}
        </div>
      </aside>

      {/* Chat Interface - Right Side */}
      <div className="flex-1 flex flex-col">
        <ChatInterface
          persona={persona}
          context={context}
          currentVolume={currentVolume}
          disabled={isProcessing}
        />
      </div>
    </main>
  );
}
