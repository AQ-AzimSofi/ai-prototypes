import { ImageAnalyzer } from "@/components/image-analyzer";

export default function DefectDetectionPage() {
  return (
    <ImageAnalyzer
      apiEndpoint="/api/analyze"
      mode="defect"
      title="Defect Detection"
      description="Upload an image of a product or component to detect manufacturing defects, damage, or quality issues. The AI will analyze the image and provide a quality assessment."
    />
  );
}
