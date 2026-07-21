export const DRAWING_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;

export type DrawingMimeType = (typeof DRAWING_MIME_TYPES)[number];
export type DrawingSource = "canvas" | "upload";

export interface PreparedDrawing {
  source: DrawingSource;
  mimeType: DrawingMimeType;
  dataUrl: string;
  width: number;
  height: number;
  originalFileName?: string;
  sizeBytes?: number;
}

export type DrawingTool = "pencil" | "eraser";

export interface DrawingPoint {
  x: number;
  y: number;
}

export interface DrawingStroke {
  tool: DrawingTool;
  color: string;
  width: number;
  points: DrawingPoint[];
}
