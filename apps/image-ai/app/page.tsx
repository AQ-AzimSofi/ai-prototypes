import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@ai-prototypes/ui";
import { Search, FileText, Scan } from "lucide-react";

const demos = [
  {
    title: "Defect Detection",
    description: "Detect manufacturing defects, damage, or quality issues in product images",
    href: "/defect-detection",
    icon: Search,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    title: "OCR / Text Extraction",
    description: "Extract text from images, documents, receipts, and more",
    href: "/ocr",
    icon: FileText,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Object Detection",
    description: "Identify and locate objects in images with descriptions",
    href: "/object-detection",
    icon: Scan,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Image AI Demos</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore various image recognition capabilities powered by Google Gemini Vision.
          Upload an image and see the AI analysis in action.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {demos.map((demo) => (
          <Link key={demo.href} href={demo.href}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${demo.bgColor} flex items-center justify-center mb-4`}>
                  <demo.icon className={`h-6 w-6 ${demo.color}`} />
                </div>
                <CardTitle>{demo.title}</CardTitle>
                <CardDescription>{demo.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-sm text-primary font-medium">
                  Try it out →
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-sm text-muted-foreground">
          All demos use Google Gemini Vision API (Free tier: 1500 requests/day)
        </p>
      </div>
    </div>
  );
}
