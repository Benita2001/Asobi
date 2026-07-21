"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";

import {
  DRAWING_FILE_ACCEPT,
  MAX_DRAWING_FILE_SIZE_LABEL,
} from "@/lib/drawing/constants";
import { prepareUploadedImage } from "@/lib/drawing/prepare-uploaded-image";
import type { PreparedDrawing } from "@/types/drawing";

type DrawingUploadProps = Readonly<{
  onDrawingReady: (drawing: PreparedDrawing) => void;
  onValidationError: (message: string) => void;
  resetToken: number;
}>;

export function DrawingUpload({
  onDrawingReady,
  onValidationError,
  resetToken,
}: DrawingUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [resetToken]);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsReading(true);
    try {
      const drawing = await prepareUploadedImage(file);
      onDrawingReady(drawing);
    } catch (error) {
      event.target.value = "";
      onValidationError(
        error instanceof Error
          ? error.message
          : "That drawing could not be opened. Please try another image.",
      );
    } finally {
      setIsReading(false);
    }
  }

  return (
    <div>
      <label
        className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50 p-6 text-center transition focus-within:ring-4 focus-within:ring-sky-200 hover:border-sky-500 hover:bg-sky-100"
        htmlFor="drawing-upload"
      >
        <span className="text-2xl" aria-hidden="true">
          🖼️
        </span>
        <span className="mt-2 font-black text-sky-900">
          {isReading ? "Opening your drawing…" : "Choose a drawing"}
        </span>
        <span className="mt-1 text-sm leading-6 text-sky-800">
          PNG, JPEG, or WebP · up to {MAX_DRAWING_FILE_SIZE_LABEL}
        </span>
        <input
          ref={inputRef}
          id="drawing-upload"
          className="sr-only"
          type="file"
          accept={DRAWING_FILE_ACCEPT}
          disabled={isReading}
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}
