// src/lib/gemini.ts — Claude API synthesis (via server proxy)

const API_URL = 'http://localhost:3001'

export interface SynthesizedIntelligence {
  name: string
  type: string
  essence: string
  power: string
  roles: string[]
  quote: string
  keyQuestion?: string
  visualPrompt?: string
  source_ids: string[]
  source: 'synthesized'
  times_found?: number
}

interface Intelligence {
  id: string
  name: string
  domain: string
  description: string
}

export async function synthesizeIntelligence(
  intelligences: Intelligence[]
): Promise<SynthesizedIntelligence> {
  if (!intelligences || intelligences.length < 2) {
    throw new Error('At least 2 intelligences required')
  }

  const response = await fetch(`${API_URL}/api/synthesis/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ intelligences }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: `HTTP ${response.status}` }))
    throw new Error(err.error || `Server error: ${response.status}`)
  }

  const { data } = await response.json()
  return data as SynthesizedIntelligence
}
