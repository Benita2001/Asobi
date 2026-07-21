import { z } from "zod";

const boundedText = (max: number) => z.string().trim().min(1).max(max);

export const ageGroupSchema = z.enum(["4-6", "7-9", "10-12"]);
export const drawingMimeTypeSchema = z.enum([
  "image/png",
  "image/jpeg",
  "image/webp",
]);

export const drawingAnalysisSchema = z.object({
  schemaVersion: z.literal("1.0"),
  summary: boundedText(500),
  scene: z.union([boundedText(240), z.null()]),
  objects: z
    .array(
      z.object({
        name: boundedText(80),
        count: z.number().int().min(0).max(100).nullable(),
        confidence: z.number().min(0).max(1),
        attributes: z.array(boundedText(60)).max(8),
      }),
    )
    .max(20),
  colors: z.array(boundedText(40)).max(12),
  shapes: z.array(boundedText(40)).max(12),
  visibleText: z
    .array(
      z.object({
        text: boundedText(160),
        confidence: z.number().min(0).max(1),
      }),
    )
    .max(10),
  educationalHooks: z
    .array(
      z.object({
        subject: z.enum(["math", "english", "general_knowledge"]),
        concept: boundedText(100),
        reason: boundedText(240),
        ageSuitability: z.array(ageGroupSchema).min(1).max(3),
      }),
    )
    .max(3),
  childFriendlyObservation: boundedText(240),
  uncertaintyNotes: z.array(boundedText(180)).max(8),
});

export const analyzeDrawingRequestSchema = z.object({
  ageGroup: ageGroupSchema,
  drawing: z.object({
    source: z.enum(["canvas", "upload"]),
    mimeType: drawingMimeTypeSchema,
    dataUrl: z.string().max(12_000_000),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    originalFileName: z.string().max(255).optional(),
    sizeBytes: z.number().int().nonnegative().optional(),
  }),
});

export type DrawingAnalysis = z.infer<typeof drawingAnalysisSchema>;
