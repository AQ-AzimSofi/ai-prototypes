"use client";

import { ChatInterface } from "@/components/chat-interface";
import { DocumentPanel } from "@/components/document-panel";
import { useState } from "react";

export default function Home() {
  const [context, setContext] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <main className="flex h-screen">
      {/* Document Panel - Left Side */}
      <aside className="w-80 border-r bg-muted/30 p-4 flex flex-col">
        <h1 className="text-xl font-bold mb-4">RAG Chatbot</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Upload a PDF document and chat with its contents using AI.
        </p>
        <DocumentPanel
          onContextReady={setContext}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />
      </aside>

      {/* Chat Interface - Right Side */}
      <div className="flex-1 flex flex-col">
        <ChatInterface context={context} disabled={isProcessing} />
      </div>
    </main>
  );
}
