import Image from "next/image";

import { Button } from "@/components/button";
import type { PreparedDrawing } from "@/types/drawing";

type DrawingPreviewProps = Readonly<{
  drawing: PreparedDrawing | null;
  onClear: () => void;
}>;

export function DrawingPreview({ drawing, onClear }: DrawingPreviewProps) {
  if (!drawing) {
    return (
      <div className="flex min-h-52 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center">
        <div>
          <span className="text-3xl" aria-hidden="true">
            ✨
          </span>
          <p className="mt-3 font-bold text-slate-700">
            No drawing selected yet
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Draw on the canvas or choose an image to see it here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative flex min-h-52 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <Image
          className="max-h-72 w-auto rounded-xl object-contain"
          src={drawing.dataUrl}
          alt="Preview of the current drawing"
          width={drawing.width}
          height={drawing.height}
          unoptimized
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="rounded-full bg-teal-100 px-3 py-1 text-sm font-bold text-teal-800">
          Active source: {drawing.source === "canvas" ? "Canvas" : "Upload"}
        </p>
        <Button variant="secondary" onClick={onClear}>
          Clear current drawing
        </Button>
      </div>
    </div>
  );
}
