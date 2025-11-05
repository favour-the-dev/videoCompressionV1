"use client";

import { useState, useCallback } from "react";
import { Upload, Video, FileVideo } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { formatBytes, formatDuration } from "@/lib/utils";
import type {
  CompressionConfig,
  HybridMode,
  Resolution,
  VideoMetadata,
} from "@/types";
import { HYBRID_MODE_CONFIG } from "@/types";

interface UploadConfigureProps {
  onStartCompression: (file: File, config: CompressionConfig) => void;
  isProcessing: boolean;
}

export function UploadConfigure({
  onStartCompression,
  isProcessing,
}: UploadConfigureProps) {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [config, setConfig] = useState<CompressionConfig>({
    hybridMode: "balanced",
    lossyQuality: 23,
    targetResolution: "original",
  });

  const handleFileSelect = useCallback(
    async (selectedFile: File) => {
      if (!selectedFile.type.startsWith("video/")) {
        alert("Please select a video file");
        return;
      }

      // Revoke previous URL if exists
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }

      const url = URL.createObjectURL(selectedFile);
      setFile(selectedFile);
      setVideoUrl(url);

      // Get video metadata
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        setMetadata({
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight,
          format: selectedFile.type,
        });
        URL.revokeObjectURL(video.src);
      };
      video.src = url;
    },
    [videoUrl]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        handleFileSelect(droppedFile);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        handleFileSelect(selectedFile);
      }
    },
    [handleFileSelect]
  );

  const handleStartCompression = () => {
    if (file) {
      // Apply hybrid mode CRF if not manually changed
      const finalConfig = {
        ...config,
        lossyQuality:
          config.lossyQuality === 23
            ? HYBRID_MODE_CONFIG[config.hybridMode].crf
            : config.lossyQuality,
      };
      onStartCompression(file, finalConfig);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileVideo className="h-6 w-6" />
            Upload Video
          </CardTitle>
          <CardDescription>
            Select or drag and drop a video file to compress (MP4, AVI, MKV,
            MOV)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              relative border-2 border-dashed rounded-lg p-12 text-center transition-colors
              ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-gray-300 hover:border-primary/50"
              }
              ${file ? "bg-gray-50" : ""}
            `}
          >
            {!file ? (
              <>
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">
                  Drag and drop your video here
                </p>
                <p className="text-sm text-gray-500 mb-4">or</p>
                <div>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileInput}
                    id="file-upload"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                    }
                  >
                    Browse Files
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="shrink-0">
                  <Video className="h-16 w-16 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-lg mb-2">
                    {metadata?.fileName}
                  </h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Size:</span>{" "}
                      {metadata && formatBytes(metadata.fileSize)}
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span>{" "}
                      {metadata && formatDuration(metadata.duration)}
                    </div>
                    <div>
                      <span className="font-medium">Resolution:</span>{" "}
                      {metadata?.width}x{metadata?.height}
                    </div>
                    <div>
                      <span className="font-medium">Format:</span>{" "}
                      {metadata?.format.split("/")[1].toUpperCase()}
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFile(null);
                        setVideoUrl("");
                        setMetadata(null);
                      }}
                    >
                      Remove File
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Video Preview */}
          {videoUrl && (
            <div className="mt-6">
              <h4 className="font-medium mb-2">Preview</h4>
              <video
                src={videoUrl}
                controls
                className="w-full max-w-2xl rounded-lg shadow-sm"
                style={{ maxHeight: "400px" }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuration Section */}
      {file && (
        <Card>
          <CardHeader>
            <CardTitle>Compression Settings</CardTitle>
            <CardDescription>
              Configure the hybrid compression parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Hybrid Mode */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Hybrid Mode</label>
              <Select
                value={config.hybridMode}
                onValueChange={(value: HybridMode) =>
                  setConfig((prev) => ({ ...prev, hybridMode: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(HYBRID_MODE_CONFIG).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      <div>
                        <div className="font-medium">{value.name}</div>
                        <div className="text-xs text-gray-500">
                          {value.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Lossy Quality Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Lossy Quality (CRF)
                </label>
                <span className="text-sm text-gray-500 font-mono">
                  {config.lossyQuality}
                </span>
              </div>
              <Slider
                value={[config.lossyQuality]}
                onValueChange={([value]) =>
                  setConfig((prev) => ({ ...prev, lossyQuality: value }))
                }
                min={18}
                max={28}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>High Quality (Larger File)</span>
                <span>Small File (Lower Quality)</span>
              </div>
            </div>

            {/* Target Resolution */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Resolution</label>
              <Select
                value={config.targetResolution}
                onValueChange={(value: Resolution) =>
                  setConfig((prev) => ({ ...prev, targetResolution: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="original">
                    Original ({metadata?.width}x{metadata?.height})
                  </SelectItem>
                  <SelectItem value="4k">4K Ultra HD (3840x2160)</SelectItem>
                  <SelectItem value="2k">2K (2560x1440)</SelectItem>
                  <SelectItem value="1440p">1440p QHD (2560x1440)</SelectItem>
                  <SelectItem value="1080p">
                    1080p Full HD (1920x1080)
                  </SelectItem>
                  <SelectItem value="900p">900p HD+ (1600x900)</SelectItem>
                  <SelectItem value="720p">720p HD (1280x720)</SelectItem>
                  <SelectItem value="540p">540p qHD (960x540)</SelectItem>
                  <SelectItem value="480p">480p SD (854x480)</SelectItem>
                  <SelectItem value="360p">360p (640x360)</SelectItem>
                  <SelectItem value="240p">240p (426x240)</SelectItem>
                  <SelectItem value="144p">144p (256x144)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Start Button */}
            <div className="pt-4">
              <Button
                onClick={handleStartCompression}
                disabled={!file || isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? "Processing..." : "Start Compression"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
