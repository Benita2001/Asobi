"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { DrawingToolbar } from "@/components/drawing/drawing-toolbar";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  DRAWING_COLORS,
  STROKE_WIDTHS,
} from "@/lib/drawing/constants";
import { prepareCanvasDrawing } from "@/lib/drawing/prepare-canvas-drawing";
import type {
  DrawingPoint,
  DrawingStroke,
  DrawingTool,
  PreparedDrawing,
} from "@/types/drawing";

type DrawingCanvasProps = Readonly<{
  onActivate: () => void;
  onDrawingChange: (drawing: PreparedDrawing | null) => void;
  resetToken: number;
}>;

function initializePaper(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  context.save();
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.restore();
}

function drawStroke(context: CanvasRenderingContext2D, stroke: DrawingStroke) {
  if (stroke.points.length === 0) {
    return;
  }

  context.save();
  context.strokeStyle = stroke.tool === "eraser" ? "#ffffff" : stroke.color;
  context.fillStyle = stroke.tool === "eraser" ? "#ffffff" : stroke.color;
  context.lineWidth = stroke.width;
  context.lineCap = "round";
  context.lineJoin = "round";

  const firstPoint = stroke.points[0];
  context.beginPath();
  context.arc(firstPoint.x, firstPoint.y, stroke.width / 2, 0, Math.PI * 2);
  context.fill();

  if (stroke.points.length > 1) {
    context.beginPath();
    context.moveTo(firstPoint.x, firstPoint.y);
    for (const point of stroke.points.slice(1)) {
      context.lineTo(point.x, point.y);
    }
    context.stroke();
  }

  context.restore();
}

function canvasPoint(
  canvas: HTMLCanvasElement,
  event: ReactPointerEvent<HTMLCanvasElement>,
): DrawingPoint {
  const bounds = canvas.getBoundingClientRect();

  return {
    x: ((event.clientX - bounds.left) / bounds.width) * canvas.width,
    y: ((event.clientY - bounds.top) / bounds.height) * canvas.height,
  };
}

export function DrawingCanvas({
  onActivate,
  onDrawingChange,
  resetToken,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<DrawingStroke[]>([]);
  const activeStrokeRef = useRef<DrawingStroke | null>(null);
  const onDrawingChangeRef = useRef(onDrawingChange);
  const [tool, setTool] = useState<DrawingTool>("pencil");
  const [color, setColor] = useState<string>(DRAWING_COLORS[0].value);
  const [strokeWidth, setStrokeWidth] = useState<number>(
    STROKE_WIDTHS[1].value,
  );
  const [strokeCount, setStrokeCount] = useState(0);

  useEffect(() => {
    onDrawingChangeRef.current = onDrawingChange;
  }, [onDrawingChange]);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    initializePaper(canvas);
    for (const stroke of strokesRef.current) {
      drawStroke(context, stroke);
    }
  }, []);

  const resetCanvas = useCallback(() => {
    strokesRef.current = [];
    activeStrokeRef.current = null;
    setStrokeCount(0);
    if (canvasRef.current) {
      initializePaper(canvasRef.current);
    }
  }, []);

  function clearCanvas() {
    resetCanvas();
    onDrawingChangeRef.current(null);
  }

  useEffect(() => {
    resetCanvas();
  }, [resetCanvas, resetToken]);

  function handlePointerDown(event: ReactPointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    event.preventDefault();
    canvas.setPointerCapture(event.pointerId);
    onActivate();

    const stroke: DrawingStroke = {
      tool,
      color,
      width: strokeWidth,
      points: [canvasPoint(canvas, event)],
    };
    activeStrokeRef.current = stroke;

    const context = canvas.getContext("2d");
    if (context) {
      drawStroke(context, stroke);
    }
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const stroke = activeStrokeRef.current;

    if (!canvas || !stroke || !canvas.hasPointerCapture(event.pointerId)) {
      return;
    }

    event.preventDefault();
    const nextPoint = canvasPoint(canvas, event);
    const previousPoint = stroke.points.at(-1);
    stroke.points.push(nextPoint);

    const context = canvas.getContext("2d");
    if (context && previousPoint) {
      drawStroke(context, { ...stroke, points: [previousPoint, nextPoint] });
    }
  }

  function finishStroke(event: ReactPointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const stroke = activeStrokeRef.current;

    if (!canvas || !stroke) {
      return;
    }

    event.preventDefault();
    if (canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }

    strokesRef.current = [...strokesRef.current, stroke];
    activeStrokeRef.current = null;
    setStrokeCount(strokesRef.current.length);
    onDrawingChange(prepareCanvasDrawing(canvas));
  }

  function undoStroke() {
    strokesRef.current = strokesRef.current.slice(0, -1);
    setStrokeCount(strokesRef.current.length);
    redraw();

    const canvas = canvasRef.current;
    onDrawingChange(
      canvas && strokesRef.current.length > 0
        ? prepareCanvasDrawing(canvas)
        : null,
    );
  }

  return (
    <div className="space-y-5">
      <DrawingToolbar
        canUndo={strokeCount > 0}
        color={color}
        strokeWidth={strokeWidth}
        tool={tool}
        onClear={clearCanvas}
        onColorChange={(nextColor) => {
          setColor(nextColor);
          setTool("pencil");
        }}
        onStrokeWidthChange={setStrokeWidth}
        onToolChange={setTool}
        onUndo={undoStroke}
      />

      <p id="canvas-instructions" className="text-sm leading-6 text-slate-600">
        Draw with a mouse, pen, or finger. Your picture stays in this browser
        and is not uploaded.
      </p>
      <div className="overflow-hidden rounded-2xl border-4 border-amber-200 bg-white shadow-inner">
        <canvas
          ref={canvasRef}
          className="block aspect-3/2 w-full cursor-crosshair touch-none bg-white"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          role="img"
          aria-label="Drawing canvas"
          aria-describedby="canvas-instructions"
          onPointerCancel={finishStroke}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishStroke}
        />
      </div>
    </div>
  );
}
