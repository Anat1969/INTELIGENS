// src/lib/fusion.ts — the fusion layer: a curated card for every pair of intelligences,
// and a deterministic composition for three or more.
// Each card flows mind -> heart -> gut -> intuition in action, then practice and a novelty test.
import { BY_ID, type IntelligenceId } from '@/data/intelligences'
import { FUSIONS } from '@/data/fusions'

export interface Fusion {
  name: string
  type: string
  distillation: string
  mind: string
  heart: string
  gut: string
  intuition: string
  practice: string
  novelty: string
  insight: string
  visual: string
  imagePrompt: string
  roles: string[]
}

export interface FusionLayer {
  id: IntelligenceId
  name: string
  mind: string
  practice: string
}

export interface ComposedFusion extends Fusion {
  /** Sorted source ids. */
  ids: IntelligenceId[]
  /** The pair whose card is the core of the composition. */
  coreKey: string
  /** Extra intelligences layered over the core pair (three or more). */
  layers: FusionLayer[]
  /** Every other pair inside the selection, for further exploration. */
  innerPairs: { key: string; name: string; ids: IntelligenceId[] }[]
}

/** What each intelligence adds when it joins an existing fusion as a further layer. */
const ADD: Record<IntelligenceId, { mind: string; practice: string }> = {
  linguistic: {
    mind: 'השפה נותנת לזה שם: מה שהיה תחושה עמומה הופך למשפט אחד שאפשר להעביר הלאה.',
    practice: 'נסחו את מה שזיהיתם במשפט אחד של עד עשר מילים.',
  },
  logical: {
    mind: 'ההיגיון בודק את זה: מחפש מה חוזר בכל מקרה, ומפריד בין דפוס לבין צירוף מקרים.',
    practice: 'חזרו על התרגיל בשלושה מקומות שונים, ורשמו מה נשאר זהה.',
  },
  spatial: {
    mind: 'המרחב נותן לזה צורה: היכולת מקבלת מיקום, קנה מידה וכיוון, ואפשר לשרטט אותה.',
    practice: 'שרטטו על דף את מה שזיהיתם, בלי מילים.',
  },
  musical: {
    mind: 'הקצב נותן לזה זמן: מתי להיכנס, מתי לחכות ומתי לעצור.',
    practice: 'שימו לב מתי זה מופיע ומתי זה נעלם, וספרו את הפעימות שביניהם.',
  },
  kinesthetic: {
    mind: 'הגוף מוריד את זה לידיים: הידיעה עוברת מהראש לתנועה, לכלי ולחומר.',
    practice: 'עשו את זה פעם אחת בידיים, בחומר אמיתי, לפני שאתם מסבירים.',
  },
  interpersonal: {
    mind: 'האנשים שבחדר מצטרפים: היכולת נבחנת מול מי שעומד מולכם, ולא רק בתוך הראש.',
    practice: 'שתפו אדם אחד במה שזיהיתם, ושאלו מה הוא רואה אחרת.',
  },
  intrapersonal: {
    mind: 'המבט פנימה מכייל את זה: מה מתוך מה שאתם רואים שייך לעולם, ומה שייך לכם.',
    practice: 'רשמו מה הרגשתם רגע לפני שזיהיתם, ובדקו אם זה צבע את המבט.',
  },
  naturalist: {
    mind: 'עין המסווג מוסיפה הבחנה: מבדילה בין מקרים שנראים דומים ומזהה משפחות.',
    practice: 'מצאו שני מקרים שנראים זהים, ורשמו את ההבדל היחיד ביניהם.',
  },
  existential: {
    mind: 'שאלת המשמעות מכוונת את זה: לא רק איך זה פועל, אלא בשביל מה.',
    practice: 'שאלו פעם אחת: אם זה יעבוד, מה ישתנה בעוד עשר שנים?',
  },
  emotional: {
    mind: 'הרגש הופך את זה לאנרגיה: התחושה משמשת נתון, ולא רעש שצריך להשתיק.',
    practice: 'תנו לרגש שעלה שם במילה אחת, והשתמשו בו כמצפן לצעד הבא.',
  },
  digital: {
    mind: 'המכונה מגדילה את זה: מה שזוהה פעם אחת הופך לכלל שאפשר להריץ שוב ושוב.',
    practice: 'כתבו את מה שעשיתם כשלושה צעדים שמחשב היה יכול לבצע.',
  },
  systems: {
    mind: 'המבט המערכתי מאריך את זה בזמן: מה תהיה ההשפעה המושהית, ואיפה נקודת המינוף.',
    practice: 'שאלו מה יקרה בעוד חודש בעקבות הצעד הזה, ומי ירגיש את זה ראשון.',
  },
}

export function pairKey(a: IntelligenceId, b: IntelligenceId): string {
  return [a, b].sort().join('+')
}

export function sortIds(ids: IntelligenceId[]): IntelligenceId[] {
  return Array.from(new Set(ids)).sort() as IntelligenceId[]
}

function joinHe(parts: string[]): string {
  if (parts.length <= 1) return parts[0] ?? ''
  return `${parts.slice(0, -1).join(', ')} ו${parts[parts.length - 1]}`
}

export function hasFusion(ids: IntelligenceId[]): boolean {
  const s = sortIds(ids)
  return s.length >= 2 && pairKey(s[0], s[1]) in FUSIONS
}

/**
 * The fusion for any selection of two or more intelligences.
 * Pairs return their curated card. Three or more take the pair of the first two
 * (in a stable order) as the core and add each further intelligence as a layer.
 */
export function composeFusion(input: IntelligenceId[]): ComposedFusion | null {
  const ids = sortIds(input).filter((id) => id in BY_ID)
  if (ids.length < 2) return null
  const coreKey = pairKey(ids[0], ids[1])
  const core = FUSIONS[coreKey]
  if (!core) return null

  const extras = ids.slice(2)
  const innerPairs: ComposedFusion['innerPairs'] = []
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const key = pairKey(ids[i], ids[j])
      if (key === coreKey || !FUSIONS[key]) continue
      innerPairs.push({ key, name: FUSIONS[key].name, ids: [ids[i], ids[j]] })
    }
  }

  const layers: FusionLayer[] = extras.map((id) => ({
    id,
    name: BY_ID[id].name,
    mind: ADD[id].mind,
    practice: ADD[id].practice,
  }))

  if (extras.length === 0) {
    return { ...core, ids, coreKey, layers, innerPairs }
  }

  const extraNames = joinHe(extras.map((id) => BY_ID[id].name))
  return {
    ...core,
    type: `${core.type}, ${extras.length > 1 ? 'ובשכבות נוספות' : 'ובשכבה נוספת'}: ${extraNames}`,
    mind: `${core.mind} ${layers.map((l) => l.mind).join(' ')}`,
    practice: `${core.practice} ${layers.map((l) => l.practice).join(' ')}`,
    roles: core.roles,
    ids,
    coreKey,
    layers,
    innerPairs,
  }
}

/** Plain text of a fusion, for copying into an email or a document. */
export function fusionPlainText(f: ComposedFusion): string {
  const src = f.ids.map((id) => BY_ID[id].name).join(' + ')
  return [
    f.name,
    f.type,
    `נוצרה מהצירוף: ${src}`,
    '',
    f.distillation,
    '',
    `שכל: ${f.mind}`,
    '',
    `רגש: ${f.heart}`,
    '',
    `יצר: ${f.gut}`,
    '',
    `אינטואיציה בפעולה: ${f.intuition}`,
    '',
    `תרגול להיום: ${f.practice}`,
    '',
    `מבחן חדשנות: ${f.novelty}`,
    '',
    `תובנה: ${f.insight}`,
    '',
    'מפת האינטליגנציות',
  ].join('\n')
}

export function fusionUrl(ids: IntelligenceId[], path = '/composer'): string {
  const u = new URL(path, window.location.origin)
  u.searchParams.set('selected', sortIds(ids).join(','))
  return u.toString()
}
