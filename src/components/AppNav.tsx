import { useEffect, useState, useSyncExternalStore } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useGitHubAuth } from "@/hooks/useGitHubAuth";
import { DEV_CHAT_URL, RESEARCH_PROJECT_URL } from "@/lib/app-links";
import { canInstall, promptInstall, subscribeInstall } from "@/lib/pwa";

const links = [
  { to: "/", label: "בית" },
  { to: "/composer", label: "מפת האינטליגנציות" },
  { to: "/profile", label: "הפרופיל שלך" },
  { to: "/trust", label: "אמון ופרטיות" },
  { to: "/settings", label: "הגדרות" },
];

const toolClass =
  "font-mono-dm text-[11px] tracking-[0.08em] whitespace-nowrap py-1.5 px-3 rounded-lg border transition-all duration-200 hover:opacity-80 hover:-translate-y-px";
const toolStyle = {
  color: "hsl(var(--text-dim))",
  background: "hsla(var(--surface), 0.5)",
  borderColor: "hsla(var(--foreground), 0.08)",
  boxShadow: "0 1px 2px hsla(0, 0%, 0%, 0.15)",
};

/** Copies the current address, including state such as ?selected= on the composer. */
const CopyLinkButton = () => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = window.location.href;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button type="button" onClick={copy} className={toolClass} style={toolStyle} aria-live="polite">
      {copied ? "הקישור הועתק" : "העתקת קישור"}
    </button>
  );
};

const InstallButton = () => {
  const available = useSyncExternalStore(subscribeInstall, canInstall, () => false);
  if (!available) return null;
  return (
    <button type="button" onClick={promptInstall} className={toolClass} style={toolStyle}>
      התקנת האפליקציה
    </button>
  );
};

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <button type="button" onClick={() => setTheme(isDark ? "light" : "dark")} className={toolClass} style={toolStyle}>
      {isDark ? "מצב בהיר" : "מצב כהה"}
    </button>
  );
};

const ExternalTools = () => (
  <>
    <a href={DEV_CHAT_URL} target="_blank" rel="noopener noreferrer" className={toolClass} style={toolStyle}>
      שיחת הפיתוח
    </a>
    {RESEARCH_PROJECT_URL && (
      <a href={RESEARCH_PROJECT_URL} target="_blank" rel="noopener noreferrer" className={toolClass} style={toolStyle}>
        פרויקט המחקר
      </a>
    )}
  </>
);

export const AppNav = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { hasToken } = useGitHubAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "status-bar-glass" : "",
      )}
      style={{
        backgroundColor: scrolled ? "hsla(var(--background), 0.8)" : "transparent",
        boxShadow: scrolled ? "0 8px 24px -12px hsla(0, 0%, 0%, 0.35)" : "none",
      }}
    >
      <div className="mx-auto max-w-[1400px] px-4 md:px-10 h-[64px] flex items-center justify-between gap-3 min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/"
            className="font-serif-display text-[17px] whitespace-nowrap hover:opacity-80 transition-opacity"
            style={{ color: "hsl(var(--foreground))" }}
          >
            Intelligence Composer
          </Link>
          {pathname !== "/" && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="hidden md:inline-block font-mono-dm text-[11px] tracking-[0.08em] py-1.5 px-2 rounded-lg hover:opacity-70 transition-all duration-200"
              style={{ color: "hsl(var(--text-dim))" }}
            >
              חזרה
            </button>
          )}
        </div>

        <div className="hidden xl:flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "font-mono-dm text-[12px] tracking-[0.15em] whitespace-nowrap transition-all duration-200 py-1.5 px-3 rounded-lg",
                  active ? "text-foreground" : "hover:opacity-80",
                )}
                style={{
                  color: active ? undefined : "hsl(var(--text-dim))",
                  background: active ? "hsla(var(--foreground), 0.06)" : "transparent",
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 flex-none">
          <CopyLinkButton />
          <div className="hidden xl:flex items-center gap-2">
            <ExternalTools />
            <InstallButton />
            <ThemeToggle />
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className={cn("xl:hidden", toolClass)}
            style={toolStyle}
          >
            {open ? "סגירה" : "תפריט"}
          </button>
        </div>
      </div>

      {open && (
        <div
          className="xl:hidden border-t"
          style={{
            borderColor: "hsla(var(--foreground), 0.06)",
            background: "hsla(var(--background), 0.95)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="mx-auto max-w-[1400px] px-4 md:px-10 py-4 flex flex-col gap-2">
            {pathname !== "/" && (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate(-1);
                }}
                className="text-right font-mono-dm text-[12px] tracking-[0.15em] py-3 px-4 rounded-xl"
                style={{ color: "hsl(var(--text-dim))" }}
              >
                חזרה
              </button>
            )}
            {links.map((l) => {
              const active = pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="font-mono-dm text-[12px] tracking-[0.15em] py-3 px-4 rounded-xl transition-all"
                  style={{
                    color: active ? "hsl(var(--foreground))" : "hsl(var(--text-dim))",
                    background: active ? "hsla(var(--foreground), 0.06)" : "transparent",
                  }}
                >
                  {l.label}
                </Link>
              );
            })}
            <div className="pt-3 border-t flex flex-wrap justify-start gap-2" style={{ borderColor: "hsla(var(--foreground), 0.06)" }}>
              <ExternalTools />
              <InstallButton />
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}

      {!hasToken && (
        <div
          dir="rtl"
          className="border-t text-center"
          style={{
            borderColor: "hsla(var(--foreground), 0.06)",
            background: "hsla(var(--surface), 0.6)",
          }}
        >
          <p className="mx-auto max-w-[1400px] px-6 py-1.5 text-[11px]" style={{ color: "hsl(var(--text-dim))" }}>
            מצב קריאה בלבד — להזנת טוקן לעריכה:{" "}
            <Link to="/settings" className="underline hover:opacity-80" style={{ color: "hsl(var(--foreground))" }}>
              הגדרות
            </Link>
          </p>
        </div>
      )}
    </nav>
  );
};
