"use client";

import { useState } from "react";
import {
  FileUpload,
  Button,
  Card,
  CardContent,
  LoadingSpinner,
  Input,
} from "@ai-prototypes/ui";
import { BookOpen, Trash2, CheckCircle, Upload } from "lucide-react";
import { type VolumeInfo } from "@/lib/types";
import { cn } from "@ai-prototypes/ui/lib";

interface NovelDocumentPanelProps {
  volumes: VolumeInfo[];
  currentVolume: number;
  onVolumeUploaded: (volume: VolumeInfo) => void;
  onVolumeRemoved: (volumeNumber: number) => void;
  onCurrentVolumeChange: (volume: number) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export function NovelDocumentPanel({
  volumes,
  currentVolume,
  onVolumeUploaded,
  onVolumeRemoved,
  onCurrentVolumeChange,
  isProcessing,
  setIsProcessing,
}: NovelDocumentPanelProps) {
  const [volumeNumber, setVolumeNumber] = useState<string>("1");
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const volNum = parseInt(volumeNumber);
    if (isNaN(volNum) || volNum < 1) {
      setError("Please enter a valid volume number (1 or higher)");
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("persona", "novel");
      formData.append("volumeNumber", volNum.toString());

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload");
      }

      onVolumeUploaded({
        id: data.id || `vol-${volNum}`,
        filename: data.filename,
        pageCount: data.pageCount,
        chunkCount: data.chunkCount,
        volumeNumber: volNum,
      });

      setSelectedFile(null);
      setVolumeNumber((volNum + 1).toString());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const maxVolume = volumes.length > 0 ? Math.max(...volumes.map((v) => v.volumeNumber)) : 1;

  return (
    <div className="flex flex-col gap-4 flex-1">
      {/* Volume Upload Section */}
      <div className="space-y-3">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">
              Volume #
            </label>
            <Input
              type="number"
              min="1"
              value={volumeNumber}
              onChange={(e) => setVolumeNumber(e.target.value)}
              className="h-9"
              disabled={isProcessing}
            />
          </div>
          {selectedFile && (
            <Button
              onClick={handleUpload}
              disabled={isProcessing}
              size="sm"
              className="h-9"
            >
              <Upload className="h-4 w-4 mr-1" />
              Upload
            </Button>
          )}
        </div>

        {!selectedFile && !isProcessing && (
          <FileUpload
            onFileSelect={handleFileSelect}
            accept={{ "application/pdf": [".pdf"] }}
            maxSize={10 * 1024 * 1024}
          />
        )}

        {selectedFile && !isProcessing && (
          <Card>
            <CardContent className="py-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm truncate flex-1">
                  {selectedFile.name}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setSelectedFile(null)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {isProcessing && (
          <Card>
            <CardContent className="py-4 flex flex-col items-center gap-2">
              <LoadingSpinner size="lg" />
              <p className="text-sm text-muted-foreground">
                Indexing volume...
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Uploaded Volumes List */}
      {volumes.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Uploaded Volumes</h3>
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {volumes.map((vol) => (
              <div
                key={vol.volumeNumber}
                className="flex items-center gap-2 text-sm p-2 rounded-md bg-muted/50"
              >
                <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                <span className="font-medium">Vol. {vol.volumeNumber}</span>
                <span className="text-muted-foreground truncate flex-1">
                  {vol.filename}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 flex-shrink-0"
                  onClick={() => onVolumeRemoved(vol.volumeNumber)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reading Progress Selector */}
      {volumes.length > 0 && (
        <div className="mt-auto pt-4 border-t space-y-2">
          <label className="text-sm font-medium">I&apos;m currently reading:</label>
          <div className="flex gap-1 flex-wrap">
            {Array.from({ length: maxVolume }, (_, i) => i + 1).map((vol) => (
              <button
                key={vol}
                onClick={() => onCurrentVolumeChange(vol)}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-md border transition-colors",
                  currentVolume === vol
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/50 hover:bg-muted border-transparent"
                )}
              >
                Vol. {vol}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            I&apos;ll only reference volumes 1-{currentVolume - 1} to avoid spoilers.
          </p>
        </div>
      )}
    </div>
  );
}
