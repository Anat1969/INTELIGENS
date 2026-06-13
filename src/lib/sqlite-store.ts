// src/lib/sqlite-store.ts
// Local SQLite API calls (backend server handles database)
import { SynthesizedIntelligence } from './gemini'

const API_URL = 'http://localhost:3001'

export function buildSourceKey(ids: string[]): string {
  return ids.sort().join('+')
}

export async function findExisting(ids: string[]): Promise<SynthesizedIntelligence | null> {
  try {
    const res = await fetch(`${API_URL}/api/synthesis/find`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source_ids: ids }),
    })

    if (!res.ok) {
      console.warn(`SQLite API unavailable (${res.status}). Will generate new synthesis.`)
      return null
    }

    const { found, data } = await res.json()
    return found ? data : null
  } catch (error) {
    console.warn('SQLite API not available:', error)
    return null
  }
}

export async function saveNew(intelligence: SynthesizedIntelligence): Promise<void> {
  try {
    const res = await fetch(`${API_URL}/api/synthesis/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(intelligence),
    })

    const result = await res.json()
    if (!result.success) {
      throw new Error(result.error)
    }
  } catch (error) {
    console.error('Error saving synthesis:', error)
    throw error
  }
}

export async function fetchLibrary(): Promise<SynthesizedIntelligence[]> {
  try {
    const res = await fetch(`${API_URL}/api/synthesis/library`)
    const { data } = await res.json()
    return data || []
  } catch (error) {
    console.error('Error fetching library:', error)
    return []
  }
}
