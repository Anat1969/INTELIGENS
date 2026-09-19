// src/lib/synthesize.ts — deterministic, offline synthesis engine (no network, no keys)
import {
  BY_ID,
  COMBOS,
  lookupCombo,
  type IntelligenceId,
} from '@/data/intelligences'

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
  source: string
  times_found?: number
}

const EN: Record<IntelligenceId, { domain: string; keyword: string }> = {
  linguistic: { domain: 'language', keyword: 'poetics' },
  logical: { domain: 'logic', keyword: 'structure' },
  spatial: { domain: 'vision', keyword: 'composition' },
  musical: { domain: 'rhythm', keyword: 'pattern' },
  kinesthetic: { domain: 'body', keyword: 'touch' },
  interpersonal: { domain: 'society', keyword: 'presence' },
  intrapersonal: { domain: 'inwardness', keyword: 'clarity' },
  naturalistic: { domain: 'systems', keyword: 'pattern' },
  existential: { domain: 'depth', keyword: 'meaning' },
  emotional: { domain: 'heart', keyword: 'resonance' },
  digital: { domain: 'technology', keyword: 'logic' },
  social: { domain: 'networks', keyword: 'leverage' },
}

function sortedIds(ids: IntelligenceId[]): IntelligenceId[] {
  return [...ids].sort()
}

export function comboLabel(sourceIds: IntelligenceId[]): string {
  return sortedIds(sourceIds)
    .map((id) => BY_ID[id]?.name ?? id)
    .join(' + ')
}

function joinHe(parts: string[]): string {
  if (parts.length <= 1) return parts[0] ?? ''
  return `${parts.slice(0, -1).join(', ')} ו${parts[parts.length - 1]}`
}

function buildVisualPrompt(ids: IntelligenceId[]): string {
  const en = ids.map((id) => EN[id]).filter(Boolean)
  const domains = en.map((e) => e.domain).join(', ')
  const keywords = en.map((e) => e.keyword).join(' and ')
  return `An abstract living space where ${domains} fuse into a single dwelling of thought. Light moves through translucent layers of ${keywords}, each surface holding the memory of a different way of knowing. No figures, no text — only architecture made of attention.`
}

function buildKeyQuestion(ids: IntelligenceId[]): string {
  const names = ids.map((id) => BY_ID[id]?.name ?? id)
  const domains = ids.map((id) => BY_ID[id]?.domain ?? '')
  return `מה נעשה אפשרי כאשר ${joinHe(names)} פועלות יחד — שאלה שאינה קיימת כלל בתוך ${joinHe(domains)} בנפרד?`
}

function personalize(text: string, ids: IntelligenceId[], kind: 'essence' | 'power'): string {
  const names = ids.map((id) => BY_ID[id]?.name ?? id)
  const keywords = ids.map((id) => BY_ID[id]?.keyword ?? '')
  if (kind === 'essence') {
    return `${text} כאן הצירוף המדויק הוא ${joinHe(names)}, ולכן נקודת המפגש נוצרת בין ${joinHe(keywords)}.`
  }
  const domains = ids.map((id) => BY_ID[id]?.domain ?? '')
  return `${text} בפועל מדובר ביכולת לנוע בין ${joinHe(domains)} בתוך אותה משימה, בלי לאבד את הדיוק של אף אחד מהם.`
}

export function composeIntelligence(
  sourceIds: IntelligenceId[],
): SynthesizedIntelligence {
  const ids = sortedIds(sourceIds)
  const key = ids.join('+')
  const base = lookupCombo(ids)
  const isPredefined = key in COMBOS

  return {
    name: base.name,
    type: base.type,
    essence: isPredefined ? base.essence : personalize(base.essence, ids, 'essence'),
    power: isPredefined ? base.power : personalize(base.power, ids, 'power'),
    roles: [...base.roles],
    quote: base.quote,
    keyQuestion: buildKeyQuestion(ids),
    visualPrompt: buildVisualPrompt(ids),
    source_ids: ids,
    source: 'composed',
  }
}
