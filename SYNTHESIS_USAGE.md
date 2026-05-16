# Intelligence Synthesis Engine — How It Works

## שתי אפשרויות להפעלה

### 1️⃣ בלי Backend Server (ישירה עם Gemini)
הדרך הפשוטה ביותר ל-Lovable:

1. בחר **שתי אינטליגנציות לפחות**
2. לחץ על **"סנתז אינטליגנציה חדשה"**
3. המערכת תשלח בקשה ל-Gemini API ותקבל:
   - **שם אינטליגנציה חדשה** (לא קיים בנפרד)
   - **הגרעין** — מה שנוצר בצומת
   - **העוצמה** — מה הופך אפשרי
   - **תפקידים** — 4-5 תפקידים מתאימים
   - **ציטוט** — משפט שנשאר

**דוק:** `VITE_GEMINI_API_KEY` חייב להיות בקובץ `.env.local`

---

### 2️⃣ עם SQLite Backend (לשמירת היסטוריה)
עבור מפתחים המפעילים locally:

```bash
npm run dev        # מפעיל את Vite UI + Express API server
# או בנפרד:
npm run dev:ui     # רק React app
npm run dev:api    # רק Express server
```

**מה הוא עושה:**
- ✅ בודק אם צירוף כבר סונתז (מחזיר מהמאגר)
- ✅ אם לא — משתמש בGemini כדי ליצור חדש
- ✅ שומר את הסינתזה ב-SQLite (`db/synthesis.db`)
- ✅ ספריה של כל הסינתזות שעשינו

---

## כיצד המערכת עובדת

```
User selects intelligences (e.g., Linguistic + Logical)
              ↓
     SynthesisButton triggered
              ↓
    findExisting() checks SQLite
     (or skipped if no server)
              ↓
  Gemini API generates new synthesis
(name, essence, power, roles, quote)
              ↓
   SynthesisResult displays output
     (with animation reveal)
```

---

## מה צריך לתיקון אם זה לא עובד?

### ❌ "שגיאה בסינתזה"
1. **בדוק ש-`VITE_GEMINI_API_KEY` מוגדר:**
   ```bash
   cat .env.local | grep VITE_GEMINI_API_KEY
   ```
2. **וודא שה-API Key תקין**
   - נוצר ב-[Google AI Studio](https://aistudio.google.com)
   - צריך CORS enabled

### ❌ "Server לא מגיב"
1. **בדוק ש-server פועל:**
   ```bash
   npm run dev:api
   # צריך להראות: 🚀 Server running on http://localhost:3001
   ```
2. **בדוק שה-port 3001 פנוי**
   ```bash
   lsof -i :3001
   ```

### ❌ "הטקסט לא ברור / קטן"
- ✅ זה תוקן! גדלנו את הטקסט ושיפרנו קונטרסט
- בדוק שאתה במצב בהיר או כהה בהתאם

---

## מה משפר את הAI?

**System Instruction** ב-`src/lib/gemini.ts`:
- יפעל כ"פילוסוף קוגניטיבי"
- מזהה ישויות **חדשות** שלא קיימות בנפרד
- מטייל בתיאוריית אינטליגנציות מרובות (Gardner)

**Prompt Engineering:**
- 2-4 מילים בעברית (שם)
- עמוק (גרעין ועוצמה, לא שיווקי)
- ריאליסטי (תפקידים אמיתיים)
- זוכרני (ציטוט שנשאר)

---

## שמירת הנתונים

### ב-Lovable (בלי Backend)
- סינתזות מוצגות אבל לא שמורות
- בחזור לדף = הכל מתאפס

### Locally (עם Backend)
- SQLite `db/synthesis.db`
- מעקב חוזר: `times_found` +1 לכל בקשה
- ספריה בדף Profile

---

## הקודים החשובים ביותר

- `src/lib/gemini.ts` — הקריאה ל-Gemini API
- `src/components/SynthesisButton.tsx` — זרימת ה-UI
- `src/components/SynthesisResult.tsx` — הצגת התוצאה
- `server.js` — SQLite backend (אופציונלי)
- `.env.local` — API Key שלך
