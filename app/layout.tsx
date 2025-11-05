import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "HyCompress Web - Hybrid Video Compression Framework",
  description:
    "Modern web application demonstrating hybrid (lossy + lossless) video compression, optimizing the trade-off between file size and visual quality for web-based streaming environments.",
  keywords: [
    "video compression",
    "hybrid compression",
    "FFmpeg",
    "lossy compression",
    "lossless compression",
    "video processing",
    "web application",
  ],
};
// ${geistSans.variable} ${geistMono.variable}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
