import type { LessonPlan } from "@/lib/lessons/schemas";
import type { SceneSpecification } from "./scene-schema";

export function planScene(lesson: LessonPlan): SceneSpecification {
  const answer = lesson.activity.expectedAnswer.value;
  const focus = lesson.skills.some((skill) => /count/i.test(skill))
    ? "counting"
    : lesson.skills.some((skill) => /shape/i.test(skill))
      ? "shapes"
      : lesson.skills.some((skill) => /color/i.test(skill))
        ? "colors"
        : lesson.subject === "english"
          ? "vocabulary"
          : "story";
  const objectCount = focus === "counting" ? Number(answer) || null : null;
  const noun =
    lesson.subject === "math" ? "friendly rockets" : "a friendly dinosaur";
  return {
    version: 1,
    title: `${lesson.title} illustration`,
    illustrationPrompt:
      focus === "counting" && objectCount
        ? `Generate a cheerful educational illustration. Show exactly ${objectCount} smiling rockets. Large spacing. White background. No additional objects.`
        : `Generate a cheerful educational illustration of ${noun}. Large centered illustration.`,
    altText: `Educational illustration for ${lesson.title}.`,
    educationalFocus: focus,
    objectCount,
    expectedVisualAnswer: answer || null,
  };
}
