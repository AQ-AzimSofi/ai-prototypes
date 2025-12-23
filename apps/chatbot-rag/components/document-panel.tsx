"use client";

import { useState } from "react";
import { FileUpload, Button, Card, CardContent, LoadingSpinner } from "@ai-prototypes/ui";
import { FileText, Trash2, CheckCircle } from "lucide-react";

interface DocumentInfo {
  filename: string;
  pageCount: number;
  chunkCount: number;
}

interface DocumentPanelProps {
  onContextReady: (context: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export function DocumentPanel({
  onContextReady,
  isProcessing,
  setIsProcessing,
}: DocumentPanelProps) {
  const [document, setDocument] = useState<DocumentInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setError(null);
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload");
      }

      setDocument({
        filename: data.filename,
        pageCount: data.pageCount,
        chunkCount: data.chunkCount,
      });

      onContextReady(data.context);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setDocument(null);
      onContextReady("");
    } finally {
      setIsProcessing(false);
    }
  };

  const clearDocument = () => {
    setDocument(null);
    setError(null);
    onContextReady("");
  };

  return (
    <div className="flex flex-col gap-4 flex-1">
      {!document && !isProcessing && (
        <FileUpload
          onFileSelect={handleFileSelect}
          accept={{ "application/pdf": [".pdf"] }}
          maxSize={10 * 1024 * 1024}
        />
      )}

      {isProcessing && (
        <Card>
          <CardContent className="py-6 flex flex-col items-center gap-2">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-muted-foreground">
              Processing document...
            </p>
          </CardContent>
        </Card>
      )}

      {document && !isProcessing && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{document.filename}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>
                    {document.pageCount} pages, {document.chunkCount} chunks
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearDocument}
                className="flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {document && (
        <div className="mt-auto pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Document loaded. Ask questions in the chat!
          </p>
        </div>
      )}
    </div>
  );
}
