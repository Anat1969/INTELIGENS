// src/lib/gemini.ts — synthesis via secure Supabase Edge Function
import { supabase } from '@/integrations/supabase/client'

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

  const { data, error } = await supabase.functions.invoke('synthesize', {
    body: { intelligences },
  })

  if (error) {
    throw new Error(error.message || 'שגיאה בקריאה לפונקציית הסינתזה')
  }
  if (!data || data.error) {
    throw new Error(data?.error || 'תשובה ריקה מהשרת')
  }

  return data as SynthesizedIntelligence
}
