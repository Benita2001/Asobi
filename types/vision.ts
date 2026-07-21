import type { z } from "zod";

import type { drawingAnalysisSchema } from "@/lib/vision/schemas";

export type DrawingAnalysis = z.infer<typeof drawingAnalysisSchema>;

export interface AnalyzeDrawingRequest {
  ageGroup: "4-6" | "7-9" | "10-12";
  drawing: {
    source: "canvas" | "upload";
    mimeType: "image/png" | "image/jpeg" | "image/webp";
    dataUrl: string;
    width: number;
    height: number;
    originalFileName?: string;
    sizeBytes?: number;
  };
}

export interface ApiErrorResponse {
  error: { code: string; message: string; retryable: boolean };
}
