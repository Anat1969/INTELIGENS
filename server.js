// server.js - Simple Express server for local SQLite API
import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, 'db', 'synthesis.db')

// Ensure db directory exists
const dbDir = path.dirname(dbPath)
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

// Initialize database
const db = new Database(dbPath)
db.pragma('journal_mode = WAL')

// Create table if not exists
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
    times_found INTEGER DEFAULT 1,
    source TEXT DEFAULT 'synthesized'
  );
`)

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_source_key
  ON synthesized_intelligences (source_key);
`)

const app = express()
app.use(cors())
app.use(express.json())

console.log('📦 SQLite Database API Server')
console.log('🗄️  Database:', dbPath)

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
      // Increment times_found
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
    const { source_ids, name, type, essence, power, roles, quote, source } = req.body
    const key = source_ids.sort().join('+')

    const stmt = db.prepare(`
      INSERT INTO synthesized_intelligences (
        source_ids, source_key, name, type, essence, power, roles, quote, source, times_found
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      LIMIT 50
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
      source: row.source,
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

// Handle graceful shutdown
process.on('SIGINT', () => {
  db.close()
  console.log('\n✅ Database closed')
  process.exit(0)
})
