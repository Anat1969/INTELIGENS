
> **הערה (עדכון):** שרת הפיתוח המקומי (Express + SQLite, `server.js`) הוסר מהפרויקט. האפליקציה פועלת כ-SPA של Vite מול Lovable Cloud בלבד; התיעוד על השרת המקומי להלן היסטורי.
# Lovable — Environment Variables Setup

## הבעיה
`VITE_GEMINI_API_KEY is not defined`

זה אומר ש-Lovable לא קורא את ה-`.env.local` שלך.

---

## הפתרון: הוסף את API Key ב-Lovable

### 1️⃣ בLovable, לך ל-**Project Settings** (⚙️)

### 2️⃣ בחר **Environment Variables**

### 3️⃣ לחץ **Add Variable**

### 4️⃣ הוסף:
```
Variable Name: VITE_GEMINI_API_KEY
Value: AIzaSyCHrYd-oN78ysRjClRhPtyBcd5TkceZZtk
```

### 5️⃣ Save וRefresh את ה-browser (Ctrl+R או Cmd+R)

---

## ✅ בדיקה

כשיחזור כל עובד, תראה:
1. בחר שתי אינטליגנציות
2. לחץ "סנתז אינטליגנציה חדשה"
3. בConsole (F12) → צריך לראות:
   ```
   🧠 Synthesizing: [שם] + [שם]
   ✨ Synthesis complete: [שם חדש]
   ```

---

## אם זה לא עובד עדיין?

1. **בדוק ש-API Key נכון:**
   - פתח: https://aistudio.google.com
   - בדוק את הAPI Keys שלך שם
   
2. **וודא שה-Environment Variable חזר (reload page)**
   - הקש F12, Console
   - צריך לא להראות error על VITE_GEMINI_API_KEY

3. **בדוק Network:**
   - F12 → Network tab
   - כשלוחץ סנתז, אמור להראות request ל-`generativelanguage.googleapis.com`
