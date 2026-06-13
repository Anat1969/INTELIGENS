// src/lib/gemini.ts — Claude API synthesis (direct browser call)

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'

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

השב אך ורק ב-JSON תקין, ללא טקסט נוסף, ללא markdown, ללא backticks.
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

החזר JSON בפורמט הבא בדיוק (ללא markdown, ללא backticks):
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

export async function synthesizeIntelligence(
  intelligences: Intelligence[]
): Promise<SynthesizedIntelligence> {
  if (!intelligences || intelligences.length < 2) {
    throw new Error('At least 2 intelligences required')
  }

  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('VITE_ANTHROPIC_API_KEY is not configured')
  }

  const userPrompt = buildUserPrompt(intelligences)

  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: SYSTEM_INSTRUCTION,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Claude API error: ${response.status} - ${errorText.substring(0, 200)}`)
  }

  const data = await response.json()
  const textBlock = data.content?.find((b: { type: string }) => b.type === 'text')
  if (!textBlock) {
    throw new Error('תשובה ריקה מ-Claude')
  }

  let text = textBlock.text.trim()
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '')
  }

  const parsed = JSON.parse(text)

  return {
    name: parsed.name,
    type: parsed.type,
    essence: parsed.essence,
    power: parsed.power,
    roles: parsed.roles,
    quote: parsed.quote,
    keyQuestion: parsed.keyQuestion || '',
    visualPrompt: parsed.visualPrompt || '',
    source_ids: intelligences.map(i => i.id),
    source: 'synthesized',
  }
}
