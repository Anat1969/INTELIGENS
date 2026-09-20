// src/lib/living-image.ts
// Local (offline) cache for "מרחב מחיה" images. GitHub is the source of truth.
//
// Images are base64 data URLs and are far too large for localStorage, whose
// per-origin quota (~5MB) is shared across every key. Caching them there used
// to fill the whole budget and made unrelated writes (e.g. the library index)
// throw "exceeded the quota". They now live in IndexedDB, which offers orders
// of magnitude more space. localStorage is used only as a fallback when
// IndexedDB is unavailable, and any images previously cached there are migrated
// over on first use.
import { imageUrl } from "./github-store";

export const imageKey = (id: string) => `img-${id}`;

/** Storage id for a merge's single "cover" image (shown on its library card). */
export const coverImageId = (mergeId: string) => `${mergeId}-cover`;

const IMAGE_UPDATED_EVENT = "living-image:updated";

const DB_NAME = "inteligens";
const DB_VERSION = 1;
const STORE = "living-images";

function dispatchImageUpdated(id: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(IMAGE_UPDATED_EVENT, { detail: { id } }));
}

export function onImageUpdated(cb: (id: string) => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  const listener = (event: Event) => {
    const detail = (event as CustomEvent<{ id?: string }>).detail;
    if (detail?.id) cb(detail.id);
  };
  window.addEventListener(IMAGE_UPDATED_EVENT, listener);
  return () => window.removeEventListener(IMAGE_UPDATED_EVENT, listener);
}

/* ------------------------------------------------------------------ */
/* IndexedDB key-value backend (no dependencies)                       */
/* ------------------------------------------------------------------ */

let dbPromise: Promise<IDBDatabase | null> | null = null;

function openDB(): Promise<IDBDatabase | null> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve) => {
    try {
      if (typeof indexedDB === "undefined") {
        resolve(null);
        return;
      }
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      };
      request.onsuccess = () => {
        void migrateFromLocalStorage(request.result);
        resolve(request.result);
      };
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
  return dbPromise;
}

function idbGet(id: string): Promise<string | null> {
  return openDB().then(
    (db) =>
      new Promise<string | null>((resolve) => {
        if (!db) {
          resolve(lsGet(id));
          return;
        }
        try {
          const tx = db.transaction(STORE, "readonly");
          const req = tx.objectStore(STORE).get(imageKey(id));
          req.onsuccess = () =>
            resolve(typeof req.result === "string" ? req.result : null);
          req.onerror = () => resolve(lsGet(id));
        } catch {
          resolve(lsGet(id));
        }
      }),
  );
}

function idbSet(id: string, dataUrl: string): Promise<void> {
  return openDB().then(
    (db) =>
      new Promise<void>((resolve) => {
        if (!db) {
          lsSet(id, dataUrl);
          resolve();
          return;
        }
        try {
          const tx = db.transaction(STORE, "readwrite");
          tx.objectStore(STORE).put(dataUrl, imageKey(id));
          tx.oncomplete = () => resolve();
          tx.onerror = () => {
            lsSet(id, dataUrl);
            resolve();
          };
        } catch {
          lsSet(id, dataUrl);
          resolve();
        }
      }),
  );
}

function idbDel(id: string): Promise<void> {
  return openDB().then(
    (db) =>
      new Promise<void>((resolve) => {
        lsDel(id); // clear any stale fallback copy too
        if (!db) {
          resolve();
          return;
        }
        try {
          const tx = db.transaction(STORE, "readwrite");
          tx.objectStore(STORE).delete(imageKey(id));
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        } catch {
          resolve();
        }
      }),
  );
}

/** One-time move of legacy `img-*` entries out of localStorage into IndexedDB. */
async function migrateFromLocalStorage(db: IDBDatabase): Promise<void> {
  try {
    if (typeof localStorage === "undefined") return;
    const legacyKeys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("img-")) legacyKeys.push(key);
    }
    if (legacyKeys.length === 0) return;
    for (const key of legacyKeys) {
      const value = localStorage.getItem(key);
      if (typeof value === "string") {
        await new Promise<void>((resolve) => {
          try {
            const tx = db.transaction(STORE, "readwrite");
            tx.objectStore(STORE).put(value, key);
            tx.oncomplete = () => resolve();
            tx.onerror = () => resolve();
          } catch {
            resolve();
          }
        });
      }
      // Free the localStorage space once the copy is safely in IndexedDB.
      try {
        localStorage.removeItem(key);
      } catch {
        /* ignore */
      }
    }
  } catch {
    /* migration is best-effort */
  }
}

/* ------------------------------------------------------------------ */
/* localStorage fallback (only when IndexedDB is unavailable)          */
/* ------------------------------------------------------------------ */

function lsGet(id: string): string | null {
  try {
    return localStorage.getItem(imageKey(id));
  } catch {
    return null;
  }
}

function lsSet(id: string, dataUrl: string): void {
  try {
    localStorage.setItem(imageKey(id), dataUrl);
  } catch {
    /* ignore quota errors */
  }
}

function lsDel(id: string): void {
  try {
    localStorage.removeItem(imageKey(id));
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------------------ */
/* Public API (Promise-based)                                          */
/* ------------------------------------------------------------------ */

export function getLocalImage(id: string): Promise<string | null> {
  return idbGet(id);
}

export async function setLocalImage(id: string, dataUrl: string): Promise<void> {
  await idbSet(id, dataUrl);
  dispatchImageUpdated(id);
}

export async function clearLocalImage(id: string): Promise<void> {
  await idbDel(id);
  dispatchImageUpdated(id);
}

export function remoteImageUrl(id: string, cacheBuster = Date.now()): string {
  return `${imageUrl(id)}?t=${cacheBuster}`;
}

/** Resolve the best available image: GitHub first, then the local cache. */
export function resolveImage(id: string): Promise<string | null> {
  return new Promise((resolve) => {
    if (typeof Image === "undefined") {
      void getLocalImage(id).then(resolve);
      return;
    }
    const url = remoteImageUrl(id);
    const probe = new Image();
    probe.onload = () => resolve(url);
    probe.onerror = () => void getLocalImage(id).then(resolve);
    probe.src = url;
  });
}

/** Resolve an image into a stable, embedded source that Chromium can print reliably. */
export async function resolvePrintImage(id: string): Promise<string | null> {
  const local = await getLocalImage(id);
  if (local) return local;

  const stableRemoteUrl = remoteImageUrl(id, Date.now());
  try {
    const response = await fetch(stableRemoteUrl, { cache: "no-store" });
    if (!response.ok) return getLocalImage(id);
    const blob = await response.blob();
    return await new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : null);
      reader.onerror = () => void getLocalImage(id).then(resolve);
      reader.readAsDataURL(blob);
    });
  } catch {
    return getLocalImage(id);
  }
}
