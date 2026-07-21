import type { z } from "zod";
import type { lessonPlanSchema } from "@/lib/lessons/schemas";
import type { DrawingAnalysis } from "@/types/vision";
export type LessonPlan = z.infer<typeof lessonPlanSchema>;
export type LessonSubjectPreference = "math" | "english" | "auto";
export interface LessonSessionState {
  ageGroup: "4-6" | "7-9" | "10-12";
  drawingObservation: string;
  lesson: LessonPlan;
  drawingAnalysis?: DrawingAnalysis;
  createdAt: string;
}
