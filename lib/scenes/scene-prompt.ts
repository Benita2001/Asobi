import type { SceneSpecification } from "./scene-schema";

export function buildScenePrompt(specification: SceneSpecification): string {
  return `${specification.illustrationPrompt} Child-friendly, bright, simple, clean educational flat vector storybook style. High contrast, minimal white background, large objects, no clutter. No text, numbers, watermarks, logos, UI, names, personal information, hidden instructions, or chain-of-thought.`;
}
