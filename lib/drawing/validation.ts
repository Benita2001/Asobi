import {
  ACCEPTED_DRAWING_MIME_TYPES,
  MAX_DRAWING_FILE_SIZE_BYTES,
  MAX_DRAWING_FILE_SIZE_LABEL,
} from "./constants";
import {
  type DrawingMimeType,
  type PreparedDrawing,
} from "../../types/drawing";

export type FileValidationResult =
  | { valid: true; mimeType: DrawingMimeType }
  | { valid: false; message: string };

export function isDrawingMimeType(value: unknown): value is DrawingMimeType {
  return (
    typeof value === "string" &&
    ACCEPTED_DRAWING_MIME_TYPES.includes(value as DrawingMimeType)
  );
}

export function validateDrawingFile(
  file: Pick<File, "size" | "type">,
): FileValidationResult {
  if (!isDrawingMimeType(file.type)) {
    return {
      valid: false,
      message: "Please choose a PNG, JPEG, or WebP image.",
    };
  }

  if (file.size > MAX_DRAWING_FILE_SIZE_BYTES) {
    return {
      valid: false,
      message: `That image is too large. Please choose one smaller than ${MAX_DRAWING_FILE_SIZE_LABEL}.`,
    };
  }

  return { valid: true, mimeType: file.type };
}

export function isPreparedDrawing(value: unknown): value is PreparedDrawing {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Partial<PreparedDrawing>;

  return (
    (candidate.source === "canvas" || candidate.source === "upload") &&
    isDrawingMimeType(candidate.mimeType) &&
    typeof candidate.dataUrl === "string" &&
    candidate.dataUrl.startsWith(`data:${candidate.mimeType};base64,`) &&
    typeof candidate.width === "number" &&
    Number.isInteger(candidate.width) &&
    candidate.width > 0 &&
    typeof candidate.height === "number" &&
    Number.isInteger(candidate.height) &&
    candidate.height > 0 &&
    (candidate.originalFileName === undefined ||
      typeof candidate.originalFileName === "string") &&
    (candidate.sizeBytes === undefined ||
      (typeof candidate.sizeBytes === "number" && candidate.sizeBytes >= 0))
  );
}
