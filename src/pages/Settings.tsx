import { useState } from "react";
import { AppNav } from "@/components/AppNav";
import { clearToken, getToken, setToken } from "@/lib/gh-token";
import { validateConnection, type ConnectionResult } from "@/lib/github-store";
import { DATA_OWNER, DATA_REPO } from "@/lib/repo-config";

const Settings = () => {
  const [value, setValue] = useState(() => getToken() ?? "");
  const [status, setStatus] = useState<string>("");
  const [result, setResult] = useState<ConnectionResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    if (!value.trim()) {
      setStatus("יש להזין טוקן לפני השמירה.");
      return;
    }
    setToken(value);
    setResult(null);
    setStatus("הטוקן נשמר בדפדפן זה.");
  };

  const handleClear = () => {
    clearToken();
    setValue("");
    setResult(null);
    setStatus("הטוקן נמחק מהדפדפן.");
  };

  const handleCheck = async () => {
    setChecking(true);
    setStatus("");
    try {
      setResult(await validateConnection());
    } finally {
      setChecking(false);
    }
  };

  const resultColor = result
    ? result.ok && result.canWrite
      ? "hsl(142 70% 45%)"
      : result.ok
        ? "hsl(38 92% 55%)"
        : "hsl(0 72% 60%)"
    : undefined;

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      <AppNav />
      <main className="mx-auto max-w-[820px] px-6 md:px-10 pt-32 pb-24" dir="rtl">
        <header className="mb-10">
          <p className="font-mono-dm text-[11px] tracking-[0.2em] mb-3" style={{ color: "hsl(var(--text-dim))" }}>
            חיבור למאגר התוכן
          </p>
          <h1 className="font-serif-display text-4xl md:text-5xl mb-4" style={{ color: "hsl(var(--foreground))" }}>
            הגדרות
          </h1>
          <p className="text-[15px] leading-relaxed" style={{ color: "hsl(var(--text-dim))" }}>
            קריאת התוכן מהמאגר הציבורי אינה דורשת טוקן. טוקן נדרש רק כדי לשמור תוכן חדש למאגר.
          </p>
        </header>

        <section
          className="rounded-2xl p-6 mb-8"
          style={{ background: "hsla(var(--surface), 0.5)", border: "1px solid hsla(var(--foreground), 0.08)" }}
        >
          <label
            className="block font-mono-dm text-[11px] tracking-[0.15em] mb-3"
            style={{ color: "hsl(var(--text-dim))" }}
            htmlFor="gh-token"
          >
            טוקן אישי של GitHub
          </label>
          <input
            id="gh-token"
            type="password"
            dir="ltr"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="github_pat_..."
            className="w-full rounded-xl px-4 py-3 text-[14px] outline-none"
            style={{
              background: "hsla(var(--background), 0.6)",
              border: "1px solid hsla(var(--foreground), 0.12)",
              color: "hsl(var(--foreground))",
            }}
          />

          <div className="flex flex-wrap gap-3 mt-4">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl px-5 py-2.5 text-[13px] transition-opacity hover:opacity-80"
              style={{ background: "hsla(var(--foreground), 0.1)", color: "hsl(var(--foreground))" }}
            >
              שמור
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="rounded-xl px-5 py-2.5 text-[13px] transition-opacity hover:opacity-80"
              style={{ border: "1px solid hsla(var(--foreground), 0.12)", color: "hsl(var(--text-dim))" }}
            >
              מחק טוקן
            </button>
            <button
              type="button"
              onClick={handleCheck}
              disabled={checking}
              className="rounded-xl px-5 py-2.5 text-[13px] transition-opacity hover:opacity-80 disabled:opacity-50"
              style={{ border: "1px solid hsla(var(--foreground), 0.12)", color: "hsl(var(--text-dim))" }}
            >
              {checking ? "בודק..." : "בדיקת חיבור"}
            </button>
          </div>

          {status && (
            <p className="mt-4 text-[13px]" style={{ color: "hsl(var(--text-dim))" }}>
              {status}
            </p>
          )}
          {result && (
            <p className="mt-4 text-[14px]" style={{ color: resultColor }}>
              {result.message}
            </p>
          )}

          <p className="mt-5 text-[12px] leading-relaxed" style={{ color: "hsl(var(--text-dim))" }}>
            הטוקן נשמר בדפדפן זה בלבד (localStorage). הוא אינו נשמר בקוד, אינו נשלח לשרתי האפליקציה,
            ויוצא מהמחשב שלך רק אל api.github.com.
          </p>
        </section>

        <section
          className="rounded-2xl p-6"
          style={{ background: "hsla(var(--surface), 0.4)", border: "1px solid hsla(var(--foreground), 0.08)" }}
        >
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="w-full text-right font-serif-display text-xl transition-opacity hover:opacity-80"
            style={{ color: "hsl(var(--foreground))" }}
            aria-expanded={open}
          >
            {open ? "הסתר הוראות ליצירת טוקן" : "כיצד יוצרים טוקן?"}
          </button>

          {open && (
            <ol
              className="mt-5 space-y-3 text-[14px] leading-relaxed list-decimal pr-5"
              style={{ color: "hsl(var(--text-dim))" }}
            >
              <li>היכנסו לחשבון GitHub שלכם ופתחו: Settings → Developer settings → Personal access tokens → Fine-grained tokens.</li>
              <li>לחצו על Generate new token, תנו שם ותאריך תפוגה.</li>
              <li>ב-Repository access בחרו Only select repositories וסמנו את המאגר {DATA_OWNER}/{DATA_REPO}.</li>
              <li>ב-Repository permissions הגדירו את ההרשאה Contents למצב Read and write. אין צורך בהרשאות נוספות.</li>
              <li>צרו את הטוקן, העתיקו אותו והדביקו אותו בשדה שלמעלה, ואז לחצו שמור ולאחר מכן בדיקת חיבור.</li>
              <li>שמרו את הטוקן במקום מאובטח: GitHub לא יציג אותו שוב. אם הוא נחשף — מחקו אותו ב-GitHub וצרו חדש.</li>
            </ol>
          )}
        </section>
      </main>
    </div>
  );
};

export default Settings;
