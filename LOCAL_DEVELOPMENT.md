# 🚀 Local Development - No Credentials Needed!

## What Changed

The Intelligence Synthesis Engine now works **completely locally** using SQLite. No Supabase credentials required!

### How It Works

1. **Backend Server** (`server.js`): SQLite database API
2. **Frontend** (React/Vite): Calls the backend API
3. **Persistent Storage**: Data saved in `db/synthesis.db`

---

## Getting Started

### 1. Start Development

```bash
npm run dev
```

This automatically starts:
- ✅ Backend API server (http://localhost:3001)
- ✅ Frontend dev server (http://localhost:8080)

### 2. Use the App

1. Open browser: http://localhost:8080
2. Select 2+ intelligences (cards light up)
3. Button appears: "סנתז אינטליגנציה חדשה →"
4. Click it → Synthesis starts (calls Gemini API)
5. Results display with copy button
6. Scroll down → "ספריית הגילויים" shows all past syntheses
7. **Reload the page** → Data is still there! ✨

---

## Architecture

```
┌─────────────────────────────────────┐
│     React App (Vite)                │
│  - SynthesisButton                  │
│  - SynthesisLibrary                 │
└──────────────┬──────────────────────┘
               │ HTTP Calls
               ▼
┌─────────────────────────────────────┐
│   Express Server (server.js)        │
│   - POST /api/synthesis/find        │
│   - POST /api/synthesis/save        │
│   - GET /api/synthesis/library      │
└──────────────┬──────────────────────┘
               │ SQL Queries
               ▼
┌─────────────────────────────────────┐
│   SQLite Database                   │
│   db/synthesis.db                   │
│   - synthesized_intelligences table │
│   - Persistent storage              │
└─────────────────────────────────────┘
```

---

## Database Schema

The local SQLite database stores:

```sql
synthesized_intelligences (
  id TEXT PRIMARY KEY,
  created_at TEXT,
  source_ids TEXT,      -- "id1,id2,id3"
  source_key TEXT,      -- "id1+id2+id3" (unique)
  name TEXT,
  type TEXT,
  essence TEXT,
  power TEXT,
  roles TEXT,           -- "role1,role2,role3"
  quote TEXT,
  times_found INTEGER,  -- popularity counter
  source TEXT           -- "synthesized"
)
```

---

## Commands

```bash
# Start both servers (frontend + backend)
npm run dev

# Start only backend API
npm run dev:api

# Start only frontend (for debugging)
npm run dev:ui

# Build for production
npm run build

# Check for TypeScript errors
npx tsc --noEmit
```

---

## Data Persistence

- ✅ Data survives page reload
- ✅ Data survives closing the browser
- ✅ Data survives restarting the dev server
- ✅ Reset by deleting `db/` folder

---

## Testing the Synthesis Engine

1. **Test Cache Hit**:
   - Select intelligences: `01 + 02`
   - Generate synthesis
   - Select same intelligences again
   - Should show "from cache" (instant, no Gemini call)

2. **Test Library**:
   - Generate several different syntheses
   - Scroll to "ספריית הגילויים"
   - Library shows all past syntheses
   - Most popular (highest `times_found`) appear first

3. **Test Persistence**:
   - Generate a synthesis
   - Reload the page (Ctrl/Cmd + R)
   - Library still shows the synthesis
   - Data is persistent! ✨

---

## Environment Variables

Only **one** variable is needed:

```bash
# .env.local
VITE_GEMINI_API_KEY=AIzaSyCHrYd-oN78ysRjClRhPtyBcd5TkceZZtk
```

❌ No Supabase credentials needed!  
❌ No database setup required!  
✅ Works immediately! 

---

## Troubleshooting

### "Cannot connect to localhost:3001"
→ Make sure `npm run dev` is running (not just `npm run dev:ui`)  
→ Backend server should log: "🚀 Server running on http://localhost:3001"

### "Cannot synthesize" or Gemini error
→ Check that `VITE_GEMINI_API_KEY` is in `.env.local`  
→ Check browser console (F12 → Console)

### Database file corrupted
→ Delete the `db/` folder
→ Restart dev server - new database will be created automatically

### Port 3001 or 8080 already in use
→ Kill the process using that port, or
→ Modify `server.js` (change PORT) or `vite.config.ts` (change port)

---

## Future: Switching to Supabase

When you're ready to use Supabase (production):

1. Update `src/lib/synthesis-store.ts` with Supabase code
2. Update `.env.local` with Supabase credentials:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
3. Run SQL schema: `supabase-schema.sql` in Supabase SQL Editor
4. Deploy!

The interface is the same, so switching is seamless.

---

## 📚 File Structure

```
building-blocks/
├── server.js                    ← Express backend with SQLite
├── src/
│   ├── lib/
│   │   ├── sqlite-store.ts      ← API calls to backend
│   │   ├── synthesis-store.ts   ← (deprecated, old Supabase version)
│   │   ├── gemini.ts            ← Gemini API
│   │   └── ...
│   └── components/
│       ├── SynthesisButton.tsx
│       ├── SynthesisLibrary.tsx
│       ├── SynthesisResult.tsx
│       └── ...
├── db/
│   └── synthesis.db             ← SQLite database (auto-created)
├── supabase-schema.sql          ← For future Supabase migration
└── .env.local                   ← Just needs VITE_GEMINI_API_KEY
```

---

**Happy synthesizing! 🧠✨**
