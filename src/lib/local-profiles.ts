// src/lib/local-profiles.ts
// Offline fallback store for saved profiles (GitHub is the source of truth).

const STORAGE_KEY = "intelligence-profiles";

export interface SavedProfile {
  id: string;
  fillerName: string;
  date: string;
  answers: (number | null)[];
  manualSelection?: string[];
  created_at: string;
}

function loadAll(): SavedProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? (arr as SavedProfile[]) : [];
  } catch {
    return [];
  }
}

function saveAll(items: SavedProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

export function getProfiles(): SavedProfile[] {
  return loadAll();
}

export function getProfile(id: string): SavedProfile | null {
  return loadAll().find((p) => p.id === id) ?? null;
}

export function addProfile(profile: SavedProfile): SavedProfile {
  const items = loadAll().filter((p) => p.id !== profile.id);
  items.unshift(profile);
  saveAll(items);
  return profile;
}

export function deleteProfile(id: string): void {
  saveAll(loadAll().filter((p) => p.id !== id));
}
