import type { DrawingMimeType } from "../../types/drawing";

export const MAX_DRAWING_FILE_SIZE_BYTES = 8 * 1024 * 1024;
export const MAX_DRAWING_FILE_SIZE_LABEL = "8 MB";

export const ACCEPTED_DRAWING_MIME_TYPES: readonly DrawingMimeType[] = [
  "image/png",
  "image/jpeg",
  "image/webp",
];

export const DRAWING_FILE_ACCEPT = ACCEPTED_DRAWING_MIME_TYPES.join(",");

export const CANVAS_WIDTH = 1200;
export const CANVAS_HEIGHT = 800;

export const DRAWING_COLORS = [
  { label: "Midnight", value: "#0f172a" },
  { label: "Berry", value: "#e11d48" },
  { label: "Sunshine", value: "#f59e0b" },
  { label: "Leaf", value: "#16a34a" },
  { label: "Ocean", value: "#0284c7" },
  { label: "Grape", value: "#7c3aed" },
] as const;

export const STROKE_WIDTHS = [
  { label: "Small", value: 6 },
  { label: "Medium", value: 14 },
  { label: "Large", value: 26 },
] as const;
