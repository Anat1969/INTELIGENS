
> **הערה (עדכון):** שרת הפיתוח המקומי (Express + SQLite, `server.js`) הוסר מהפרויקט. האפליקציה פועלת כ-SPA של Vite מול Lovable Cloud בלבד; התיעוד על השרת המקומי להלן היסטורי.
# 🚀 Quick Setup Guide — Intelligence Synthesis Engine

## ✅ Status
- ✅ Gemini API key: **already added** ✨
- ✅ Components: **all upgraded** 🎉
- ⏳ Supabase credentials: **waiting for you**
- ⏳ Database table: **needs to be created**

---

## 📋 Three Simple Steps

### Step 1️⃣ Get Supabase Credentials from Lovable

**In Lovable Dashboard:**
1. Open your project settings
2. Look for **Database**, **Supabase**, or **Backend** section
3. Copy these two values:
   - `Project URL` (looks like: `https://xxxxx.supabase.co`)
   - `Anon Public Key` (long string starting with `eyJ`)

**OR go directly to:**
- https://supabase.com/dashboard
- Find the project linked to your Lovable project
- Settings → API → Copy the two values above

---

### Step 2️⃣ Update `.env.local`

Run this command with your actual values:

```bash
cat > .env.local << 'EOF'
# Gemini API
VITE_GEMINI_API_KEY=AIzaSyCHrYd-oN78ysRjClRhPtyBcd5TkceZZtk

# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
EOF
```

Replace:
- `https://xxxxx.supabase.co` with your **Project URL**
- `eyJ...` with your **Anon Public Key**

---

### Step 3️⃣ Create Database Table

**In Supabase Dashboard:**

1. Go to https://supabase.com/dashboard
2. Select your project
3. Left sidebar → **SQL Editor**
4. Click **New Query**
5. Copy **entire content** of `supabase-schema.sql` from this repo
6. Paste into the SQL Editor
7. Click **Run** (or ⌘/Ctrl + Enter)

**You should see:** `CREATE TABLE ... CREATE INDEX ... CREATE POLICY` messages ✅

---

## 🧪 Test It

```bash
npm run dev
```

Then in browser:
1. Select 2+ intelligences (cards light up)
2. Button appears: "סנתז אינטליגנציה חדשה →"
3. Click it → synthesis begins!
4. Results display with copy button
5. Scroll down to "ספריית הגילויים" to see library
6. Click any card to expand and see details

---

## 🚨 Troubleshooting

### "VITE_SUPABASE_URL is not defined"
→ Check `.env.local` exists in project **root** (not in `src/`)
→ Restart dev server: Stop with Ctrl+C and run `npm run dev` again

### "Cannot connect to Supabase"
→ Check URL and key are **exactly copied** (no spaces)
→ Verify Supabase project is **active** (green indicator)
→ Check your network connection

### "Table does not exist" error when synthesizing
→ Go to Supabase → SQL Editor
→ Copy **entire content** of `supabase-schema.sql`
→ Execute it
→ Verify: Tables → `synthesized_intelligences` should appear

### Button doesn't appear even with 2+ selected
→ Open browser console: F12 → Console tab
→ Look for red error messages
→ Check all three env vars are set: `cat .env.local`

### "TypeError: Cannot read property 'map' of undefined"
→ Wait 1 second for library to load
→ First synthesis may take 5-10 seconds (Gemini API)
→ Check console for actual error

---

## 📋 What Was Included

### Components ✨
- **SynthesisButton** — Triggers synthesis, shows loading states
- **SynthesisResult** — Full-page display of new synthesis
- **SynthesisLibrary** — Gallery of all past syntheses
- **LibraryCard** — Click to expand/collapse individual cards

### Backend 🔌
- **gemini.ts** — Calls Gemini 1.5-Flash API
- **synthesis-store.ts** — Handles Supabase CRUD operations
- **supabase-schema.sql** — Database schema with RLS policies

### Database 🗄️
- Table: `synthesized_intelligences` (UUID primary key)
- Index: Fast lookups by source_key
- RLS: Everyone can read/insert (perfect for public demo)
- Function: `increment_times_found()` for popularity tracking

---

## 📞 Quick Command Reference

```bash
# Check env file
cat .env.local

# Run dev server
npm run dev

# Build for production
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Run helper script (if needed)
node setup-supabase.js <URL> <KEY>
```

---

## ✨ Features Once Working

- **Synthesis Engine**: Select 2+ intelligences → AI creates new one
- **Smart Caching**: Same combo? Returns instantly from library
- **Library View**: Browse all discovered syntheses
- **Expandable Cards**: Click to see full details + copy button
- **popularity Tracking**: Most-generated syntheses appear first
- **Hebrew-First**: All UI in Hebrew with proper typography

---

## 🎯 Next Steps

1. **Get your credentials** from Supabase/Lovable
2. **Update `.env.local`** with the two values
3. **Run the SQL** in Supabase SQL Editor
4. **Start dev server**: `npm run dev`
5. **Enjoy! 🎉**

---

Made with ❤️ for Intelligence Composer in Hebrew
