// src/lib/image-compress.ts
// Compress living-space images before caching/uploading, without visible
// quality loss. Oversized images are scaled down to a sane maximum and
// re-encoded as high-quality WebP (falling back to JPEG). The result is only
// used when it is actually smaller than the original.

const MAX_DIMENSION = 2048 // longest side, in pixels
const QUALITY = 0.9 // WebP/JPEG quality — visually lossless in practice

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error("image-load-failed"))
    img.src = dataUrl
  })
}

/**
 * Returns a compressed data URL, or the original string if compression is
 * unavailable or would not help. Never throws.
 */
export async function compressImage(dataUrl: string): Promise<string> {
  try {
    if (typeof document === "undefined" || !dataUrl.startsWith("data:image/")) {
      return dataUrl
    }
    // SVGs are already tiny and vector — leave them untouched.
    if (dataUrl.startsWith("data:image/svg")) return dataUrl

    const img = await loadImage(dataUrl)
    const { naturalWidth: w, naturalHeight: h } = img
    if (!w || !h) return dataUrl

    const scale = Math.min(1, MAX_DIMENSION / Math.max(w, h))
    const targetW = Math.round(w * scale)
    const targetH = Math.round(h * scale)

    const canvas = document.createElement("canvas")
    canvas.width = targetW
    canvas.height = targetH
    const ctx = canvas.getContext("2d")
    if (!ctx) return dataUrl
    ctx.drawImage(img, 0, 0, targetW, targetH)

    let out = canvas.toDataURL("image/webp", QUALITY)
    // Some browsers ignore WebP and silently return PNG — fall back to JPEG.
    if (!out.startsWith("data:image/webp")) {
      out = canvas.toDataURL("image/jpeg", QUALITY)
    }

    // Only adopt the compressed version if it actually saves space.
    return out.length < dataUrl.length ? out : dataUrl
  } catch {
    return dataUrl
  }
}
