import "server-only";
import { zodTextFormat } from "openai/helpers/zod";
import { getOpenAIClient, getOpenAIModel } from "./client";
import {
  isLessonPlanConsistent,
  lessonPlanSchema,
  type LessonPlan,
} from "@/lib/lessons/schemas";
import { buildLessonPlanningPrompt } from "@/lib/prompts/lesson-planning";
import type { DrawingAnalysis } from "@/types/vision";

export type LessonPlanningFailureCategory =
  | "missing_parsed_output"
  | "provider_refusal"
  | "lesson_consistency_failure"
  | "structured_output_parsing_failure";

export class LessonPlanningFailure extends Error {
  constructor(
    public readonly category: LessonPlanningFailureCategory,
    public readonly metadata: {
      completionStatus?: string;
      refusalPresent?: boolean;
      providerCode?: string;
    },
  ) {
    super(category);
    this.name = "LessonPlanningFailure";
  }
}

export async function planLesson(
  ageGroup: "4-6" | "7-9" | "10-12",
  analysis: DrawingAnalysis,
  subject: "math" | "english",
): Promise<LessonPlan> {
  let response;
  try {
    response = await getOpenAIClient().responses.parse({
      model: getOpenAIModel(),
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: buildLessonPlanningPrompt(ageGroup, subject, analysis),
            },
          ],
        },
      ],
      text: { format: zodTextFormat(lessonPlanSchema, "lesson_plan") },
    });
  } catch (error) {
    const provider = error as { status?: number; code?: string; name?: string };
    throw new LessonPlanningFailure("structured_output_parsing_failure", {
      providerCode:
        provider.code ??
        (provider.status ? `HTTP_${provider.status}` : provider.name),
    });
  }
  const metadata = response as unknown as {
    status?: string;
    refusal?: unknown;
    incomplete_details?: unknown;
  };
  if (!response.output_parsed) {
    const refusalPresent =
      metadata.refusal !== undefined && metadata.refusal !== null;
    throw new LessonPlanningFailure(
      refusalPresent ? "provider_refusal" : "missing_parsed_output",
      {
        completionStatus: metadata.status,
        refusalPresent,
      },
    );
  }
  if (!isLessonPlanConsistent(response.output_parsed)) {
    throw new LessonPlanningFailure("lesson_consistency_failure", {
      completionStatus: metadata.status,
      refusalPresent: false,
    });
  }
  return response.output_parsed;
}
