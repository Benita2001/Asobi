import { estimateDataUrlSizeBytes } from "@/lib/drawing/data-url";
import { MAX_DRAWING_FILE_SIZE_BYTES } from "@/lib/drawing/constants";
import type { AnalyzeDrawingRequest } from "@/types/vision";
import { analyzeDrawingRequestSchema } from "./schemas";

export const MAX_DRAWING_DIMENSION = 4096;

export class VisionValidationError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "VisionValidationError";
  }
}

export function validateAnalyzeRequest(value: unknown): AnalyzeDrawingRequest {
  const parsed = analyzeDrawingRequestSchema.safeParse(value);
  if (!parsed.success) {
    throw new VisionValidationError(
      "INVALID_REQUEST",
      "The drawing request is not valid.",
    );
  }
  const { drawing } = parsed.data;
  const prefix = `data:${drawing.mimeType};base64,`;
  if (!drawing.dataUrl.startsWith(prefix)) {
    throw new VisionValidationError(
      "INVALID_DATA_URL",
      "The drawing image data is invalid.",
    );
  }
  const payload = drawing.dataUrl.slice(prefix.length);
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(payload) || payload.length % 4 === 1) {
    throw new VisionValidationError(
      "INVALID_DATA_URL",
      "The drawing image data is invalid.",
    );
  }
  const decodedSize = estimateDataUrlSizeBytes(drawing.dataUrl);
  if (decodedSize <= 0 || decodedSize > MAX_DRAWING_FILE_SIZE_BYTES) {
    throw new VisionValidationError(
      "IMAGE_TOO_LARGE",
      "That drawing is too large. Please choose an image smaller than 8 MB.",
    );
  }
  if (
    drawing.sizeBytes !== undefined &&
    Math.abs(drawing.sizeBytes - decodedSize) >
      Math.max(1024, drawing.sizeBytes * 0.2)
  ) {
    throw new VisionValidationError(
      "INVALID_IMAGE_SIZE",
      "The drawing image size could not be verified.",
    );
  }
  if (
    drawing.width > MAX_DRAWING_DIMENSION ||
    drawing.height > MAX_DRAWING_DIMENSION
  ) {
    throw new VisionValidationError(
      "IMAGE_DIMENSIONS_TOO_LARGE",
      "That drawing is too large in pixel dimensions.",
    );
  }
  if (!hasImageSignature(drawing.mimeType, payload)) {
    throw new VisionValidationError(
      "INVALID_IMAGE",
      "The drawing image could not be verified.",
    );
  }
  const actualDimensions = readImageDimensions(drawing.mimeType, payload);
  if (
    !actualDimensions ||
    actualDimensions.width !== drawing.width ||
    actualDimensions.height !== drawing.height
  ) {
    throw new VisionValidationError(
      "IMAGE_DIMENSIONS_MISMATCH",
      "The drawing dimensions could not be verified.",
    );
  }
  return parsed.data;
}

function readImageDimensions(
  mimeType: string,
  payload: string,
): { width: number; height: number } | null {
  const bytes = Buffer.from(payload, "base64");
  if (mimeType === "image/png" && bytes.length >= 24) {
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }
  if (
    mimeType === "image/webp" &&
    bytes.length >= 30 &&
    bytes.subarray(12, 16).toString() === "VP8X"
  ) {
    return {
      width: 1 + bytes.readUIntLE(24, 3),
      height: 1 + bytes.readUIntLE(27, 3),
    };
  }
  if (mimeType === "image/jpeg") return readJpegDimensions(bytes);
  return null;
}

function readJpegDimensions(
  bytes: Buffer,
): { width: number; height: number } | null {
  let index = 2;
  while (index + 9 < bytes.length) {
    if (bytes[index] !== 0xff) {
      index += 1;
      continue;
    }
    const marker = bytes[index + 1];
    const length = bytes.readUInt16BE(index + 2);
    if (
      [
        0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce,
        0xcf,
      ].includes(marker)
    ) {
      return {
        height: bytes.readUInt16BE(index + 5),
        width: bytes.readUInt16BE(index + 7),
      };
    }
    if (length < 2) return null;
    index += 2 + length;
  }
  return null;
}

function hasImageSignature(mimeType: string, payload: string): boolean {
  const bytes = Buffer.from(payload.slice(0, 64), "base64");
  if (mimeType === "image/png")
    return (
      bytes.length >= 8 &&
      bytes
        .subarray(0, 8)
        .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    );
  if (mimeType === "image/jpeg")
    return (
      bytes.length >= 3 &&
      bytes[0] === 255 &&
      bytes[1] === 216 &&
      bytes[2] === 255
    );
  return (
    bytes.length >= 12 &&
    bytes.subarray(0, 4).toString() === "RIFF" &&
    bytes.subarray(8, 12).toString() === "WEBP"
  );
}
