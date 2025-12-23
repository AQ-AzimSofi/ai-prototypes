import { ImageAnalyzer } from "@/components/image-analyzer";

export default function ObjectDetectionPage() {
  return (
    <ImageAnalyzer
      apiEndpoint="/api/analyze"
      mode="objects"
      title="Object Detection"
      description="Upload any image to identify and locate objects within it. The AI will list all detected objects with their approximate locations and confidence levels."
    />
  );
}
