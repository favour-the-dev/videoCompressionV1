export type HybridMode = "quality" | "balanced" | "size";

export type Resolution = "original" | "1080p" | "720p" | "480p";

export interface CompressionConfig {
  hybridMode: HybridMode;
  lossyQuality: number; // CRF value (18-28)
  targetResolution: Resolution;
}

export interface VideoMetadata {
  fileName: string;
  fileSize: number;
  duration: number;
  width: number;
  height: number;
  format: string;
}

export interface PerformanceMetrics {
  encodingTime: number;
  decodingTime: number;
  cpuUsage: number;
  memoryUsage: number;
}

export interface QualityMetrics {
  psnr: number;
  ssim: number;
}

export interface CompressionResult {
  originalFile: File;
  compressedFile: Blob;
  originalMetadata: VideoMetadata;
  compressedMetadata: VideoMetadata;
  compressionRatio: number;
  performance: PerformanceMetrics;
  quality: QualityMetrics;
  originalVideoUrl: string;
  compressedVideoUrl: string;
}

export interface ProcessingStatus {
  stage:
    | "idle"
    | "analyzing"
    | "encoding-lossy"
    | "encoding-lossless"
    | "finalizing"
    | "complete"
    | "error";
  progress: number;
  message: string;
  estimatedTimeRemaining?: number;
}

export const HYBRID_MODE_CONFIG: Record<
  HybridMode,
  { name: string; description: string; crf: number }
> = {
  quality: {
    name: "Priority: Quality (Lossless on ROI)",
    description: "Highest quality, larger file size",
    crf: 18,
  },
  balanced: {
    name: "Balanced",
    description: "Good balance between quality and size",
    crf: 23,
  },
  size: {
    name: "Priority: Size (Aggressive Lossy)",
    description: "Smallest file size, lower quality",
    crf: 28,
  },
};

export const RESOLUTION_CONFIG: Record<
  Resolution,
  { name: string; width: number; height: number } | null
> = {
  original: null,
  "1080p": { name: "1080p (1920x1080)", width: 1920, height: 1080 },
  "720p": { name: "720p (1280x720)", width: 1280, height: 720 },
  "480p": { name: "480p (854x480)", width: 854, height: 480 },
};
