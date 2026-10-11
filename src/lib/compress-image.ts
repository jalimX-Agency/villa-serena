/** Browser-only: resize to max 2400px and convert to WebP so uploads stay small and fast. */
const MAX_SIDE = 2400;

export async function compressImage(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  for (const q of [0.85, 0.75, 0.65]) {
    const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, "image/webp", q));
    if (blob && blob.size <= 3 * 1024 * 1024) {
      return new File([blob], file.name.replace(/\.\w+$/, ".webp"), { type: "image/webp" });
    }
  }
  throw new Error("Image trop lourde même après compression.");
}
