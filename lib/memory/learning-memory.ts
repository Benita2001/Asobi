import type { DrawingAnalysis } from "@/types/vision";
import {
  EMPTY_LEARNING_MEMORY,
  learningMemorySchema,
  MEMORY_STORAGE_KEY,
  type LearningMemory,
} from "./memory-schema";

const meaningfulThemes = [
  /rocket/i,
  /space|planet|star/i,
  /animal|cat|dog|bird/i,
  /car|vehicle/i,
  /dinosaur/i,
  /plant|flower|tree/i,
  /music/i,
  /sport|ball/i,
];
function migrateMemory(value: unknown): unknown {
  if (!value || typeof value !== "object") return value;
  const candidate = value as Record<string, unknown>;
  if (candidate.version !== 0) return value;
  return {
    ...EMPTY_LEARNING_MEMORY,
    ageGroup:
      typeof candidate.ageGroup === "string" ? candidate.ageGroup : null,
    preferredInteraction:
      candidate.preferredInteraction === "voice" ? "voice" : "text",
  };
}
export function readLearningMemory(
  storage: Storage | undefined = typeof window === "undefined"
    ? undefined
    : window.localStorage,
): LearningMemory {
  if (!storage) return EMPTY_LEARNING_MEMORY;
  try {
    const parsed: unknown = JSON.parse(
      storage.getItem(MEMORY_STORAGE_KEY) ?? "null",
    );
    const result = learningMemorySchema.safeParse(migrateMemory(parsed));
    return result.success ? result.data : EMPTY_LEARNING_MEMORY;
  } catch {
    return EMPTY_LEARNING_MEMORY;
  }
}
export function clearLearningMemory(
  storage: Storage | undefined = typeof window === "undefined"
    ? undefined
    : window.localStorage,
): void {
  try {
    storage?.removeItem(MEMORY_STORAGE_KEY);
  } catch {
    /* Storage is optional. */
  }
}
export function writeLearningMemory(
  memory: LearningMemory,
  storage: Storage | undefined = typeof window === "undefined"
    ? undefined
    : window.localStorage,
): void {
  if (!storage) return;
  try {
    storage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(memory));
  } catch {
    /* Storage is optional. */
  }
}
export function updateAgeGroup(
  ageGroup: LearningMemory["ageGroup"],
  memory = readLearningMemory(),
): LearningMemory {
  const next = { ...memory, ageGroup };
  writeLearningMemory(next);
  return next;
}
export function updatePreferredInteraction(
  preferredInteraction: "voice" | "text",
  memory = readLearningMemory(),
): LearningMemory {
  const next = { ...memory, preferredInteraction };
  writeLearningMemory(next);
  return next;
}
export function extractDrawingInterests(analysis: DrawingAnalysis): string[] {
  const values = [
    ...analysis.objects.map((item) => item.name),
    ...analysis.colors,
    ...analysis.shapes,
    ...analysis.educationalHooks.map((item) => item.concept),
  ];
  return [
    ...new Set(
      values.filter((value) =>
        meaningfulThemes.some((theme) => theme.test(value)),
      ),
    ),
  ].slice(0, 20);
}
export function updateDrawingInterests(
  analysis: DrawingAnalysis,
  memory = readLearningMemory(),
): LearningMemory {
  const next = {
    ...memory,
    drawingInterests: [
      ...new Set([
        ...extractDrawingInterests(analysis),
        ...memory.drawingInterests,
      ]),
    ].slice(0, 20),
  };
  writeLearningMemory(next);
  return next;
}
export function recordLesson(
  lesson: { id: string; subject: string; skills: string[] },
  completed: boolean,
  score: number,
  preference: "math" | "english" | "auto",
  memory = readLearningMemory(),
): LearningMemory {
  const now = new Date();
  const previousDate = memory.lastLessonDate
    ? new Date(memory.lastLessonDate)
    : null;
  const isConsecutive =
    previousDate &&
    now.getTime() - previousDate.getTime() <= 48 * 60 * 60 * 1000;
  const history = [
    {
      lessonId: lesson.id,
      subject: lesson.subject,
      completed,
      score,
      completedAt: now.toISOString(),
    },
    ...memory.lessonHistory,
  ].slice(0, 50);
  const conceptStats = lesson.skills
    .map((concept) => {
      const old = memory.conceptStats.find(
        (item) => item.concept.toLowerCase() === concept.toLowerCase(),
      );
      return {
        concept,
        attempts: (old?.attempts ?? 0) + 1,
        correct: (old?.correct ?? 0) + (completed && score >= 1 ? 1 : 0),
      };
    })
    .reduce(
      (all, item) => [
        ...all.filter(
          (old) => old.concept.toLowerCase() !== item.concept.toLowerCase(),
        ),
        item,
      ],
      memory.conceptStats,
    )
    .slice(0, 50);
  const next = {
    ...memory,
    lessonHistory: history,
    conceptStats,
    streak: completed ? (isConsecutive ? memory.streak + 1 : 1) : memory.streak,
    lastLessonDate: completed ? now.toISOString() : memory.lastLessonDate,
    favoriteSubjects: [
      ...new Set([lesson.subject, ...memory.favoriteSubjects]),
    ].slice(0, 10),
    subjectUsage: {
      ...memory.subjectUsage,
      [preference]: memory.subjectUsage[preference] + 1,
    },
  };
  writeLearningMemory(next);
  return next;
}
export function getMemorySummary(memory = readLearningMemory()): string {
  const strong = memory.conceptStats
    .filter((item) => item.correct > 0 && item.correct >= item.attempts / 2)
    .map((item) => item.concept)
    .slice(0, 3);
  const needs = memory.conceptStats
    .filter((item) => item.attempts > item.correct)
    .map((item) => item.concept)
    .slice(0, 3);
  return JSON.stringify({
    previouslyEnjoyed: memory.drawingInterests.slice(0, 3),
    strongConcepts: strong,
    needsReinforcement: needs,
    preferredInteraction: memory.preferredInteraction,
  });
}
