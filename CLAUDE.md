# INTELIGENS — Intelligence Composer

## מבנה הריפו
- ענף `main`: קוד האפליקציה. מסונכרן דו־כיוונית עם Lovable (פרויקט "Building Blocks", כתובת ציבורית https://inteligens.lovable.app).
- ענף `data`: התוכן (merges, profiles, images, index.json). האפליקציה קוראת ממנו דרך raw.githubusercontent.com וכותבת אליו דרך GitHub API.
- לא למזג את `data` ל-`main` ולא להפך. הענפים נפרדים בכוונה: שמירה באפליקציה לא מפעילה סנכרון או בנייה ב-Lovable.
- ההגדרה ב-`src/lib/repo-config.ts`.
- הריפו INTELIGENS-DATA אוחד לכאן (כל ההיסטוריה בענף `data`, אותו קומיט אחרון bd4efaa) ואינו בשימוש. אפשר למחוק אותו.

## עבודה
- שינויי קוד: ענף פיצ'ר ← PR ל-main ← Lovable מושך אוטומטית ← Publish ב-Lovable.
- טוקן לשמירה: Fine-grained, מאגר Anat1969/INTELIGENS, הרשאת Contents: Read and write.

## כתובות
- Lovable: https://inteligens.lovable.app (Publish ידני ב-Lovable).
- Vercel: נבנה אוטומטית מכל מיזוג ל-main (`vercel.json` מגדיר rewrites ל-SPA).

## רכיבים קבועים (לפי הסקיל end-to-end-builder)
- בלי אייקונים בכלל. כל כפתור הוא טקסט. אין להוסיף lucide-react מחוץ ל-`src/components/ui`.
- סרגל עליון קבוע בכל הדפים (`src/components/AppNav.tsx`): שם האפליקציה מקשר לבית, ניווט, וכפתור הלוגו A&I (`<ai-menu>`). בתוכו: "העתקת קישור", "שיחת הפיתוח", "פרויקט המחקר" (מוסתר עד שיש קישור), "התקנת האפליקציה".
- הקישורים החיצוניים ב-`src/lib/app-links.ts`.
- מצב המפה נשמר בכתובת (`/composer?selected=a,b`) כדי ש"העתקת קישור" ישתף אותו.
- PWA: `public/manifest.webmanifest`, `public/sw.js` (דפים מהרשת, תמונות ונכסים מהמטמון), אייקונים בלי טקסט. ה-SW לא נרשם בתצוגה המקדימה של Lovable.

## מיזוג (fusion)
- לכל אחד מ-66 הזוגות יש כרטיס קבוע ב-`src/data/fusions.ts`, שנוצר מ-`scripts/build-fusions.py`. לא לערוך ידנית בלי להריץ שוב את הבדיקות שבסקריפט.
- מבנה הכרטיס: שם, תת־כותרת, זיקוק, מנגנון המיזוג (החיכוך, ההשתלה, הגדרה, איך מזהים אותה), שכל, רגש, יצר, אינטואיציה בפעולה, תרגול, מבחן חדשנות, משפט תובנה, תיאור חזותי, פרומפט להמחשה (עברית, מסתיים ב-Documentary realism, Professional architecture photography, 1:1 --no text, words, writing, frame divisions), תפקידים.
- שלוש אינטליגנציות ומעלה: הזוג הראשון (בסדר ממוין) הוא הליבה, וכל אינטליגנציה נוספת מוסיפה שכבה (`src/lib/fusion.ts`).
- תצוגה: `src/components/FusionView.tsx`. קודם "איך נוצר המיזוג" (ארבעת שלבי המנגנון), ואז הזרימה: שכל, רגש, יצר, אינטואיציה בפעולה, ואז תרגול, מבחן חדשנות, המחשה.
- כל פרומפט להמחשה מגיע עם מסגרת לשמירת תמונה, ועם השם ומשפט התובנה מתחת לתמונה.
- פלייר A4 להדפסה ולשיתוף: `/flyer?selected=a,b` (`src/pages/Flyer.tsx`). עמוד אחד בדיוק.

## שפה עיצובית (בקשה של ענת)
- מסכים בהירים ולבנים בלבד. אין מצב כהה ואין מתג מצב (`forcedTheme="light"`).
- IBM Plex Sans Hebrew, משקל דק בכותרות גדולות. תוויות ב-IBM Plex Mono.
- גווני אפור אדריכליים, צל ועומק, כפתור ראשי בגרפיט. צבעי האינטליגנציות נשמרים כי הם נושאים משמעות.
- בלי סמלים בטקסט: לא חיצים, לא וי.

## פריסה
- רכיבים שמוצגים גם בעמודת המאמר הצרה (כמו FusionView) מחליפים עמודות לפי רוחב המיכל (`@container`), לא לפי רוחב המסך. `.fusion` מוגדר כ-`container-type: inline-size`. (תיקון: בעמוד המאמר הטקסט ליד "המחשה" נדחס לעמודה של מילה בשורה.)

## A&I logo button
The top bar holds only the app name (links home), content navigation, and ONE logo button "אד' ענת שטיבלמן A&I" (`<ai-menu>` from https://appofapp-gh.vercel.app/ai-menu.js). Every editing and development action (העתקת קישור, שיחת הפיתוח, פרויקט המחקר, התקנת האפליקציה, edit mode, add, delete) lives only inside it, never as loose buttons. Standard: https://github.com/Anat1969/AppOfApp-GH/blob/main/docs/ai-menu-standard.md

## שמירת תמונות
- תמונה שלא נשמרה למאגר (אין טוקן או אין הרשאה) נשמרת במחשב ונרשמת בתור (`src/lib/pending-images.ts`). היא עולה אוטומטית כשנפתח דף עם טוקן תקין, או אחרי "בדיקת חיבור" בהגדרות. בסרגל העליון מופיע פס שמציין כמה תמונות ממתינות.
- שגיאות GitHub מוצגות כהודעה בעברית, לא כ-JSON (`writeError` ב-`src/lib/github-store.ts`). (תיקון: הופיעה הודעת 403 גולמית כי הטוקן הישן מורשה רק ל-INTELIGENS-DATA.)
