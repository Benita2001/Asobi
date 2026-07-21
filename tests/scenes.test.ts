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
    const scene = planScene(lesson, {
      schemaVersion: "1.0",
      summary: "A blue rocket with a round window and orange flames.",
      scene: "space",
      visualIdentity: {
        primarySubject: "rocket",
        secondarySubjects: ["stars"],
        dominantColors: ["blue"],
        accessories: ["round window"],
        distinctiveFeatures: ["orange flames"],
        facialExpression: "smiling",
        pose: "flying",
        artStyle: "child drawing",
        composition: "centered",
        backgroundElements: ["space"],
      },
      objects: [
        {
          name: "rocket",
          count: 1,
          confidence: 0.95,
          attributes: ["round window", "orange flames"],
        },
      ],
      colors: ["blue"],
      shapes: ["circle"],
      visibleText: [],
      educationalHooks: [],
      childFriendlyObservation: "A rocket.",
      uncertaintyNotes: [],
    });
    expect(scene.objectCount).toBe(3);
    expect(sceneSpecificationSchema.parse(scene)).toEqual(scene);
    const prompt = buildScenePrompt(scene);
    expect(prompt).toContain("primary subject: rocket");
    expect(prompt).toContain("exactly 3 copies");
    expect(prompt.indexOf("inspired by the child's drawing")).toBeLessThan(
      prompt.indexOf("Adapt the scene"),
    );
    expect(prompt).toContain("Do NOT include text");
    expect(prompt).toContain("watermarks");
  });
});
