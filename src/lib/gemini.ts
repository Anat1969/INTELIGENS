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
  if (!intelligences || intelligences.length === 0) {
    throw new Error('At least one intelligence is required to synthesize')
  }

  const list = intelligences
    .map(i => `— ${i.name} (תחום: ${i.domain})\n  ${i.description}`)
    .join('\n\n')

  const prompt = `הנה ${intelligences.length} אינטליגנציות שנבחרו:

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
}`

  return prompt.trim()
}

export async function synthesizeIntelligence(
  intelligences: Intelligence[]
): Promise<SynthesizedIntelligence> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not defined. Add it to .env.local')
  }

  console.log('🧠 Synthesizing:', intelligences.map(i => i.name).join(' + '))
  console.log('Intelligences received:', intelligences)

  if (!intelligences || intelligences.length === 0) {
    throw new Error('No intelligences provided for synthesis')
  }

  intelligences.forEach((i, idx) => {
    if (!i.name || !i.domain || !i.description) {
      console.warn(`Intelligence ${idx} missing fields:`, i)
    }
  })

  const userPrompt = buildUserPrompt(intelligences)

  if (!userPrompt || userPrompt.trim().length === 0) {
    throw new Error('Failed to build valid prompt for synthesis')
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: SYSTEM_INSTRUCTION,
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }]
        }
      ],
      generation_config: {
        temperature: 0.85,
        max_output_tokens: 700,
        response_mime_type: 'application/json'
      }
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Gemini API error:', response.status, errorText)
    throw new Error(`Gemini API error: ${response.status} - ${errorText.substring(0, 100)}`)
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) {
    console.error('Gemini response:', data)
    throw new Error('תשובה ריקה מ-Gemini')
  }

  try {
    const parsed: GeminiIntelligence = JSON.parse(text)
    console.log('✨ Synthesis complete:', parsed.name)

    return {
      ...parsed,
      source_ids: intelligences.map(i => i.id),
      source: 'synthesized'
    }
  } catch (e) {
    console.error('Failed to parse Gemini response:', text)
    throw new Error('תשובה לא תקינה מ-Gemini')
  }
}
