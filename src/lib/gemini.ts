// src/lib/gemini.ts — Synthesis via server proxy (Claude) with Gemini fallback

const API_URL = 'http://localhost:3001'

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

const SYSTEM_INSTRUCTION = `
אתה פילוסוף קוגניטיבי ומדען רב-תחומי, מתמחה בתיאוריית האינטליגנציות המרובות, פסיכולוגיה קוגניטיבית ומדעי המוח.

## תפקיד
כשמקבלים שילוב של אינטליגנציות, תפקידך לזהות את ה**ישות הקוגניטיבית החדשה** שנוצרת בצומת ביניהן. זה לא סכום חלקים — אלא תופעת-על (emergence) שאינה קיימת כשכל אינטליגנציה פועלת לבדה.

חשוב כמו מדען שחוקר תגובה כימית: שני יסודות מתמזגים ויוצרים חומר חדש עם תכונות שאף אחד מהם לא הציג לבדו.

## חוקים
1. **שם** — 2-4 מילים בעברית. פואטי, מדויק, ייחודי. לעולם אל תשתמש בשמות המקור או בווריאציות שלהם.
2. **תת-כותרת** — ביטוי קצר (3-6 מילים) שמתאר את מהות הכישור. לא שם נרדף אלא זווית אחרת.
3. **הגרעין** — פסקה בת 3-4 משפטים. תיאור פילוסופי עמוק של מה שנוצר בצומת. לא שיווקי. לא כללי. כל משפט חייב להוסיף שכבה חדשה של הבנה. השתמש במטאפורות מדויקות מעולמות הידע.
4. **העוצמה** — פסקה בת 2-3 משפטים על מה שנעשה אפשרי **רק** עם הכישור המשולב הזה — מה שאי אפשר להשיג עם כל אחת מהאינטליגנציות בנפרד. תן דוגמאות ספציפיות וקונקרטיות.
5. **תפקידים** — 5-6 תפקידים מקצועיים ספציפיים, ריאליסטיים ובלתי-שגרתיים. לא גנריים כמו "יועץ" או "מנהל". חשוב על תפקידים שרק מי שמחזיק בצירוף הזה יכול למלא.
6. **הציטוט** — משפט אחד בלבד. פואטי. מדויק. שנוגע ונשאר. לא קלישאה. מותר לו להיות פרובוקטיבי, פילוסופי, או מפתיע.
7. **שאלת-מפתח** — שאלה אחת עמוקה שרק מי שמחזיק בצירוף הזה יכול לשאול. שאלה שפותחת שדה חשיבה חדש.
8. **פרומפט ויזואלי** — פרומפט מפורט באנגלית ליצירת איור/תמונה שמייצג ומדמיין את האינטליגנציה החדשה. הפרומפט צריך לתאר סצנה ויזואלית מטאפורית שמגלמת את מהות הכישור. כתוב אותו כהנחיה ליצירת תמונה (למשל עבור DALL-E או Midjourney) — 2-3 משפטים באנגלית, עם סגנון אמנותי, תאורה, צבעים, ואלמנטים סמליים.

## סגנון
- כתוב עברית עשירה, מדויקת, עם עומק. לא פרזות. לא ז'רגון.
- כל מילה חייבת להצדיק את נוכחותה.
- היה ספציפי — אם יכולת להחליף את השם/הגרעין/העוצמה לצירוף אחר, הנוסח לא מדויק מספיק.
- הימנע ממילים כמו "סינרגיה", "ייחודי", "מדהים", "מושלם".
- הפרומפט הויזואלי — באנגלית בלבד, ספציפי ומטאפורי.

השב אך ורק ב-JSON תקין, ללא טקסט נוסף.
`

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

function buildUserPrompt(intelligences: Intelligence[]): string {
  const list = intelligences
    .map(i => `— **${i.name}** (תחום: ${i.domain})\n  ${i.description}`)
    .join('\n\n')

  return `הנה ${intelligences.length} אינטליגנציות שנבחרו:

${list}

זהה את האינטליגנציה החדשה שנוצרת בצומת כולן — הישות שלא קיימת כשאף אחת מהן פועלת לבדה.
תן לה שם שמדויק לצירוף הזה בלבד — שם שלא יתאים לשום צירוף אחר.

החזר JSON בפורמט הבא בדיוק:
{
  "name": "שם האינטליגנציה החדשה (2-4 מילים)",
  "type": "תת-כותרת תיאורית (3-6 מילים)",
  "essence": "פסקה פילוסופית עמוקה על מה שנוצר בצומת — 3-4 משפטים",
  "power": "מה הופך אפשרי רק עם הכישור המשולב — 2-3 משפטים עם דוגמאות",
  "roles": ["תפקיד ספציפי 1", "תפקיד 2", "תפקיד 3", "תפקיד 4", "תפקיד 5"],
  "quote": "משפט פואטי אחד שנשאר",
  "keyQuestion": "שאלה עמוקה אחת שרק הצירוף הזה יכול לשאול",
  "visualPrompt": "A detailed English prompt for generating an illustration that embodies this intelligence..."
}`
}

async function synthesizeViaClaude(
  intelligences: Intelligence[]
): Promise<SynthesizedIntelligence> {
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

async function synthesizeViaGemini(
  intelligences: Intelligence[]
): Promise<SynthesizedIntelligence> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('No API key available for synthesis')
  }

  const userPrompt = buildUserPrompt(intelligences)

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 1500,
        responseMimeType: 'application/json',
      },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Gemini API error: ${response.status} - ${errorText.substring(0, 100)}`)
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('תשובה ריקה מ-Gemini')

  const parsed = JSON.parse(text)
  return {
    ...parsed,
    source_ids: intelligences.map(i => i.id),
    source: 'synthesized',
  }
}

export async function synthesizeIntelligence(
  intelligences: Intelligence[]
): Promise<SynthesizedIntelligence> {
  if (!intelligences || intelligences.length < 2) {
    throw new Error('At least 2 intelligences required')
  }

  // Try Claude API (server proxy) first, fall back to Gemini
  try {
    return await synthesizeViaClaude(intelligences)
  } catch {
    console.log('Claude server unavailable, falling back to Gemini')
    return await synthesizeViaGemini(intelligences)
  }
}
