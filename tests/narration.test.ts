import { describe, expect, it } from "vitest";
import { buildLessonNarration } from "../lib/voice/narration";

const lesson = {
  schemaVersion: "1.0" as const,
  id: "lesson-1",
  ageGroup: "7-9" as const,
  subject: "math" as const,
  title: "Rocket counting",
  drawingConnection: "Your rocket has stars.",
  learningObjective: "Count objects.",
  introduction: "We can count the stars together.",
  activity: {
    type: "multiple_choice" as const,
    prompt: "How many stars do you see?",
    choices: [
      { id: "a", label: "Three stars" },
      { id: "b", label: "Five stars" },
    ],
    expectedAnswer: {
      kind: "choice" as const,
      value: "a",
      acceptedAlternatives: [],
    },
    hint: "Point to each star.",
  },
  encouragement: "Great thinking!",
  completionMessage: "You did it!",
  skills: ["counting"],
  difficulty: "beginner" as const,
  safetyNotes: [],
};

describe("lesson narration", () => {
  it("builds concise narration with choices but not the expected answer", () => {
    const narration = buildLessonNarration(lesson);
    expect(narration).toContain("Rocket counting.");
    expect(narration).toContain(
      "Your choices are: a, Three stars; b, Five stars.",
    );
    expect(narration).not.toContain("expectedAnswer");
  });
});
