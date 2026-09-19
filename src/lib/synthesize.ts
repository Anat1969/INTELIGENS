// src/lib/synthesize.ts — deterministic, offline synthesis engine (no network, no keys)
import {
  BY_ID,
  COMBOS,
  lookupCombo,
  type IntelligenceId,
} from '@/data/intelligences'
import { LAYERS, type LayerSlots } from '@/data/intelligenceLayers'
import { DESIGN_LAYERS, type DesignSlots } from '@/data/intelligenceDesign'

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
  naturalist: { domain: 'systems', keyword: 'pattern' },
  existential: { domain: 'depth', keyword: 'meaning' },
  emotional: { domain: 'heart', keyword: 'resonance' },
  digital: { domain: 'technology', keyword: 'logic' },
  systems: { domain: 'networks', keyword: 'leverage' },
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

export function baseVisualPrompt(id: IntelligenceId): string {
  const e = EN[id] ?? { domain: 'thought', keyword: 'attention' }
  return `An abstract dwelling devoted to ${e.domain}, built from translucent layers of ${e.keyword}. Light gathers and dissolves along its surfaces, tracing the quiet rhythm of a single way of knowing. No figures, no text — only architecture shaped by ${e.domain}.`
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

// Unique, deterministic name for a combination not in the curated COMBOS table,
// derived from the specific keywords of the combined intelligences (fixes the
// repeated generic "חושב הגבול" name). The connective varies by a hash of the ids.
const NAME_TEMPLATES: ((a: string, b: string) => string)[] = [
  (a, b) => `בין ${a} ל${b}`,
  (a, b) => `צומת ${a} ו${b}`,
  (a, b) => `מזיגת ${a} ו${b}`,
  (a, b) => `${a} של ${b}`,
  (a, b) => `${a} פוגשת ${b}`,
  (a, b) => `שדה ${a}–${b}`,
]

function hashIds(ids: IntelligenceId[]): number {
  let h = 2166136261
  const s = ids.join('+')
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function uniqueMergeName(ids: IntelligenceId[]): string {
  const kws = ids.map((id) => BY_ID[id]?.keyword).filter(Boolean) as string[]
  if (kws.length === 0) return 'מיזוג'
  if (kws.length === 1) return kws[0]
  const tpl = NAME_TEMPLATES[hashIds(ids) % NAME_TEMPLATES.length]
  const name = tpl(kws[0], kws[1])
  return kws.length > 2 ? `${name} ועוד` : name
}

export function composeIntelligence(
  sourceIds: IntelligenceId[],
): SynthesizedIntelligence {
  const ids = sortedIds(sourceIds)
  const key = ids.join('+')
  const base = lookupCombo(ids)
  const isPredefined = key in COMBOS

  return {
    name: isPredefined ? base.name : uniqueMergeName(ids),
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

// --- Three-layer prompt engine (persona → space → building) ---

export interface IntelligenceLayers {
  type: string
  prompts: { persona: string; design: string; space: string; building: string }
  interp: { persona: string; design: string; space: string; building: string }
}

const PERSONA_SUFFIX =
  'candid, unposed, authentic human presence, Documentary realism, natural lighting, shallow depth of field, 16:9, No text, No words, No writing, No frame divisions.'
const SPACE_SUFFIX =
  'no people, bold, forward-looking, innovative contemporary architecture, Professional architecture photography, documentary realism, natural light, 16:9, No text, No words, No writing, No frame divisions.'
const BUILDING_SUFFIX =
  'bold, forward-looking, innovative contemporary architecture, Professional architecture photography, documentary realism, natural light, 16:9, No text, No words, No writing, No frame divisions.'
const DESIGN_SUFFIX =
  'close-up textures and overlapping planes, no space, no figure, no building, a pure design-language moodboard as a single composition, Editorial material study, documentary realism, natural light, 16:9, No text, No words, No writing, No frame divisions.'

function personaPromptFrom(type: string, p: LayerSlots['persona']): string {
  return `A documentary portrait of ${p.archetype}, ${p.action}, in ${p.setting}, ${p.light}, ${p.materials}, ${PERSONA_SUFFIX}`
}

function designPromptFrom(type: string, d: DesignSlots): string {
  return `An abstract material and aesthetic study for ${type}, ${d.materials}, ${d.geometry}, ${d.light}, ${d.color}, ${DESIGN_SUFFIX}`
}

function spacePromptFrom(type: string, s: LayerSlots['space']): string {
  return `A contemporary architectural interior living space for ${type}, ${s.concept}, ${s.materials}, ${s.light}, ${s.rhythm} spatial rhythm, ${s.element}, ${SPACE_SUFFIX}`
}

function buildingPromptFrom(type: string, b: LayerSlots['building']): string {
  return `A contemporary architectural building and its surrounding environment, embodying ${type}'s way of shaping the world, ${b.concept}, ${b.site}, ${b.materials}, ${b.light}, ${b.scale}${b.context ? ', ' + b.context : ''}, ${BUILDING_SUFFIX}`
}

export function personaPrompt(id: IntelligenceId): string {
  const L = LAYERS[id]
  return personaPromptFrom(L.type, L.persona)
}

export function designPrompt(id: IntelligenceId): string {
  return designPromptFrom(LAYERS[id].type, DESIGN_LAYERS[id])
}

export function spacePrompt(id: IntelligenceId): string {
  const L = LAYERS[id]
  return spacePromptFrom(L.type, L.space)
}

export function buildingPrompt(id: IntelligenceId): string {
  const L = LAYERS[id]
  return buildingPromptFrom(L.type, L.building)
}

export function getLayers(id: IntelligenceId): IntelligenceLayers {
  const L = LAYERS[id]
  return {
    type: L.type,
    prompts: {
      persona: personaPrompt(id),
      design: designPrompt(id),
      space: spacePrompt(id),
      building: buildingPrompt(id),
    },
    interp: { ...L.interp, design: DESIGN_LAYERS[id].interp },
  }
}

function unionMaterials(materials: string[]): string {
  const seen = new Set<string>()
  for (const m of materials) {
    for (const part of m.split(',')) {
      const t = part.trim()
      if (t && !seen.has(t.toLowerCase())) seen.add(t.toLowerCase())
    }
  }
  const out: string[] = []
  const added = new Set<string>()
  for (const m of materials) {
    for (const part of m.split(',')) {
      const t = part.trim()
      const k = t.toLowerCase()
      if (t && seen.has(k) && !added.has(k)) {
        added.add(k)
        out.push(t)
      }
    }
  }
  return out.join(', ')
}

export function mergeLayers(sourceIds: IntelligenceId[]): IntelligenceLayers {
  const ids = sortedIds(sourceIds)
  const sources = ids.map((id) => LAYERS[id]).filter(Boolean)
  const first = sources[0] ?? LAYERS.linguistic
  const type = `the fusion of ${sources.map((s) => s.type).join(' and ')}`

  const firstDesign = DESIGN_LAYERS[ids[0]]
  const persona = { ...first.persona, materials: unionMaterials(sources.map((s) => s.persona.materials)) }
  const design = { ...firstDesign, materials: unionMaterials(ids.map((id) => DESIGN_LAYERS[id].materials)) }
  const space = { ...first.space, materials: unionMaterials(sources.map((s) => s.space.materials)) }
  const building = { ...first.building, materials: unionMaterials(sources.map((s) => s.building.materials)) }

  const sourceNames = joinHe(ids.map((id) => BY_ID[id]?.name ?? id))

  return {
    type,
    prompts: {
      persona: personaPromptFrom(type, persona),
      design: designPromptFrom(type, design),
      space: spacePromptFrom(type, space),
      building: buildingPromptFrom(type, building),
    },
    interp: {
      persona: `שילוב של ${sourceNames}: ${first.interp.persona}`,
      design: `שילוב של ${sourceNames}: ${firstDesign.interp}`,
      space: `שילוב של ${sourceNames}: ${first.interp.space}`,
      building: `שילוב של ${sourceNames}: ${first.interp.building}`,
    },
  }
}
