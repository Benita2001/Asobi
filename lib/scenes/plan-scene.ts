import type { LessonPlan } from "@/lib/lessons/schemas";
import type { SceneSpecification } from "./scene-schema";
import type { DrawingAnalysis } from "@/types/vision";

export function planScene(
  lesson: LessonPlan,
  analysis?: DrawingAnalysis,
  _ageGroup?: "4-6" | "7-9" | "10-12",
  _memorySummary?: string,
): SceneSpecification {
  void _ageGroup;
  void _memorySummary;
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
  const identity = analysis?.visualIdentity;
  const identityData = identity ?? {
    primarySubject: "",
    dominantColors: [],
    accessories: [],
    distinctiveFeatures: [],
  };
  const matchedObject = analysis?.objects.find(
    (object) =>
      object.name.toLowerCase() === identityData.primarySubject.toLowerCase(),
  );
  const primary = identityData.primarySubject
    ? {
        name: identityData.primarySubject,
        confidence: matchedObject?.confidence ?? 1,
        attributes: identityData.distinctiveFeatures,
      }
    : analysis?.objects[0];
  const lowConfidence = !primary || primary.confidence < 0.45;
  const subject = lowConfidence ? "a simple educational object" : primary.name;
  const features = lowConfidence
    ? ["a simple, age-appropriate subject"]
    : [
        `primary subject: ${primary.name}`,
        ...identityData.dominantColors
          .slice(0, 2)
          .map((color) => `dominant color: ${color}`),
        ...identityData.accessories
          .slice(0, 2)
          .map((accessory) => `accessory: ${accessory}`),
        ...identityData.distinctiveFeatures
          .slice(0, 3)
          .map((attribute) => `feature: ${attribute}`),
      ];
  const preservation = `Create a cheerful children's educational illustration inspired by the child's drawing. Preserve these recognizable features: ${features.join("; ")}. Keep it obviously recognizable as the same drawing, but cleaner, polished, and storybook quality.`;
  const transformation =
    focus === "counting" && objectCount
      ? `Duplicate the child's ${subject} so there are exactly ${objectCount} copies. Every copy must resemble the original drawing. Large spacing.`
      : `Adapt the child's ${subject} to teach ${lesson.learningObjective}. Never replace the child's idea.`;
  return {
    version: 1,
    title: `${lesson.title} illustration`,
    illustrationPrompt: `${preservation} Adapt the scene to teach this lesson: ${lesson.learningObjective}. Educational constraints: ${transformation}`,
    altText: `Educational illustration for ${lesson.title}.`,
    educationalFocus: focus,
    objectCount,
    expectedVisualAnswer: answer || null,
    preservedFeatures: features,
    educationalTransformation: transformation,
    reasoningSummary: lowConfidence
      ? "Drawing confidence was low, so the illustration uses a simple educational fallback."
      : `The illustration preserves the ${primary.name} and adapts it for ${focus}.`,
  };
}
