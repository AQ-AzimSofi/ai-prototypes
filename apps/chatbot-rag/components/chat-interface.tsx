"use client";

import { useChat } from "ai/react";
import { Button, Textarea, MarkdownRenderer, LoadingSpinner } from "@ai-prototypes/ui";
import { Send, Bot, User, BookOpen, FileText } from "lucide-react";
import { useRef, useEffect } from "react";
import { type PersonaType } from "@/lib/types";

interface ChatInterfaceProps {
  persona: PersonaType;
  context?: string;
  currentVolume?: number;
  disabled?: boolean;
}

export function ChatInterface({
  persona,
  context,
  currentVolume,
  disabled,
}: ChatInterfaceProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      body: { context, persona, currentVolume },
    });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading && !disabled) {
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            {persona === "novel" ? (
              <>
                <BookOpen className="h-12 w-12 mb-4" />
                <h2 className="text-lg font-medium mb-2">Novel Assistant</h2>
                <p className="text-sm max-w-md">
                  {currentVolume && currentVolume > 1
                    ? `You're reading Volume ${currentVolume}. Ask about characters, plot points, or anything from previous volumes!`
                    : "Upload your novel volumes to get started. I'll help you remember characters and plot details without spoilers."}
                </p>
              </>
            ) : (
              <>
                <FileText className="h-12 w-12 mb-4" />
                <h2 className="text-lg font-medium mb-2">Start a conversation</h2>
                <p className="text-sm max-w-md">
                  {context
                    ? "Your document is loaded. Ask any question about its contents!"
                    : "Upload a PDF document or just start chatting with the AI."}
                </p>
              </>
            )}
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {message.role === "user" ? (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                ) : (
                  <MarkdownRenderer content={message.content} />
                )}
              </div>
              {message.role === "user" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="bg-muted rounded-lg px-4 py-2">
              <LoadingSpinner size="sm" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={onSubmit}
        className="border-t p-4 flex gap-2 items-end"
      >
        <Textarea
          value={input}
          onChange={handleInputChange}
          placeholder={
            disabled
              ? "Processing document..."
              : "Type your message..."
          }
          disabled={isLoading || disabled}
          className="min-h-[44px] max-h-32 resize-none"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit(e);
            }
          }}
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || disabled || !input.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
