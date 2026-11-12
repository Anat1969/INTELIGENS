// src/lib/local-library.ts
// Hybrid library: localStorage for fast synchronous reads + Supabase for persistence.
// Data survives Lovable republishes because Supabase is the source of truth.
import { SynthesizedIntelligence } from './synthesize'
import { supabase } from '@/integrations/supabase/client'

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
  const slim = items.map(({ image_data: _image_data, ...rest }) => rest)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slim))
  } catch {
    // Quota or private-mode failure — Supabase remains the source of truth.
  }
}

// --- Supabase sync (fire-and-forget, never blocks the UI) ---

function supabaseUpsert(item: LibraryItem): void {
  const sourceKey = [...item.source_ids].sort().join('+')
  supabase
    .from('synthesized_intelligences')
    .upsert({
      id: item.id,
      source_key: sourceKey,
      source_ids: item.source_ids,
      name: item.name,
      type: item.type,
      essence: item.essence,
      power: item.power,
      roles: item.roles,
      quote: item.quote,
      key_question: item.keyQuestion ?? null,
      visual_prompt: item.visualPrompt ?? null,
      image_url: item.image_data ?? null,
      source: item.source ?? 'composed',
      times_found: item.times_found ?? 1,
      created_at: item.created_at,
    }, { onConflict: 'id' })
    .then(({ error }) => {
      if (error) console.warn('Supabase upsert failed:', error.message)
    })
}

function supabaseDelete(id: string): void {
  supabase
    .from('synthesized_intelligences')
    .delete()
    .eq('id', id)
    .then(({ error }) => {
      if (error) console.warn('Supabase delete failed:', error.message)
    })
}

function supabaseUpdateImage(id: string, imageUrl: string): void {
  supabase
    .from('synthesized_intelligences')
    .update({ image_url: imageUrl })
    .eq('id', id)
    .then(({ error }) => {
      if (error) console.warn('Supabase image update failed:', error.message)
    })
}

// Hydrate localStorage from Supabase on first load.
// Runs once; merges remote items with any local-only items.
let hydrated = false
export function hydrateFromSupabase(): void {
  if (hydrated) return
  hydrated = true

  supabase
    .from('synthesized_intelligences')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)
    .then(({ data, error }) => {
      if (error || !data || data.length === 0) return

      const local = loadAll()
      const localById = new Map(local.map(i => [i.id, i]))
      const localByKey = new Map(local.map(i => [[...i.source_ids].sort().join('+'), i]))

      let changed = false
      for (const row of data) {
        const key = (row.source_ids as string[] || []).sort().join('+')
        if (!localById.has(row.id) && !localByKey.has(key)) {
          local.push({
            id: row.id,
            created_at: row.created_at,
            name: row.name,
            type: row.type,
            essence: row.essence,
            power: row.power,
            roles: row.roles || [],
            quote: row.quote,
            keyQuestion: row.key_question || undefined,
            visualPrompt: row.visual_prompt || undefined,
            source_ids: row.source_ids || [],
            source: row.source || 'composed',
            times_found: row.times_found,
          })
          changed = true
        }
      }

      if (changed) {
        saveAll(local)
        window.dispatchEvent(new Event('library-hydrated'))
      }
    })
}

// --- Public API (synchronous, same interface as before) ---

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

  supabaseUpsert(item)

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
  supabaseUpdateImage(id, imageData)
}

export function deleteFromLibrary(id: string): void {
  const items = loadAll().filter(i => i.id !== id)
  saveAll(items)
  supabaseDelete(id)
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
