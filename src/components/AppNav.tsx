import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "בית" },
  { to: "/composer", label: "מפת האינטליגנציות" },
  { to: "/profile", label: "הפרופיל שלך" },
];

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Light mode" : "Dark mode"}
      className="p-2.5 rounded-xl hover:opacity-70 transition-all duration-200"
      style={{
        color: "hsl(var(--text-dim))",
        background: "hsla(var(--surface), 0.5)",
      }}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
};

export const AppNav = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
        backgroundColor: scrolled
          ? "hsla(var(--background), 0.8)"
          : "transparent",
      }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 h-[64px] flex items-center justify-between">
        <Link
          to="/"
          className="font-serif-display text-[17px] hover:opacity-80 transition-opacity"
          style={{ color: "hsl(var(--foreground))" }}
        >
          Intelligence Composer
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "font-mono-dm text-[11px] tracking-[0.15em] transition-all duration-200 py-1.5 px-3 rounded-lg",
                  active
                    ? "text-foreground"
                    : "hover:opacity-80",
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
          <ThemeToggle />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="תפריט"
          className="md:hidden p-2 rounded-lg transition-colors"
          style={{ color: "hsl(var(--text-dim))" }}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div
          className="md:hidden border-t"
          style={{
            borderColor: "hsla(var(--foreground), 0.06)",
            background: "hsla(var(--background), 0.95)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="mx-auto max-w-[1400px] px-6 py-4 flex flex-col gap-2">
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
            <div className="pt-3 border-t flex justify-start" style={{ borderColor: "hsla(var(--foreground), 0.06)" }}>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
