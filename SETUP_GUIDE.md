# 🚀 Quick Setup Guide — Intelligence Synthesis Engine

## ✅ Status
- ✅ Gemini API key: **already added** ✨
- ⏳ Supabase credentials: **waiting for you**
- ⏳ Database table: **needs to be created**

---

## 📋 Three Simple Steps

### Step 1: Get Supabase Credentials from Lovable

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

### Step 2: Update `.env.local`

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

### Step 3: Create Database Table

**In Supabase Dashboard:**

1. Go to https://supabase.com/dashboard
2. Select your project
3. Left sidebar → **SQL Editor**
4. Click **New Query**
5. Copy **entire content** of `supabase-schema.sql` from this repo
6. Paste into the SQL Editor
7. Click **Run** (or ⌘/Ctrl + Enter)

**Wait for success message** ✅

---

## 🧪 Test It

```bash
npm run dev
```

Then in browser:
1. Select 2+ intelligences (cards light up)
2. Button appears: "סנתז אינטליגנציה חדשה →"
3. Click it
4. Watch it synthesize! ✨

---

## 🚨 Troubleshooting

### "VITE_SUPABASE_URL is not defined"
→ Check `.env.local` exists in project **root** (not in `src/`)
→ Restart dev server: Stop and `npm run dev` again

### "Cannot connect to Supabase"
→ Check URL and key are **exactly copied** (no spaces)
→ Verify Supabase project is **active**
→ Try running SQL again in SQL Editor

### "Table does not exist"
→ Go to Supabase → SQL Editor
→ Copy **entire** `supabase-schema.sql`
→ Execute it
→ Check: Tables → `synthesized_intelligences` appears

### Button doesn't appear even with 2+ selected
→ Open browser console: F12
→ Look for red errors
→ Check all three env vars are set correctly

---

## 📞 Quick Command Reference

```bash
# Check env is correct
cat .env.local

# Run dev server
npm run dev

# Build for production
npm run build

# Check TypeScript errors
npx tsc --noEmit
```

---

## ✨ Once Working

The app now has:
- **Synthesis**: Combine any 2+ intelligences → AI generates new one
- **Caching**: Same combination? Returns instantly from library
- **Library**: Browse all discovered combinations
- **Copy**: Share synthesized intelligences as formatted text

---

Made with ❤️ for Intelligence Composer in Hebrew
