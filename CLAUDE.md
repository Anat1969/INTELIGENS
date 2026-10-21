# INTELIGENS — Intelligence Composer

## מבנה הריפו
- ענף `main`: קוד האפליקציה. מסונכרן דו־כיוונית עם Lovable (פרויקט "Building Blocks", כתובת ציבורית https://inteligens.lovable.app).
- ענף `data`: התוכן (merges, profiles, images, index.json). האפליקציה קוראת ממנו דרך raw.githubusercontent.com וכותבת אליו דרך GitHub API.
- לא למזג את `data` ל-`main` ולא להפך. הענפים נפרדים בכוונה: שמירה באפליקציה לא מפעילה סנכרון או בנייה ב-Lovable.
- ההגדרה ב-`src/lib/repo-config.ts`.
- הריפו INTELIGENS-DATA אוחד לכאן (כל ההיסטוריה בענף `data`) ואינו בשימוש.

## עבודה
- שינויי קוד: ענף פיצ'ר ← PR ל-main ← Lovable מושך אוטומטית ← Publish ב-Lovable.
- טוקן לשמירה: Fine-grained, מאגר Anat1969/INTELIGENS, הרשאת Contents: Read and write.

## כתובות
- Lovable: https://inteligens.lovable.app (Publish ידני ב-Lovable).
- Vercel: נבנה אוטומטית מכל מיזוג ל-main (`vercel.json` מגדיר rewrites ל-SPA).

## רכיבים קבועים (לפי הסקיל end-to-end-builder)
- בלי אייקונים בכלל. כל כפתור הוא טקסט. אין להוסיף lucide-react מחוץ ל-`src/components/ui`.
- סרגל עליון קבוע בכל הדפים (`src/components/AppNav.tsx`): שם האפליקציה מקשר לבית, "העתקת קישור", "שיחת הפיתוח", "פרויקט המחקר" (מוסתר עד שיש קישור), "התקנת האפליקציה" כש-Chrome מציע.
- הקישורים החיצוניים ב-`src/lib/app-links.ts`.
- מצב המפה נשמר בכתובת (`/composer?selected=a,b`) כדי ש"העתקת קישור" ישתף אותו.
- PWA: `public/manifest.webmanifest`, `public/sw.js` (דפים מהרשת, תמונות ונכסים מהמטמון), אייקונים בלי טקסט. ה-SW לא נרשם בתצוגה המקדימה של Lovable.
