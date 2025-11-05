export type HybridMode = "quality" | "balanced" | "size";

export type Resolution =
  | "original"
  | "4k"
  | "2k"
  | "1440p"
  | "1080p"
  | "900p"
  | "720p"
  | "540p"
  | "480p"
  | "360p"
  | "240p"
  | "144p";

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
  "4k": { name: "4K Ultra HD (3840x2160)", width: 3840, height: 2160 },
  "2k": { name: "2K (2560x1440)", width: 2560, height: 1440 },
  "1440p": { name: "1440p QHD (2560x1440)", width: 2560, height: 1440 },
  "1080p": { name: "1080p Full HD (1920x1080)", width: 1920, height: 1080 },
  "900p": { name: "900p HD+ (1600x900)", width: 1600, height: 900 },
  "720p": { name: "720p HD (1280x720)", width: 1280, height: 720 },
  "540p": { name: "540p qHD (960x540)", width: 960, height: 540 },
  "480p": { name: "480p SD (854x480)", width: 854, height: 480 },
  "360p": { name: "360p (640x360)", width: 640, height: 360 },
  "240p": { name: "240p (426x240)", width: 426, height: 240 },
  "144p": { name: "144p (256x144)", width: 256, height: 144 },
};
