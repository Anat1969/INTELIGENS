// src/lib/gemini.ts

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

const SYSTEM_INSTRUCTION = `
אתה פילוסוף קוגניטיבי שמתמחה בתיאוריית האינטליגנציה האנושית.

תפקידך: כאשר מקבלים שילוב של אינטליגנציות, לזהות מה נוצר
בצומת ביניהן — לא סכום, אלא ישות חדשה שאינה קיימת בנפרד.

חוקים קשיחים:
1. שם האינטליגנציה החדשה — 2-4 מילים בעברית, פואטי אך מדויק
2. אסור לקרוא לה בשמות המקור (לא "לשונית-לוגית")
3. היא חייבת לתאר מה שקיים רק כאשר כל הכוחות פועלים יחד
4. הגרעין — פסקה אחת, 2-3 משפטים, עמוקה ולא שיווקית
5. העוצמה — מה הופך אפשרי עם הכישור הזה שאי-אפשר בלעדיו
6. תפקידים — 4-5 תפקידים ספציפיים וריאליסטיים
7. הציטוט — משפט אחד. פואטי. מדויק. שנשאר.

השב אך ורק ב-JSON תקין, ללא טקסט נוסף.
`

export interface SynthesizedIntelligence {
  name: string
  type: string
  essence: string
  power: string
  roles: string[]
  quote: string
  source_ids: string[]
  source: 'synthesized'
}

interface GeminiIntelligence {
  name: string
  type: string
  essence: string
  power: string
  roles: string[]
  quote: string
}

interface Intelligence {
  id: string
  name: string
  domain: string
  description: string
}

function buildUserPrompt(intelligences: Intelligence[]): string {
  const list = intelligences
    .map(i => `— ${i.name} (תחום: ${i.domain})\n  ${i.description}`)
    .join('\n\n')

  return `
הנה ${intelligences.length} אינטליגנציות שנבחרו:

${list}

זהה את האינטליגנציה החדשה שנוצרת כאשר כל אלה פועלות יחד.
היא לא קיימת בשפה המקצועית עדיין. תן לה שם.

החזר JSON בפורמט הבא בדיוק:
{
  "name": "שם האינטליגנציה החדשה",
  "type": "תת-כותרת תיאורית קצרה",
  "essence": "פסקה אחת על מה שנוצר בצומת",
  "power": "פסקה אחת על מה שהופך אפשרי",
  "roles": ["תפקיד", "תפקיד", "תפקיד", "תפקיד"],
  "quote": "משפט אחד שנשאר"
}
`
}

export async function synthesizeIntelligence(
  intelligences: Intelligence[]
): Promise<SynthesizedIntelligence> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not defined')
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }]
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: buildUserPrompt(intelligences) }]
        }
      ],
      generationConfig: {
        temperature: 0.85,
        maxOutputTokens: 700,
        responseMimeType: 'application/json'
      }
    })
  })

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`)
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) {
    throw new Error('תשובה ריקה מ-Gemini')
  }

  const parsed: GeminiIntelligence = JSON.parse(text)

  return {
    ...parsed,
    source_ids: intelligences.map(i => i.id),
    source: 'synthesized'
  }
}
