import "server-only";

import { zodTextFormat } from "openai/helpers/zod";

import type { PreparedDrawing } from "@/types/drawing";
import type { AgeGroup } from "@/types/journey";
import { buildVisionAnalysisPrompt } from "@/lib/prompts/vision-analysis";
import {
  drawingAnalysisSchema,
  type DrawingAnalysis,
} from "@/lib/vision/schemas";
import { getOpenAIClient, getOpenAIModel } from "./client";

export async function analyzeDrawing(
  ageGroup: AgeGroup,
  drawing: PreparedDrawing,
): Promise<DrawingAnalysis> {
  const response = await getOpenAIClient().responses.parse({
    model: getOpenAIModel(),
    input: [
      {
        role: "user",
        content: [
          { type: "input_text", text: buildVisionAnalysisPrompt(ageGroup) },
          { type: "input_image", image_url: drawing.dataUrl, detail: "low" },
        ],
      },
    ],
    text: { format: zodTextFormat(drawingAnalysisSchema, "drawing_analysis") },
  });
  if (!response.output_parsed)
    throw new Error("The model returned no structured analysis.");
  return response.output_parsed;
}
