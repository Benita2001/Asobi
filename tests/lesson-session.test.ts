import { describe, expect, it } from "vitest";
import { parseLessonSession } from "../lib/lessons/session-state";

describe("lesson session compatibility", () => {
  it("keeps older sessions usable without drawing analysis", () => {
    const result = parseLessonSession(
      JSON.stringify({
        ageGroup: "7-9",
        drawingObservation: "A rocket.",
        createdAt: new Date().toISOString(),
        lesson: {
          schemaVersion: "1.0",
          id: "lesson-1",
          ageGroup: "7-9",
          subject: "math",
          title: "Count rockets",
          drawingConnection: "Your rocket",
          learningObjective: "Count objects",
          introduction: "Let us count.",
          activity: {
            type: "short_answer",
            prompt: "How many?",
            choices: [],
            expectedAnswer: {
              kind: "text",
              value: "3",
              acceptedAlternatives: [],
            },
            hint: "Count them.",
          },
          encouragement: "Good work.",
          completionMessage: "Done.",
          skills: ["counting"],
          difficulty: "beginner",
          safetyNotes: [],
        },
      }),
    );
    expect(result?.drawingAnalysis).toBeUndefined();
    expect(result?.lesson.id).toBe("lesson-1");
  });
});
