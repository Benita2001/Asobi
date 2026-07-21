import { describe, expect, it } from "vitest";

import { MAX_DRAWING_FILE_SIZE_BYTES } from "../lib/drawing/constants";
import {
  isPreparedDrawing,
  validateDrawingFile,
} from "../lib/drawing/validation";

describe("drawing file validation", () => {
  it.each(["image/png", "image/jpeg", "image/webp"])(
    "accepts %s files",
    (type) => {
      expect(validateDrawingFile({ type, size: 1024 })).toEqual({
        valid: true,
        mimeType: type,
      });
    },
  );

  it.each(["image/gif", "image/svg+xml", "text/plain", ""])(
    "rejects unsupported MIME type %s",
    (type) => {
      expect(validateDrawingFile({ type, size: 1024 })).toMatchObject({
        valid: false,
      });
    },
  );

  it("accepts a file at the size limit", () => {
    expect(
      validateDrawingFile({
        type: "image/png",
        size: MAX_DRAWING_FILE_SIZE_BYTES,
      }).valid,
    ).toBe(true);
  });

  it("rejects a file larger than the size limit", () => {
    expect(
      validateDrawingFile({
        type: "image/png",
        size: MAX_DRAWING_FILE_SIZE_BYTES + 1,
      }),
    ).toMatchObject({ valid: false });
  });
});

describe("prepared drawing contract", () => {
  it("accepts a valid canvas drawing", () => {
    expect(
      isPreparedDrawing({
        source: "canvas",
        mimeType: "image/png",
        dataUrl: "data:image/png;base64,AAAA",
        width: 1200,
        height: 800,
        sizeBytes: 3,
      }),
    ).toBe(true);
  });

  it.each([
    { source: "unknown" },
    { mimeType: "image/gif" },
    { dataUrl: "https://example.com/image.png" },
    { width: 0 },
    { height: -1 },
  ])("rejects an invalid prepared drawing: %o", (override) => {
    expect(
      isPreparedDrawing({
        source: "upload",
        mimeType: "image/jpeg",
        dataUrl: "data:image/jpeg;base64,AAAA",
        width: 640,
        height: 480,
        ...override,
      }),
    ).toBe(false);
  });
});
