import { ImageAnalyzer } from "@/components/image-analyzer";

export default function OCRPage() {
  return (
    <ImageAnalyzer
      apiEndpoint="/api/ocr"
      title="OCR / Text Extraction"
      description="Upload an image containing text (documents, receipts, signs, etc.) to extract the text content. The AI will identify and return all readable text."
    />
  );
}
