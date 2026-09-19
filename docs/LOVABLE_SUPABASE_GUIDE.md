# 🔧 Getting Supabase Credentials from Lovable

Your Lovable project **already has Supabase integrated**. Here's how to find the credentials:

## Option 1: From Lovable Dashboard (Recommended)

1. **Open your Lovable project**: https://lovable.dev/projects
2. **Click on your project**
3. **Look for "Backend" or "Database" section** in the project settings
4. You should see:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon Public Key** (long string starting with `eyJ`)
5. **Copy both values**

---

## Option 2: From Supabase Dashboard Directly

If Lovable doesn't show the credentials prominently:

1. **Go to**: https://supabase.com/dashboard
2. **Find your project** (it will be named something like `lovable-project-xxxxx`)
3. **Click on it**
4. **Go to**: Settings → API (left sidebar)
5. **Copy**:
   - `Project URL` under "Your API gateway"
   - `anon public` key under "API Tokens"

---

## ⚡ Automated Setup (Quick!)

Once you have the credentials, run this command:

```bash
node setup-lovable-supabase.js
```

Then paste the values when prompted:
1. Paste your **Project URL**
2. Paste your **Anon Public Key**

The script will:
✅ Update `.env.local` automatically  
✅ Guide you to create the database table

---

## 📝 Manual Setup

If you prefer to set it up manually:

### Step 1: Update `.env.local`

```bash
cat > .env.local << 'EOF'
# Gemini API
VITE_GEMINI_API_KEY=AIzaSyCHrYd-oN78ysRjClRhPtyBcd5TkceZZtk

# Supabase Configuration (from Lovable)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
EOF
```

Replace:
- `https://xxxxx.supabase.co` with your **Project URL**
- `eyJ...` with your **Anon Public Key**

### Step 2: Create Database Table

1. **Go to**: https://supabase.com/dashboard
2. **Select your project**
3. **Left sidebar** → **SQL Editor** → **New Query**
4. **Copy entire content** of `supabase-schema.sql`
5. **Paste** into SQL Editor
6. **Click Run** (or Ctrl/Cmd + Enter)

You should see:
```
CREATE TABLE ...
CREATE INDEX ...
CREATE POLICY ...
```

### Step 3: Start Dev Server

```bash
npm run dev
```

---

## ✅ Verify It Works

1. **Open browser**: http://localhost:5173
2. **Select 2+ intelligences** (cards light up)
3. **Button appears**: "סנתז אינטליגנציה חדשה →"
4. **Click it** → Synthesis starts
5. **Results appear** with copy button
6. **Scroll down** → "ספריית הגילויים" (library of discoveries)

---

## 🚨 Troubleshooting

### ".env.local not found" / "VITE_SUPABASE_URL is not defined"
→ Make sure `.env.local` exists in **project root** (not in `src/`)  
→ Restart dev server: `npm run dev`

### "Cannot connect to Supabase"
→ Check that URL and key are copied **exactly** (no extra spaces)  
→ Verify your Supabase project is **active** (green indicator)  
→ Check your network connection

### "Table does not exist" when synthesizing
→ Go back to Supabase SQL Editor  
→ Execute `supabase-schema.sql` again  
→ Check Tables → `synthesized_intelligences` appears

---

## 📞 Quick Reference

```bash
# Check your env file
cat .env.local

# Run the automated setup
node setup-lovable-supabase.js

# Start dev
npm run dev

# Build for production
npm run build
```

---

**That's it!** Your Intelligence Synthesis Engine is ready. 🎉
