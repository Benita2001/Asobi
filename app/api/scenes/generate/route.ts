import { NextResponse } from "next/server";
import { z } from "zod";
import { getOpenAIClient, getOpenAIImageConfig } from "@/lib/openai/client";
import { sceneSpecificationSchema } from "@/lib/scenes/scene-schema";
import { buildScenePrompt } from "@/lib/scenes/scene-prompt";

export const runtime = "nodejs";
const requestSchema = z.object({ scene: sceneSpecificationSchema }).strict();

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
      response_format: "b64_json",
    });
    const encoded = result.data?.[0]?.b64_json;
    if (!encoded) throw new Error("IMAGE_MISSING");
    return new NextResponse(Buffer.from(encoded, "base64"), {
      headers: { "Content-Type": "image/png", "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "SCENE_UNAVAILABLE",
          message: "We couldn't create the lesson picture this time.",
        },
      },
      { status: 502 },
    );
  }
}
