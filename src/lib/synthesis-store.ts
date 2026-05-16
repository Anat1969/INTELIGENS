// src/lib/synthesis-store.ts

import { createClient } from '@supabase/supabase-js'
import { SynthesizedIntelligence } from './gemini'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// מפתח ייחודי לצירוף — ממוין כדי שסדר הבחירה לא משנה
function buildSourceKey(ids: string[]): string {
  return [...ids].sort().join('+')
}

// בדיקה אם הצירוף כבר קיים במאגר
export async function findExisting(
  ids: string[]
): Promise<SynthesizedIntelligence | null> {
  const key = buildSourceKey(ids)

  const { data, error } = await supabase
    .from('synthesized_intelligences')
    .select('*')
    .eq('source_key', key)
    .single()

  if (error || !data) return null

  // עדכון מונה — הצירוף הזה נמצא שוב
  await supabase.rpc('increment_times_found', { key })

  return data as SynthesizedIntelligence
}

// שמירת אינטליגנציה חדשה שנוצרה
export async function saveNew(
  intelligence: SynthesizedIntelligence
): Promise<void> {
  const key = buildSourceKey(intelligence.source_ids)

  await supabase
    .from('synthesized_intelligences')
    .insert({
      source_key:  key,
      source_ids:  intelligence.source_ids,
      name:        intelligence.name,
      type:        intelligence.type,
      essence:     intelligence.essence,
      power:       intelligence.power,
      roles:       intelligence.roles,
      quote:       intelligence.quote,
      source:      'synthesized'
    })
}

// כל האינטליגנציות שנוצרו — לספריה
// ממוינות לפי הפופולריות (times_found)
export async function fetchLibrary(): Promise<SynthesizedIntelligence[]> {
  const { data, error } = await supabase
    .from('synthesized_intelligences')
    .select('*')
    .order('times_found', { ascending: false })
    .limit(50)

  if (error || !data) return []

  return data as SynthesizedIntelligence[]
}
