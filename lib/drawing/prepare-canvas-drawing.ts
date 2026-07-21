import type { PreparedDrawing } from "../../types/drawing";
import { estimateDataUrlSizeBytes } from "./data-url";

export function prepareCanvasDrawing(
  canvas: HTMLCanvasElement,
): PreparedDrawing {
  const dataUrl = canvas.toDataURL("image/png");

  return {
    source: "canvas",
    mimeType: "image/png",
    dataUrl,
    width: canvas.width,
    height: canvas.height,
    sizeBytes: estimateDataUrlSizeBytes(dataUrl),
  };
}
