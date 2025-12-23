import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Image AI - AI Prototypes",
  description: "Image recognition demos using Gemini Vision",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <nav className="border-b">
            <div className="container mx-auto px-4 py-3 flex items-center gap-6">
              <Link href="/" className="font-bold text-lg">
                Image AI
              </Link>
              <div className="flex gap-4 text-sm">
                <Link
                  href="/defect-detection"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Defect Detection
                </Link>
                <Link
                  href="/ocr"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  OCR
                </Link>
                <Link
                  href="/object-detection"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Object Detection
                </Link>
              </div>
            </div>
          </nav>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
