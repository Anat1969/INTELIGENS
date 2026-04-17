
המשתמש העלה PATCH להפרדת 12 הכרטיסים לשתי קבוצות. אקרא את שאר הקובץ כדי לראות את כל הפרטים.
<lov-tool-use id="toolu_vrtx_019bPPcPNN4btCKgYjhdqmGS" name="code--view" integration-id="code" data="{\"file_path\": \"user-uploads://intelligence-patch-8vs4.md\", \"lines\": \"81-116\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_0129xWABjcFXcQwKMn2ihMYG" name="code--view" integration-id="code" data="{\"file_path\": \"user-uploads://intelligence-patch-8vs4.md\", \"lines\": \"81-116\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01KYHvC36wzinN4UTKocZgxT" name="code--list_dir" integration-id="code" data="{\"dir_path\": \"src\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_019mEajPQd6w2edUKUnjrUDa" name="code--list_dir" integration-id="code" data="{\"dir_path\": \"src/components\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01PmnkjBixSFH5RqZgDWnUmm" name="code--list_dir" integration-id="code" data="{\"dir_path\": \"src/pages\"}">
</lov-tool-use>
The previous build appears not to have been completed yet (no `src/data/intelligences.ts`, no extracted components, Index.tsx is still placeholder). I'll plan the patch as part of the upcoming build.

<lov-plan>
## פאץ' — הפרדת 12 הכרטיסים לשתי קבוצות

הגריד יוצג כשתי קבוצות נפרדות עם הבחנה ויזואלית ומושגית: 8 האינטליגנציות של גארדנר (1983) ו-4 הרחבות שנויות במחלוקת.

### שינויי נתונים (`src/data/intelligences.ts`)
- הוספת שני שדות לכל אובייקט אינטליגנציה:
  - `group: 'gardner' | 'extension'`
  - `source: string` — לדוגמה `"גארדנר, 1983"`, `"גולמן, 1995"`, `"קונספט עכשווי"`, `"תיאוריית מערכות"`, `"גארדנר, לא אושר"`.
- 01–08 → `group: 'gardner'`. 09–12 → `group: 'extension'`.

### שינויי גריד (`IntelligenceGrid`)
פיצול לרינדור של שני בלוקים:
1. גריד עליון — 8 כרטיסי גארדנר (ללא שינוי).
2. **Section divider** ביניהם:
   - קו `1px` בצבע `border`.
   - שורת כותרת: ימין `"הרחבות"` (DM Serif 18px, `text-dim`); שמאל `"שנויות במחלוקת — מחוץ לתיאוריה המקורית"` (DM Mono 10px, letter-spacing 2px, opacity 0.6).
   - קו תחתון `1px`.
3. גריד תחתון — 4 כרטיסי הרחבות.

### שינויי כרטיס (`IntelligenceCard`)
- הוספת שורת מקור קטנה מתחת לשם, לפני התיאור: DM Mono 9px, `text-dim`, opacity 0.5.
- כשהכרטיס שייך לקבוצת `extension` ולא נבחר:
  - `border-style: dashed`
  - `opacity: 0.75`
  - `background: transparent` (ללא רקע גם במצב default)
  - hover → `opacity: 1`, `border-style: solid`, transition 200ms
- כשהכרטיס נבחר — אותו עיצוב בדיוק כמו כרטיסי גארדנר (solid, אטום, רקע גוון). הבחירה מבטלת את ההבחנה.

### שינוי בלוח התוצאה (`ResultPanel`)
- אם בין הנבחרים יש לפחות אינטליגנציה אחת מקבוצת `extension`, להציג מתחת לשם הכישור הערה:
  > "צירוף זה כולל אינטליגנציה שאינה חלק מהתיאוריה המקורית של גארדנר"
  
  בסגנון DM Mono 10px, `text-dim`, opacity 0.6. אחרת — לא להציג.

### מה לא משתנה
לוגיקת `COMBOS` ו-`generateDynamic`, מערכת הצבעים הדינמית של הרקע, כל שאר העיצוב. כרטיסי ההרחבות ניתנים לבחירה לכל דבר — ההבדל הוא מידעי בלבד.
