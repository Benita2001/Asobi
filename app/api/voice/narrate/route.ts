import { NextResponse } from "next/server";
import { getOpenAIClient, getOpenAITTSConfig } from "@/lib/openai/client";
import { z } from "zod";

export const runtime = "nodejs";
const requestSchema = z
  .object({ text: z.string().trim().min(1).max(1200) })
  .strict();

function errorResponse(
  status: number,
  code: string,
  message: string,
  retryable = false,
) {
  return NextResponse.json({ error: { code, message, retryable } }, { status });
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const started = Date.now();
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse(400, "INVALID_JSON", "Please try narration again.");
    }
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success)
      return errorResponse(
        400,
        "INVALID_REQUEST",
        "The narration request is not valid.",
      );
    if (!process.env.OPENAI_API_KEY)
      return errorResponse(
        503,
        "AI_NOT_CONFIGURED",
        "Voice narration is not configured.",
      );
    const { model, voice } = getOpenAITTSConfig();
    const audio = await getOpenAIClient().audio.speech.create({
      model,
      voice,
      input: parsed.data.text,
      response_format: "mp3",
      instructions:
        "Speak like a warm, encouraging educational guide for a young child. Sound natural, cheerful, patient, and expressive without becoming exaggerated. Use clear pronunciation, gentle pauses, and a comfortable pace.",
    });
    console.info("voice_narration_succeeded", {
      requestId,
      textCharacters: parsed.data.text.length,
      durationMs: Date.now() - started,
      success: true,
    });
    return new NextResponse(await audio.arrayBuffer(), {
      headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" },
    });
  } catch (error) {
    const provider = error as { status?: number; code?: string; name?: string };
    const category =
      error instanceof Error && error.message === "OPENAI_TTS_NOT_CONFIGURED"
        ? "configuration"
        : provider.status === 401
          ? "authentication"
          : provider.status === 429
            ? "rate_limit"
            : provider.status === 408 || provider.status === 504
              ? "timeout"
              : "provider_error";
    console.error("voice_narration_failed", {
      requestId,
      category,
      providerStatus: provider.status,
      providerCode: provider.code,
      durationMs: Date.now() - started,
    });
    return errorResponse(
      category === "configuration"
        ? 503
        : category === "rate_limit"
          ? 429
          : category === "timeout"
            ? 504
            : 502,
      category === "configuration"
        ? "AI_NOT_CONFIGURED"
        : category === "rate_limit"
          ? "AI_RATE_LIMITED"
          : category === "timeout"
            ? "AI_TIMEOUT"
            : "AI_UNAVAILABLE",
      "Asobi could not play narration right now.",
      true,
    );
  }
}
