"use client";

import { useState } from "react";
import {
  Download,
  RefreshCw,
  FileVideo,
  TrendingDown,
  Clock,
  Award,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatBytes, formatTime } from "@/lib/utils";
import type { CompressionResult } from "@/types";

interface ResultsDashboardProps {
  result: CompressionResult;
  onCompressAnother: () => void;
}

export function ResultsDashboard({
  result,
  onCompressAnother,
}: ResultsDashboardProps) {
  const [splitPosition, setSplitPosition] = useState(50);

  const handleDownload = () => {
    const url = URL.createObjectURL(result.compressedFile);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compressed_${result.originalMetadata.fileName}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Chart data
  const fileSizeData = [
    {
      name: "File Size",
      Original: result.originalMetadata.fileSize / (1024 * 1024),
      Compressed: result.compressedMetadata.fileSize / (1024 * 1024),
    },
  ];

  const radarData = [
    {
      metric: "File Size",
      value: Math.max(
        0,
        100 -
          (result.compressedMetadata.fileSize /
            result.originalMetadata.fileSize) *
            100
      ),
      fullMark: 100,
    },
    {
      metric: "Quality (PSNR)",
      value: (result.quality.psnr / 50) * 100,
      fullMark: 100,
    },
    {
      metric: "Quality (SSIM)",
      value: result.quality.ssim * 100,
      fullMark: 100,
    },
    {
      metric: "Speed",
      value: Math.max(
        0,
        100 - Math.min(result.performance.encodingTime / 10, 1) * 100
      ),
      fullMark: 100,
    },
    {
      metric: "Efficiency",
      value: Math.min((result.compressionRatio / 3) * 100, 100),
      fullMark: 100,
    },
  ];

  // Calculate size difference (can be positive for compression or negative for expansion)
  const sizeDifference =
    result.originalMetadata.fileSize - result.compressedMetadata.fileSize;
  const isCompressed = sizeDifference > 0;
  const sizeSaved = Math.abs(sizeDifference);
  const percentChange = (
    (sizeDifference / result.originalMetadata.fileSize) *
    100
  ).toFixed(1);
  const percentSaved = isCompressed
    ? percentChange
    : `+${Math.abs(Number(percentChange))}`;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Compression Results</h1>
          <p className="text-gray-500 mt-1">
            Analysis complete for {result.originalMetadata.fileName}
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <Button onClick={handleDownload} size="lg">
            <Download className="h-4 w-4 mr-2" />
            Download Compressed
          </Button>
          <Button onClick={onCompressAnother} variant="outline" size="lg">
            <RefreshCw className="h-4 w-4 mr-2" />
            Compress Another
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-lg ${
                  isCompressed ? "bg-green-100" : "bg-orange-100"
                }`}
              >
                <TrendingDown
                  className={`h-6 w-6 ${
                    isCompressed ? "text-green-600" : "text-orange-600"
                  }`}
                />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold">
                  {result.compressionRatio.toFixed(2)}x
                </div>
                <div className="text-sm text-gray-500">
                  {isCompressed ? "Compression Ratio" : "Expansion Ratio"}
                </div>
                <div
                  className={`text-xs font-medium mt-1 ${
                    isCompressed ? "text-green-600" : "text-orange-600"
                  }`}
                >
                  {isCompressed
                    ? `${percentSaved}% smaller`
                    : `${percentSaved}% larger`}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-lg ${
                  isCompressed ? "bg-blue-100" : "bg-orange-100"
                }`}
              >
                <FileVideo
                  className={`h-6 w-6 ${
                    isCompressed ? "text-blue-600" : "text-orange-600"
                  }`}
                />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold">
                  {isCompressed ? "" : "+"}
                  {formatBytes(sizeSaved)}
                </div>
                <div className="text-sm text-gray-500">
                  {isCompressed ? "Size Saved" : "Size Increased"}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {formatBytes(result.compressedMetadata.fileSize)} final size (
                  {percentSaved}%)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold">
                  {formatTime(result.performance.encodingTime)}
                </div>
                <div className="text-sm text-gray-500">Encoding Time</div>
                <div className="text-xs text-gray-400 mt-1">
                  Processing completed
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Video Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Video Comparison</CardTitle>
          <CardDescription>
            Compare the original and compressed videos side by side
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="split" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="split">Split View</TabsTrigger>
              <TabsTrigger value="side">Side by Side</TabsTrigger>
            </TabsList>

            <TabsContent value="split">
              <div
                className="relative w-full bg-black rounded-lg overflow-hidden"
                style={{ height: "500px" }}
              >
                <div className="absolute inset-0 flex">
                  <div
                    className="relative overflow-hidden"
                    style={{ width: `${splitPosition}%` }}
                  >
                    <video
                      src={result.originalVideoUrl}
                      controls
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                    <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                      Original
                    </div>
                  </div>
                  <div className="flex-1 relative overflow-hidden">
                    <video
                      src={result.compressedVideoUrl}
                      controls
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                      Compressed
                    </div>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={splitPosition}
                  onChange={(e) => setSplitPosition(Number(e.target.value))}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 w-64 z-10"
                />
              </div>
            </TabsContent>

            <TabsContent value="side">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Original</h4>
                  <video
                    src={result.originalVideoUrl}
                    controls
                    className="w-full rounded-lg bg-black"
                    style={{ maxHeight: "400px" }}
                  />
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Compressed</h4>
                  <video
                    src={result.compressedVideoUrl}
                    controls
                    className="w-full rounded-lg bg-black"
                    style={{ maxHeight: "400px" }}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Charts and Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Size Comparison Chart */}
        <Card>
          <CardHeader>
            <CardTitle>File Size Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fileSizeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  label={{
                    value: "Size (MB)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="Original" fill="#8b5cf6" />
                <Bar dataKey="Compressed" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Profile Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Performance Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Performance"
                  dataKey="value"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Metrics</CardTitle>
          <CardDescription>
            Comprehensive analysis of compression performance and quality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead>Original</TableHead>
                <TableHead>Compressed</TableHead>
                <TableHead>Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">File Size</TableCell>
                <TableCell>
                  {formatBytes(result.originalMetadata.fileSize)}
                </TableCell>
                <TableCell>
                  {formatBytes(result.compressedMetadata.fileSize)}
                </TableCell>
                <TableCell className="text-green-600">
                  -{percentSaved}%
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Resolution</TableCell>
                <TableCell>
                  {result.originalMetadata.width}x
                  {result.originalMetadata.height}
                </TableCell>
                <TableCell>
                  {result.compressedMetadata.width}x
                  {result.compressedMetadata.height}
                </TableCell>
                <TableCell>—</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Duration</TableCell>
                <TableCell>
                  {result.originalMetadata.duration.toFixed(2)}s
                </TableCell>
                <TableCell>
                  {result.compressedMetadata.duration.toFixed(2)}s
                </TableCell>
                <TableCell>—</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Compression Ratio</TableCell>
                <TableCell colSpan={2}>
                  {result.compressionRatio.toFixed(2)}x
                </TableCell>
                <TableCell>—</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">PSNR (Quality)</TableCell>
                <TableCell colSpan={2}>
                  {result.quality.psnr.toFixed(2)} dB
                </TableCell>
                <TableCell className="text-blue-600">
                  Higher is better
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">SSIM (Quality)</TableCell>
                <TableCell colSpan={2}>
                  {result.quality.ssim.toFixed(4)}
                </TableCell>
                <TableCell className="text-blue-600">
                  Closer to 1 is better
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Encoding Time</TableCell>
                <TableCell colSpan={2}>
                  {formatTime(result.performance.encodingTime)}
                </TableCell>
                <TableCell>—</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">CPU Usage</TableCell>
                <TableCell colSpan={2}>
                  {result.performance.cpuUsage.toFixed(1)}%
                </TableCell>
                <TableCell>—</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Memory Usage</TableCell>
                <TableCell colSpan={2}>
                  {result.performance.memoryUsage.toFixed(1)} MB
                </TableCell>
                <TableCell>—</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
