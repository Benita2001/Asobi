import type { DrawingTool } from "@/types/drawing";

import { DRAWING_COLORS, STROKE_WIDTHS } from "@/lib/drawing/constants";

type DrawingToolbarProps = Readonly<{
  canUndo: boolean;
  color: string;
  onClear: () => void;
  onColorChange: (color: string) => void;
  onStrokeWidthChange: (width: number) => void;
  onToolChange: (tool: DrawingTool) => void;
  onUndo: () => void;
  strokeWidth: number;
  tool: DrawingTool;
}>;

const controlClassName =
  "inline-flex min-h-11 items-center justify-center rounded-full border-2 px-4 py-2 text-sm font-bold transition focus-visible:ring-4 focus-visible:ring-teal-300 focus-visible:outline-none";

export function DrawingToolbar({
  canUndo,
  color,
  onClear,
  onColorChange,
  onStrokeWidthChange,
  onToolChange,
  onUndo,
  strokeWidth,
  tool,
}: DrawingToolbarProps) {
  return (
    <div className="space-y-4" aria-label="Drawing tools">
      <div className="flex flex-wrap gap-2">
        <button
          className={`${controlClassName} ${tool === "pencil" ? "border-teal-700 bg-teal-700 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-teal-300"}`}
          type="button"
          aria-pressed={tool === "pencil"}
          onClick={() => onToolChange("pencil")}
        >
          Pencil
        </button>
        <button
          className={`${controlClassName} ${tool === "eraser" ? "border-teal-700 bg-teal-700 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-teal-300"}`}
          type="button"
          aria-pressed={tool === "eraser"}
          onClick={() => onToolChange("eraser")}
        >
          Eraser
        </button>
        <button
          className={`${controlClassName} border-slate-200 bg-white text-slate-700 hover:border-teal-300 disabled:cursor-not-allowed disabled:opacity-45`}
          type="button"
          disabled={!canUndo}
          onClick={onUndo}
        >
          Undo
        </button>
        <button
          className={`${controlClassName} border-slate-200 bg-white text-slate-700 hover:border-rose-300 hover:bg-rose-50`}
          type="button"
          onClick={onClear}
        >
          Clear canvas
        </button>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-bold text-slate-700">
          Pencil color
        </legend>
        <div className="flex flex-wrap gap-2">
          {DRAWING_COLORS.map((drawingColor) => (
            <button
              key={drawingColor.value}
              className="h-11 w-11 rounded-full border-4 border-white shadow-sm ring-2 transition hover:scale-105 focus-visible:ring-4 focus-visible:ring-teal-300 focus-visible:outline-none"
              style={{
                backgroundColor: drawingColor.value,
                boxShadow:
                  color === drawingColor.value
                    ? "0 0 0 3px #0f766e"
                    : "0 0 0 2px #cbd5e1",
              }}
              type="button"
              aria-label={drawingColor.label}
              aria-pressed={color === drawingColor.value}
              onClick={() => onColorChange(drawingColor.value)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-bold text-slate-700">
          Pencil size
        </legend>
        <div className="flex flex-wrap gap-2">
          {STROKE_WIDTHS.map((width) => (
            <button
              key={width.value}
              className={`${controlClassName} ${strokeWidth === width.value ? "border-amber-500 bg-amber-100 text-amber-950" : "border-slate-200 bg-white text-slate-700 hover:border-amber-300"}`}
              type="button"
              aria-pressed={strokeWidth === width.value}
              onClick={() => onStrokeWidthChange(width.value)}
            >
              {width.label}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
