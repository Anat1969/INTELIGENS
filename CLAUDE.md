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
