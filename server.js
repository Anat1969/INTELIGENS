// server.js - Express server with SQLite + Claude API proxy
import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import Anthropic from '@anthropic-ai/sdk'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, 'db', 'synthesis.db')

const dbDir = path.dirname(dbPath)
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const db = new Database(dbPath)
db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS synthesized_intelligences (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    source_ids TEXT NOT NULL,
    source_key TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    essence TEXT NOT NULL,
    power TEXT NOT NULL,
    roles TEXT NOT NULL,
    quote TEXT NOT NULL,
    key_question TEXT DEFAULT '',
    visual_prompt TEXT DEFAULT '',
    times_found INTEGER DEFAULT 1,
    source TEXT DEFAULT 'synthesized'
  );
`)

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_source_key
  ON synthesized_intelligences (source_key);
`)

// Add columns if they don't exist (for existing databases)
try { db.exec(`ALTER TABLE synthesized_intelligences ADD COLUMN key_question TEXT DEFAULT ''`) } catch {}
try { db.exec(`ALTER TABLE synthesized_intelligences ADD COLUMN visual_prompt TEXT DEFAULT ''`) } catch {}

const app = express()
app.use(cors())
app.use(express.json())

console.log('📦 SQLite Database API Server')
console.log('🗄️  Database:', dbPath)

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

function buildUserPrompt(intelligences) {
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

// API: Generate synthesis via Claude
app.post('/api/synthesis/generate', async (req, res) => {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey || apiKey === 'your-api-key-here') {
      return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured in .env.local' })
    }

    const { intelligences } = req.body
    if (!intelligences || intelligences.length < 2) {
      return res.status(400).json({ error: 'At least 2 intelligences required' })
    }

    const client = new Anthropic({ apiKey })
    const userPrompt = buildUserPrompt(intelligences)

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      thinking: { type: 'enabled', budget_tokens: 5000 },
      system: SYSTEM_INSTRUCTION,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const textBlock = message.content.find(b => b.type === 'text')
    if (!textBlock) {
      return res.status(500).json({ error: 'Empty response from Claude' })
    }

    let text = textBlock.text.trim()
    // Strip markdown code fences if present
    if (text.startsWith('```')) {
      text = text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '')
    }

    const parsed = JSON.parse(text)

    const result = {
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

    res.json({ success: true, data: result })
  } catch (error) {
    console.error('Claude API error:', error)
    res.status(500).json({ error: error.message || 'Claude API error' })
  }
})

// API: Find existing synthesis
app.post('/api/synthesis/find', (req, res) => {
  try {
    const { source_ids } = req.body
    const key = source_ids.sort().join('+')

    const stmt = db.prepare(
      'SELECT * FROM synthesized_intelligences WHERE source_key = ?'
    )
    const result = stmt.get(key)

    if (result) {
      const updateStmt = db.prepare(
        'UPDATE synthesized_intelligences SET times_found = times_found + 1 WHERE source_key = ?'
      )
      updateStmt.run(key)

      res.json({
        found: true,
        data: {
          source_ids: result.source_ids.split(','),
          name: result.name,
          type: result.type,
          essence: result.essence,
          power: result.power,
          roles: result.roles.split(','),
          quote: result.quote,
          keyQuestion: result.key_question || '',
          visualPrompt: result.visual_prompt || '',
          source: result.source,
        }
      })
    } else {
      res.json({ found: false })
    }
  } catch (error) {
    console.error('Error finding synthesis:', error)
    res.status(500).json({ error: error.message })
  }
})

// API: Save new synthesis
app.post('/api/synthesis/save', (req, res) => {
  try {
    const { source_ids, name, type, essence, power, roles, quote, keyQuestion, visualPrompt, source } = req.body
    const key = source_ids.sort().join('+')

    const stmt = db.prepare(`
      INSERT INTO synthesized_intelligences (
        source_ids, source_key, name, type, essence, power, roles, quote,
        key_question, visual_prompt, source, times_found
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    stmt.run(
      source_ids.join(','),
      key,
      name,
      type,
      essence,
      power,
      roles.join(','),
      quote,
      keyQuestion || '',
      visualPrompt || '',
      source || 'synthesized',
      1
    )

    res.json({ success: true, message: 'Synthesis saved' })
  } catch (error) {
    console.error('Error saving synthesis:', error)
    res.status(500).json({ error: error.message })
  }
})

// API: Fetch library
app.get('/api/synthesis/library', (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT * FROM synthesized_intelligences
      ORDER BY times_found DESC
      LIMIT 100
    `)

    const results = stmt.all()
    const library = results.map(row => ({
      source_ids: row.source_ids.split(','),
      name: row.name,
      type: row.type,
      essence: row.essence,
      power: row.power,
      roles: row.roles.split(','),
      quote: row.quote,
      keyQuestion: row.key_question || '',
      visualPrompt: row.visual_prompt || '',
      source: row.source,
      times_found: row.times_found,
    }))

    res.json({ data: library })
  } catch (error) {
    console.error('Error fetching library:', error)
    res.status(500).json({ error: error.message })
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})

process.on('SIGINT', () => {
  db.close()
  console.log('\n✅ Database closed')
  process.exit(0)
})
