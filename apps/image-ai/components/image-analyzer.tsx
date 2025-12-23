"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Button, Card, CardContent, MarkdownRenderer, LoadingSpinner } from "@ai-prototypes/ui";
import { Upload, Image as ImageIcon, X } from "lucide-react";

interface ImageAnalyzerProps {
  apiEndpoint: string;
  mode?: string;
  title: string;
  description: string;
}

export function ImageAnalyzer({
  apiEndpoint,
  mode,
  title,
  description,
}: ImageAnalyzerProps) {
  const [image, setImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const base64Data = base64.split(",")[1];
      setImage(base64Data ?? null);
      setPreview(base64);
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const analyze = async () => {
    if (!image) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, mode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clear = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground mb-8">{description}</p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Upload Area */}
          <div>
            <h2 className="text-sm font-medium mb-3">Image Input</h2>
            {!preview ? (
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                  transition-colors min-h-[300px] flex flex-col items-center justify-center
                  ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"}
                `}
              >
                <input {...getInputProps()} />
                <Upload className="h-10 w-10 mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {isDragActive
                    ? "Drop the image here"
                    : "Drag & drop an image, or click to select"}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  PNG, JPG, JPEG, WEBP (max 10MB)
                </p>
              </div>
            ) : (
              <Card>
                <CardContent className="p-4">
                  <div className="relative w-full h-[300px]">
                    <Image
                      src={preview}
                      alt="Preview"
                      fill
                      className="rounded-lg object-contain bg-muted"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={clear}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    className="w-full mt-4"
                    onClick={analyze}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Analyze Image
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results Area */}
          <div>
            <h2 className="text-sm font-medium mb-3">Analysis Result</h2>
            <Card className="min-h-[300px]">
              <CardContent className="p-4">
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center h-full min-h-[250px]">
                    <LoadingSpinner size="lg" />
                    <p className="text-sm text-muted-foreground mt-4">
                      Analyzing image with Gemini Vision...
                    </p>
                  </div>
                ) : result ? (
                  <MarkdownRenderer content={result} />
                ) : error ? (
                  <div className="text-destructive">{error}</div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full min-h-[250px] text-muted-foreground">
                    <ImageIcon className="h-10 w-10 mb-4" />
                    <p className="text-sm">Upload an image to see analysis</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
