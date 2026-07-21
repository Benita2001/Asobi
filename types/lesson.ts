import type { z } from "zod";
import type { lessonPlanSchema } from "@/lib/lessons/schemas";
export type LessonPlan = z.infer<typeof lessonPlanSchema>;
export type LessonSubjectPreference = "math" | "english" | "auto";
export interface LessonSessionState {
  ageGroup: "4-6" | "7-9" | "10-12";
  drawingObservation: string;
  lesson: LessonPlan;
  createdAt: string;
}
