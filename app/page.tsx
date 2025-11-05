"use client";

import { useState, useEffect } from "react";
import { Video } from "lucide-react";
import { UploadConfigure } from "@/components/UploadConfigure";
import { ProcessingScreen } from "@/components/ProcessingScreen";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { useFFmpeg } from "@/hooks/useFFmpeg";
import type { CompressionConfig, CompressionResult } from "@/types";

type AppState = "upload" | "processing" | "results";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("upload");
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    cpu: 0,
    memory: 0,
  });
  const { loadFFmpeg, compressVideo, isLoaded, status } = useFFmpeg();

  // Simulate CPU and Memory usage during processing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (appState === "processing" && status.progress > 10) {
      interval = setInterval(() => {
        setPerformanceMetrics({
          cpu: 75 + Math.random() * 20,
          memory: 150 + Math.random() * 50,
        });
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [appState, status.progress]);

  useEffect(() => {
    loadFFmpeg();
  }, [loadFFmpeg]);

  const handleStartCompression = async (
    file: File,
    config: CompressionConfig
  ) => {
    setAppState("processing");
    try {
      const compressionResult = await compressVideo(file, config);
      setResult(compressionResult);
      setAppState("results");
    } catch (error) {
      console.error("Compression failed:", error);
      alert("Compression failed. Please try again.");
      setAppState("upload");
    }
  };

  const handleCompressAnother = () => {
    setResult(null);
    setAppState("upload");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
              <Video className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                HyCompress Web
              </h1>
              <p className="text-sm text-gray-500">
                Hybrid Video Compression Framework
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isLoaded && appState === "upload" && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading video processor...</p>
            </div>
          </div>
        )}

        {isLoaded && appState === "upload" && (
          <UploadConfigure
            onStartCompression={handleStartCompression}
            isProcessing={false}
          />
        )}

        {appState === "processing" && (
          <ProcessingScreen
            status={status}
            cpuUsage={performanceMetrics.cpu}
            memoryUsage={performanceMetrics.memory}
          />
        )}

        {appState === "results" && result && (
          <ResultsDashboard
            result={result}
            onCompressAnother={handleCompressAnother}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>
              Hybrid Video Compression Framework | Built with Next.js,
              FFmpeg.wasm, and Tailwind CSS
            </p>
            <p className="mt-1">
              Demonstrating lossy + lossless compression for optimal file size
              and quality
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
