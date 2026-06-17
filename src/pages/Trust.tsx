import { AppNav } from "@/components/AppNav";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-10">
    <h2 className="font-serif-display text-2xl mb-3" style={{ color: "hsl(var(--foreground))" }}>{title}</h2>
    <div className="space-y-2 text-[15px] leading-relaxed" style={{ color: "hsl(var(--text-dim))" }}>
      {children}
    </div>
  </section>
);

const Trust = () => {
  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      <AppNav />
      <main className="mx-auto max-w-[820px] px-6 md:px-10 pt-32 pb-24" dir="rtl">
        <header className="mb-12">
          <p className="font-mono-dm text-[11px] tracking-[0.2em] mb-3" style={{ color: "hsl(var(--text-dim))" }}>
            אמון ופרטיות
          </p>
          <h1 className="font-serif-display text-4xl md:text-5xl mb-4" style={{ color: "hsl(var(--foreground))" }}>
            מרכז האמון
          </h1>
          <p className="text-[15px] leading-relaxed" style={{ color: "hsl(var(--text-dim))" }}>
            עמוד זה מתוחזק על־ידי בעלי האפליקציה Intelligence Composer כדי לענות על שאלות נפוצות בנוגע לאבטחה,
            פרטיות ועיבוד מידע. זהו תוכן הניתן לעריכה ואינו מהווה הסמכה רשמית או אימות עצמאי מטעם פלטפורמת ההרצה.
          </p>
        </header>

        <Section title="גישה ואימות">
          <p>
            בשלב הנוכחי האפליקציה אינה דורשת הרשמה או התחברות כדי להשתמש בכלי האינטליגנציות.
            כאשר נוסיף אימות משתמשים, נשתמש בתשתית האימות המנוהלת של הספק העורפי שלנו.
          </p>
        </Section>

        <Section title="פלטפורמה ואירוח">
          <p>
            האפליקציה מתארחת על תשתית Lovable Cloud. תקשורת לקוח־שרת מתבצעת על־גבי HTTPS.
            פונקציונליות עורפית רגישה (כגון קריאות למודלי שפה) מבוצעת בפונקציות שרת ולא בדפדפן,
            כך שמפתחות API אינם נחשפים ללקוח.
          </p>
        </Section>

        <Section title="איסוף ושימוש במידע">
          <p>
            תשובות שאלון הפרופיל ובחירות האינטליגנציות שלך מעובדות לצורך יצירת התובנות והסינתזה שמוצגות לך.
            המידע שאתה מזין אינו משמש למטרות שיווק ואינו נמכר לצדדים שלישיים.
          </p>
        </Section>

        <Section title="ספקי מודלים וצדדים שלישיים">
          <p>
            לצורך יצירת הסינתזה, הטקסט שמרכיב את הפרומפט נשלח דרך שער ה־AI של Lovable אל ספק מודל שפה (Google Gemini).
            תוכן זה כפוף למדיניות של אותם ספקים.
          </p>
        </Section>

        <Section title="שמירה ומחיקה">
          <p>
            ספריית הסינתזות והעדפות התצוגה נשמרות מקומית בדפדפן שלך (localStorage). באפשרותך לנקות אותן בכל עת
            דרך הגדרות הדפדפן או ממשק הספרייה באפליקציה.
          </p>
        </Section>

        <Section title="בקשות פרטיות ויצירת קשר">
          <p>
            לכל שאלה בנושא פרטיות, מידע או אבטחה, ניתן לפנות לבעלי האפליקציה דרך ערוצי התמיכה הרגילים שלה.
          </p>
        </Section>

        <Section title="אחריות משותפת">
          <p>
            פלטפורמת ההרצה אחראית על אבטחת התשתית הבסיסית. בעלי האפליקציה אחראים על ההיגיון העסקי,
            הגדרות ההרשאות והתוכן המוצג. המשתמשים אחראים על שמירת פרטי הגישה שלהם.
          </p>
        </Section>
      </main>
    </div>
  );
};

export default Trust;