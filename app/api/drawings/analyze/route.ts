import { NextResponse } from "next/server";

import { analyzeDrawing } from "@/lib/openai/analyze-drawing";
import {
  VisionValidationError,
  validateAnalyzeRequest,
} from "@/lib/vision/validation";
import type { ApiErrorResponse } from "@/types/vision";

export const runtime = "nodejs";

function errorResponse(
  status: number,
  code: string,
  message: string,
  retryable: boolean,
) {
  return NextResponse.json<ApiErrorResponse>(
    { error: { code, message, retryable } },
    { status },
  );
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const started = Date.now();
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse(
        400,
        "INVALID_JSON",
        "Please try submitting the drawing again.",
        false,
      );
    }
    const input = validateAnalyzeRequest(body);
    if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_MODEL) {
      return errorResponse(
        503,
        "AI_NOT_CONFIGURED",
        "Asobi's drawing understanding is not configured yet.",
        false,
      );
    }
    const analysis = await analyzeDrawing(input.ageGroup, input.drawing);
    console.info("drawing_analysis", {
      requestId,
      source: input.drawing.source,
      mimeType: input.drawing.mimeType,
      width: input.drawing.width,
      height: input.drawing.height,
      durationMs: Date.now() - started,
      success: true,
    });
    return NextResponse.json(analysis);
  } catch (error) {
    if (error instanceof VisionValidationError)
      return errorResponse(400, error.code, error.message, false);
    const status = (error as { status?: number }).status;
    if (status === 401)
      return errorResponse(
        502,
        "AI_AUTHENTICATION_FAILED",
        "Asobi could not connect to its drawing service.",
        false,
      );
    if (status === 429)
      return errorResponse(
        429,
        "AI_RATE_LIMITED",
        "Asobi is busy. Please try again in a moment.",
        true,
      );
    if (status === 408 || status === 504)
      return errorResponse(
        504,
        "AI_TIMEOUT",
        "That took too long. Please try again.",
        true,
      );
    console.error("drawing_analysis_failed", {
      requestId,
      code: "AI_UNAVAILABLE",
    });
    return errorResponse(
      502,
      "AI_UNAVAILABLE",
      "Asobi could not understand the drawing right now.",
      true,
    );
  }
}
