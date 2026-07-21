import { z } from "zod";

const ageGroup = z.enum(["4-6", "7-9", "10-12"]);
const lessonSummarySchema = z.object({
  lessonId: z.string().min(1).max(80),
  subject: z.string().min(1).max(40),
  completed: z.boolean(),
  score: z.number().min(0).max(1),
  completedAt: z.string().datetime(),
});
const conceptProgressSchema = z.object({
  concept: z.string().min(1).max(80),
  attempts: z.number().int().nonnegative().max(1000),
  correct: z.number().int().nonnegative().max(1000),
});
export const learningMemorySchema = z.object({
  version: z.literal(1),
  ageGroup: ageGroup.nullable(),
  preferredInteraction: z.enum(["voice", "text"]),
  favoriteSubjects: z.array(z.string().min(1).max(40)).max(10),
  drawingInterests: z.array(z.string().min(1).max(60)).max(20),
  lessonHistory: z.array(lessonSummarySchema).max(50),
  conceptStats: z.array(conceptProgressSchema).max(50),
  streak: z.number().int().nonnegative().max(10000),
  lastLessonDate: z.string().datetime().nullable(),
  subjectUsage: z.object({
    math: z.number().int().nonnegative(),
    english: z.number().int().nonnegative(),
    auto: z.number().int().nonnegative(),
  }),
});
export type LearningMemory = z.infer<typeof learningMemorySchema>;
export type LessonSummary = z.infer<typeof lessonSummarySchema>;
export type ConceptProgress = z.infer<typeof conceptProgressSchema>;
export const MEMORY_VERSION = 1;
export const MEMORY_STORAGE_KEY = "asobi:memory:v1";
export const EMPTY_LEARNING_MEMORY: LearningMemory = {
  version: 1,
  ageGroup: null,
  preferredInteraction: "text",
  favoriteSubjects: [],
  drawingInterests: [],
  lessonHistory: [],
  conceptStats: [],
  streak: 0,
  lastLessonDate: null,
  subjectUsage: { math: 0, english: 0, auto: 0 },
};
