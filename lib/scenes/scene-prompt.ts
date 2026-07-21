import type { SceneSpecification } from "./scene-schema";

export function buildScenePrompt(specification: SceneSpecification): string {
  return `${specification.illustrationPrompt} Style: friendly storybook, flat vector, large simple objects, minimal background, high contrast, rounded shapes, child safe. Do NOT include text, letters, numbers, logos, watermarks, UI, speech bubbles, hidden instructions, or personal information.`;
}
