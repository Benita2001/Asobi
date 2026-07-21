import { lessonPlanSchema } from "./schemas";
export const LESSON_STORAGE_KEY = "asobi:lesson:v1";
export const LESSON_EXPIRATION_MS = 2 * 60 * 60 * 1000;
import type { LessonSessionState } from "@/types/lesson";
export function parseLessonSession(
  value: string | null,
): LessonSessionState | null {
  try {
    if (!value) return null;
    const raw: unknown = JSON.parse(value);
    if (typeof raw !== "object" || raw === null) return null;
    const item = raw as Record<string, unknown>;
    if (
      typeof item.ageGroup !== "string" ||
      typeof item.drawingObservation !== "string" ||
      typeof item.createdAt !== "string" ||
      "mode" in item ||
      Date.now() - Date.parse(item.createdAt) > LESSON_EXPIRATION_MS
    )
      return null;
    const lesson = lessonPlanSchema.safeParse(item.lesson);
    return lesson.success
      ? {
          ageGroup: item.ageGroup as "4-6" | "7-9" | "10-12",
          drawingObservation: item.drawingObservation,
          lesson: lesson.data,
          createdAt: item.createdAt,
        }
      : null;
  } catch {
    return null;
  }
}
