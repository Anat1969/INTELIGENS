// src/lib/living-image.ts
// Local (offline) cache for "מרחב מחיה" images. GitHub is the source of truth.
import { imageUrl } from "./github-store";

export const imageKey = (id: string) => `img-${id}`;

export function getLocalImage(id: string): string | null {
  try {
    return localStorage.getItem(imageKey(id));
  } catch {
    return null;
  }
}

export function setLocalImage(id: string, dataUrl: string): void {
  try {
    localStorage.setItem(imageKey(id), dataUrl);
  } catch {
    /* ignore quota errors */
  }
}

export function clearLocalImage(id: string): void {
  try {
    localStorage.removeItem(imageKey(id));
  } catch {
    /* ignore */
  }
}

export function remoteImageUrl(id: string): string {
  return `${imageUrl(id)}?t=${Date.now()}`;
}

/** Resolve the best available image: GitHub first, then the local cache. */
export function resolveImage(id: string): Promise<string | null> {
  return new Promise((resolve) => {
    if (typeof Image === "undefined") {
      resolve(getLocalImage(id));
      return;
    }
    const url = remoteImageUrl(id);
    const probe = new Image();
    probe.onload = () => resolve(url);
    probe.onerror = () => resolve(getLocalImage(id));
    probe.src = url;
  });
}
