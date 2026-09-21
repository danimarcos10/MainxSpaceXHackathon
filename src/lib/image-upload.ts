export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_IMAGE_FILE_SIZE = 20 * 1024 * 1024;

const MAX_WIDTH = 1200;
const MAX_HEIGHT = 900;
const MAX_COMPRESSED_SIZE = 1_250_000;

export function validateImageFile(file: File) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
    throw new Error("Choose a JPEG, PNG or WebP image.");
  }

  if (file.size > MAX_IMAGE_FILE_SIZE) {
    throw new Error("The photo must be 20 MB or smaller.");
  }
}

export async function compressImage(file: File): Promise<string> {
  validateImageFile(file);

  const bitmap = await loadImage(file);

  try {
    const scale = Math.min(1, MAX_WIDTH / bitmap.width, MAX_HEIGHT / bitmap.height);
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Your browser could not prepare this photo. Please try another image.");
    }

    canvas.width = width;
    canvas.height = height;
    context.drawImage(bitmap.source, 0, 0, width, height);

    let compressed: Blob | null = null;
    for (const quality of [0.8, 0.68, 0.56]) {
      compressed = await canvasToBlob(canvas, quality);
      if (compressed.size <= MAX_COMPRESSED_SIZE) break;
    }

    if (!compressed || compressed.size > MAX_COMPRESSED_SIZE) {
      throw new Error("This photo could not be made small enough. Please try a simpler image.");
    }

    return blobToDataUrl(compressed);
  } finally {
    bitmap.close();
  }
}

async function loadImage(
  file: File,
): Promise<{ source: CanvasImageSource; width: number; height: number; close: () => void }> {
  if ("createImageBitmap" in window) {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        close: () => bitmap.close(),
      };
    } catch {
      // Fall through to the widely supported HTMLImageElement decoder.
    }
  }

  const objectUrl = URL.createObjectURL(file);
  const image = new Image();

  try {
    image.src = objectUrl;
    await image.decode();
    return {
      source: image,
      width: image.naturalWidth,
      height: image.naturalHeight,
      close: () => URL.revokeObjectURL(objectUrl),
    };
  } catch {
    URL.revokeObjectURL(objectUrl);
    throw new Error("This image could not be opened. Please try a different file.");
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob || blob.type !== "image/webp") {
          reject(
            new Error(
              "Your browser could not compress this photo as WebP. Please try another browser.",
            ),
          );
          return;
        }
        resolve(blob);
      },
      "image/webp",
      quality,
    );
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () =>
      reject(new Error("The compressed photo could not be read. Please try again."));
    reader.readAsDataURL(blob);
  });
}
