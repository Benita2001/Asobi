import type { PreparedDrawing } from "../../types/drawing";
import { validateDrawingFile } from "./validation";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("The image could not be read."));
    });
    reader.addEventListener("error", () => {
      reject(new Error("The image could not be read."));
    });
    reader.readAsDataURL(file);
  });
}

function decodeImage(
  objectUrl: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.addEventListener("load", () => {
      if (image.naturalWidth > 0 && image.naturalHeight > 0) {
        resolve({ width: image.naturalWidth, height: image.naturalHeight });
        return;
      }

      reject(new Error("The selected file is not a readable image."));
    });
    image.addEventListener("error", () => {
      reject(new Error("The selected file is not a readable image."));
    });
    image.src = objectUrl;
  });
}

export async function prepareUploadedImage(
  file: File,
): Promise<PreparedDrawing> {
  const validation = validateDrawingFile(file);

  if (!validation.valid) {
    throw new Error(validation.message);
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const [{ width, height }, dataUrl] = await Promise.all([
      decodeImage(objectUrl),
      readFileAsDataUrl(file),
    ]);

    return {
      source: "upload",
      mimeType: validation.mimeType,
      dataUrl,
      width,
      height,
      originalFileName: file.name,
      sizeBytes: file.size,
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
