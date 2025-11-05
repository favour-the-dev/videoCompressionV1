"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, Cpu, MemoryStick } from "lucide-react";
import type { ProcessingStatus } from "@/types";

interface ProcessingScreenProps {
  status: ProcessingStatus;
  cpuUsage?: number;
  memoryUsage?: number;
}

const STAGE_LABELS: Record<string, string> = {
  idle: "Idle",
  analyzing: "Analyzing Video",
  "encoding-lossy": "Encoding with Lossy Compression",
  "encoding-lossless": "Applying Lossless Optimization",
  finalizing: "Finalizing Output",
  complete: "Complete",
  error: "Error",
};

export function ProcessingScreen({
  status,
  cpuUsage = 0,
  memoryUsage = 0,
}: ProcessingScreenProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Loader2
              className={`h-6 w-6 ${
                status.stage !== "complete" && status.stage !== "error"
                  ? "animate-spin"
                  : ""
              }`}
            />
            Processing Video
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Stage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {STAGE_LABELS[status.stage] || status.stage}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(status.progress)}%
              </span>
            </div>
            <Progress value={status.progress} className="h-3" />
          </div>

          {/* Status Message */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700">{status.message}</p>
          </div>

          {/* Estimated Time */}
          {status.estimatedTimeRemaining && (
            <div className="text-sm text-gray-500">
              <span className="font-medium">Estimated time remaining:</span>{" "}
              {Math.ceil(status.estimatedTimeRemaining / 60)} minutes
            </div>
          )}

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Cpu className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {cpuUsage > 0 ? `${Math.round(cpuUsage)}%` : "--"}
                    </div>
                    <div className="text-xs text-gray-500">CPU Usage</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MemoryStick className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {memoryUsage > 0 ? `${Math.round(memoryUsage)} MB` : "--"}
                    </div>
                    <div className="text-xs text-gray-500">Memory Usage</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stage Progress Indicators */}
          <div className="pt-4">
            <div className="space-y-2">
              {[
                "analyzing",
                "encoding-lossy",
                "encoding-lossless",
                "finalizing",
              ].map((stage, index) => {
                const isComplete =
                  [
                    "analyzing",
                    "encoding-lossy",
                    "encoding-lossless",
                    "finalizing",
                  ].indexOf(status.stage) > index;
                const isCurrent = status.stage === stage;

                return (
                  <div key={stage} className="flex items-center gap-3">
                    <div
                      className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                        ${
                          isComplete
                            ? "bg-green-500 text-white"
                            : isCurrent
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-500"
                        }
                      `}
                    >
                      {isComplete ? "✓" : index + 1}
                    </div>
                    <span
                      className={`text-sm ${
                        isCurrent
                          ? "font-medium text-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      {STAGE_LABELS[stage]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
