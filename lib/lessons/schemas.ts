import { z } from "zod";

const text = (max: number) => z.string().trim().min(1).max(max);
export const subjectPreferenceSchema = z.enum(["math", "english", "auto"]);
export const lessonPlanSchema = z.object({
  schemaVersion: z.literal("1.0"),
  id: text(80),
  ageGroup: z.enum(["4-6", "7-9", "10-12"]),
  subject: z.enum(["math", "english"]),
  title: text(120),
  drawingConnection: text(300),
  learningObjective: text(240),
  introduction: text(400),
  activity: z.object({
    type: z.enum(["multiple_choice", "short_answer", "drawing_action"]),
    prompt: text(400),
    choices: z.array(z.object({ id: text(20), label: text(100) })).max(4),
    expectedAnswer: z.object({
      kind: z.enum(["choice", "text"]),
      value: text(100),
      acceptedAlternatives: z.array(text(100)).max(5),
    }),
    hint: text(240),
  }),
  encouragement: text(180),
  completionMessage: text(240),
  skills: z.array(text(60)).min(1).max(5),
  difficulty: z.enum(["beginner", "developing", "confident"]),
  safetyNotes: z.array(text(160)).max(5),
});
export const planLessonRequestSchema = z.object({
  ageGroup: z.enum(["4-6", "7-9", "10-12"]),
  drawingAnalysis: z.unknown(),
  subjectPreference: subjectPreferenceSchema.optional().default("auto"),
});
export const planLessonResponseSchema = z.object({ lesson: lessonPlanSchema });
export type LessonPlan = z.infer<typeof lessonPlanSchema>;

export function isLessonPlanConsistent(lesson: LessonPlan): boolean {
  const { activity } = lesson;
  if (activity.type === "multiple_choice") {
    return Boolean(
      activity.choices &&
      activity.choices.length >= 2 &&
      activity.expectedAnswer.kind === "choice" &&
      activity.choices.some(
        (choice) => choice.id === activity.expectedAnswer.value,
      ),
    );
  }
  return (
    activity.choices.length === 0 &&
    (activity.type !== "drawing_action" ||
      activity.expectedAnswer.kind === "text")
  );
}
