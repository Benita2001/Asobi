import { z } from "zod";

const text = (max: number) => z.string().trim().min(1).max(max);
export const sceneSpecificationSchema = z
  .object({
    version: z.literal(1),
    title: text(120),
    illustrationPrompt: text(1200),
    altText: text(240),
    educationalFocus: z.enum([
      "counting",
      "spelling",
      "colors",
      "shapes",
      "matching",
      "vocabulary",
      "story",
    ]),
    objectCount: z.number().int().nonnegative().nullable(),
    expectedVisualAnswer: z.string().trim().max(120).nullable(),
    preservedFeatures: z.array(text(160)).max(8),
    educationalTransformation: text(500),
    reasoningSummary: text(300),
  })
  .strict();
export type SceneSpecification = z.infer<typeof sceneSpecificationSchema>;
