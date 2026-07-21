import { NextResponse } from "next/server";
import { z } from "zod";
import { getOpenAIClient, getOpenAIImageConfig } from "@/lib/openai/client";
import { sceneSpecificationSchema } from "@/lib/scenes/scene-schema";
import { buildScenePrompt } from "@/lib/scenes/scene-prompt";

export const runtime = "nodejs";
const requestSchema = z.object({ scene: sceneSpecificationSchema }).strict();

function providerFailure(error: unknown) {
  const candidate = error as {
    status?: number;
    code?: string;
    type?: string;
    message?: string;
  };
  const status = candidate.status;
  const category =
    status === 401
      ? "IMAGE_AUTH_FAILED"
      : status === 429
        ? "IMAGE_QUOTA_EXCEEDED"
        : status === 400
          ? "IMAGE_REQUEST_INVALID"
          : "IMAGE_PROVIDER_FAILED";
  const safeMessage =
    typeof candidate.message === "string"
      ? candidate.message.replace(/\s+/g, " ").slice(0, 160)
      : "The image provider returned an unexpected error.";
  console.error("scene_generation_failed", {
    category,
    providerStatus: status,
    providerCode: candidate.code,
    providerType: candidate.type,
    message: safeMessage,
  });
  return { category, safeMessage };
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        {
          error: {
            code: "INVALID_REQUEST",
            message: "The scene request is not valid.",
          },
        },
        { status: 400 },
      );
    if (!process.env.OPENAI_API_KEY)
      return NextResponse.json(
        {
          error: {
            code: "AI_NOT_CONFIGURED",
            message: "The lesson picture is not configured.",
          },
        },
        { status: 503 },
      );
    const { model } = getOpenAIImageConfig();
    const result = await getOpenAIClient().images.generate({
      model,
      prompt: buildScenePrompt(parsed.data.scene),
      size: "1024x1024",
    });
    const encoded = result.data?.[0]?.b64_json;
    if (!encoded) throw new Error("IMAGE_MISSING");
    return new NextResponse(Buffer.from(encoded, "base64"), {
      headers: { "Content-Type": "image/png", "Cache-Control": "no-store" },
    });
  } catch (error) {
    const failure = providerFailure(error);
    return NextResponse.json(
      {
        error: {
          code: failure.category,
          message: "We couldn't create the lesson picture this time.",
        },
      },
      { status: 502 },
    );
  }
}
