import { NextResponse } from "next/server";
import { drawingAnalysisSchema } from "@/lib/vision/schemas";
import {
  planLessonRequestSchema,
  lessonPlanSchema,
} from "@/lib/lessons/schemas";
import { LessonPlanningFailure, planLesson } from "@/lib/openai/plan-lesson";
export const runtime = "nodejs";
const err = (
  status: number,
  code: string,
  message: string,
  retryable = false,
) => NextResponse.json({ error: { code, message, retryable } }, { status });
export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const started = Date.now();
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return err(400, "INVALID_JSON", "Please try again.");
    }
    const parsed = planLessonRequestSchema.safeParse(body);
    if (!parsed.success)
      return err(400, "INVALID_REQUEST", "The lesson request is not valid.");
    const analysis = drawingAnalysisSchema.safeParse(
      parsed.data.drawingAnalysis,
    );
    if (!analysis.success)
      return err(
        400,
        "INVALID_DRAWING_ANALYSIS",
        "The drawing observation is not valid.",
      );
    const pref = parsed.data.subjectPreference;
    const chosen =
      pref === "auto"
        ? analysis.data.educationalHooks.some((h) => h.subject === "math")
          ? "math"
          : "english"
        : pref;
    if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_MODEL)
      return err(
        503,
        "AI_NOT_CONFIGURED",
        "Asobi's lesson planner is not configured.",
      );
    const lesson = await planLesson(
      parsed.data.ageGroup,
      analysis.data,
      chosen,
      parsed.data.memorySummary,
    );
    console.info("lesson_planning_succeeded", {
      requestId,
      subject: chosen,
      durationMs: Date.now() - started,
      schemaValidated: true,
      consistencyValidated: true,
    });
    return NextResponse.json({
      lesson: lessonPlanSchema.parse(lesson),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "NO_MATH_CONNECTION")
      return err(
        422,
        "NO_MATH_CONNECTION",
        "This drawing does not provide a clear Mathematics connection.",
      );
    if (error instanceof LessonPlanningFailure) {
      console.error("lesson_planning_failed", {
        requestId,
        category: error.category,
        ...error.metadata,
        durationMs: Date.now() - started,
      });
    } else {
      const provider = error as {
        status?: number;
        code?: string;
        name?: string;
      };
      const category =
        provider.status === 401
          ? "authentication"
          : provider.status === 429
            ? "rate_limit"
            : provider.status === 408 || provider.status === 504
              ? "timeout"
              : "provider_error";
      console.error("lesson_planning_failed", {
        requestId,
        category,
        providerStatus: provider.status,
        providerCode: provider.code,
        errorName: provider.name,
        durationMs: Date.now() - started,
      });
    }
    return err(
      502,
      "LESSON_UNAVAILABLE",
      "Asobi could not prepare an activity right now.",
      true,
    );
  }
}
