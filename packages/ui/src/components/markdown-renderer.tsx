"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "../lib/utils";

export interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div
      className={cn(
        "prose prose-sm dark:prose-invert max-w-none",
        "prose-headings:font-semibold prose-headings:tracking-tight",
        "prose-p:leading-relaxed prose-p:mb-4",
        "prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm",
        "prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg",
        "prose-ul:my-2 prose-ol:my-2",
        "prose-li:my-0",
        className
      )}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}

/**
 * Streaming markdown that updates as content arrives
 */
export function StreamingMarkdown({
  content,
  className,
}: MarkdownRendererProps) {
  return (
    <div className={cn("relative", className)}>
      <MarkdownRenderer content={content} />
      {/* Blinking cursor for streaming effect */}
      <span className="inline-block h-4 w-1 animate-pulse bg-primary" />
    </div>
  );
}
