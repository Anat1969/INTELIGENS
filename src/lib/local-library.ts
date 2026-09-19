// src/lib/local-library.ts
// Client-side library using localStorage (works everywhere including Lovable)
import { SynthesizedIntelligence } from './synthesize'

const STORAGE_KEY = 'intelligence-library'

export interface LibraryItem extends SynthesizedIntelligence {
  id: string
  created_at: string
  image_data?: string
  parent?: string
  combo?: string
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function loadAll(): LibraryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveAll(items: LibraryItem[]): void {
  // The library index must stay small: base64 images are cached separately
  // (IndexedDB + GitHub), so never persist image_data here. Keeping it out
  // guarantees this write stays well under the localStorage quota.
  const slim = items.map(({ image_data: _image_data, ...rest }) => rest)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slim))
  } catch {
    // Quota or private-mode failure: never let a cache write crash the app.
    // The GitHub store remains the source of truth for saved merges.
  }
}

export function addToLibrary(
  intelligence: SynthesizedIntelligence,
  id?: string,
  extra?: Partial<LibraryItem>,
): LibraryItem {
  const items = loadAll()
  const key = [...intelligence.source_ids].sort().join('+')

  const existing = items.find(i => [...i.source_ids].sort().join('+') === key)
  if (existing) return existing

  const item: LibraryItem = {
    ...intelligence,
    id: id ?? generateId(),
    created_at: new Date().toISOString(),
    ...(extra ?? {}),
  }
  items.unshift(item)
  saveAll(items)
  return item
}

export function getLibrary(): LibraryItem[] {
  return loadAll()
}

export function getLibraryItem(id: string): LibraryItem | null {
  return loadAll().find(i => i.id === id) || null
}

export function updateItemImage(id: string, imageData: string): void {
  const items = loadAll()
  const item = items.find(i => i.id === id)
  if (item) {
    item.image_data = imageData
    saveAll(items)
  }
}

export function deleteFromLibrary(id: string): void {
  const items = loadAll().filter(i => i.id !== id)
  saveAll(items)
}

export function getLibraryGrouped(): { count: number; items: LibraryItem[] }[] {
  const items = loadAll()
  const groups: Record<number, LibraryItem[]> = {}
  for (const item of items) {
    const count = item.source_ids.length
    if (!groups[count]) groups[count] = []
    groups[count].push(item)
  }
  return Object.entries(groups)
    .map(([count, items]) => ({ count: Number(count), items }))
    .sort((a, b) => a.count - b.count)
}
