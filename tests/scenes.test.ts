import { describe, expect, it } from "vitest";
import { buildScenePrompt } from "../lib/scenes/scene-prompt";
import { planScene } from "../lib/scenes/plan-scene";
import { sceneSpecificationSchema } from "../lib/scenes/scene-schema";

const lesson = {
  schemaVersion: "1.0" as const,
  id: "lesson-1",
  ageGroup: "7-9" as const,
  subject: "math" as const,
  title: "Rocket counting",
  drawingConnection: "A rocket and stars.",
  learningObjective: "Count objects.",
  introduction: "Let us count.",
  activity: {
    type: "short_answer" as const,
    prompt: "How many rockets?",
    choices: [],
    expectedAnswer: {
      kind: "text" as const,
      value: "3",
      acceptedAlternatives: [],
    },
    hint: "Count carefully.",
  },
  encouragement: "Great!",
  completionMessage: "Done!",
  skills: ["counting"],
  difficulty: "beginner" as const,
  safetyNotes: [],
};

describe("scene planning", () => {
  it("creates a valid exact-count specification with safe prompt rules", () => {
    const scene = planScene(lesson);
    expect(scene.objectCount).toBe(3);
    expect(sceneSpecificationSchema.parse(scene)).toEqual(scene);
    const prompt = buildScenePrompt(scene);
    expect(prompt).toContain("exactly 3 smiling rockets");
    expect(prompt).toContain("No text");
    expect(prompt).toContain("watermarks");
  });
});
