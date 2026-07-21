import { describe, expect, it } from "vitest";
import {
  isLessonPlanConsistent,
  lessonPlanSchema,
} from "../lib/lessons/schemas";
import {
  LESSON_EXPIRATION_MS,
  parseLessonSession,
} from "../lib/lessons/session-state";

const lesson = {
  schemaVersion: "1.0" as const,
  id: "test-lesson",
  ageGroup: "7-9" as const,
  subject: "math" as const,
  title: "Count the stars",
  drawingConnection: "Your rocket has stars.",
  learningObjective: "Count objects.",
  introduction: "Let’s count.",
  activity: {
    type: "multiple_choice" as const,
    prompt: "How many?",
    choices: [
      { id: "one", label: "1" },
      { id: "two", label: "2" },
    ],
    expectedAnswer: {
      kind: "choice" as const,
      value: "two",
      acceptedAlternatives: [],
    },
    hint: "Look closely.",
  },
  encouragement: "Great thinking!",
  completionMessage: "You did it!",
  skills: ["counting"],
  difficulty: "developing" as const,
  safetyNotes: [],
};

describe("lesson planning contracts", () => {
  it("accepts a valid bounded lesson and rejects malformed output", () => {
    expect(lessonPlanSchema.safeParse(lesson).success).toBe(true);
    const invalid = {
      ...lesson,
      activity: {
        ...lesson.activity,
        expectedAnswer: {
          kind: "choice" as const,
          value: "missing",
          acceptedAlternatives: [],
        },
      },
    };
    expect(lessonPlanSchema.safeParse(invalid).success).toBe(true);
    expect(isLessonPlanConsistent(invalid)).toBe(false);
  });
  it("validates temporary state and rejects expired or legacy mode state", () => {
    const base = {
      ageGroup: "7-9",
      drawingObservation: "A rocket",
      lesson,
      createdAt: new Date().toISOString(),
    };
    expect(parseLessonSession(JSON.stringify(base))?.lesson.id).toBe(
      "test-lesson",
    );
    expect(
      parseLessonSession(JSON.stringify({ ...base, mode: "fixture" })),
    ).toBeNull();
    expect(
      parseLessonSession(
        JSON.stringify({
          ...base,
          createdAt: new Date(
            Date.now() - LESSON_EXPIRATION_MS - 1,
          ).toISOString(),
        }),
      ),
    ).toBeNull();
  });
});
