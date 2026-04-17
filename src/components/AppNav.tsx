import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "מפת האינטליגנציות" },
  { to: "/profile", label: "הפרופיל שלך" },
];

export const AppNav = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-40 border-b border-border"
      style={{ backgroundColor: "hsl(var(--background))" }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 h-[56px] flex items-center justify-between">
        <Link
          to="/"
          className="font-serif-display text-[16px] hover:opacity-80 transition-opacity"
          style={{ color: "hsl(var(--text-dim))" }}
        >
          Intelligence Composer
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "font-mono-dm text-[11px] tracking-[0.2em] transition-colors",
                  active ? "text-foreground" : "hover:opacity-70",
                )}
                style={{ color: active ? undefined : "hsl(var(--text-dim))" }}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="תפריט"
          className="md:hidden font-mono-dm text-[18px] leading-none"
          style={{ color: "hsl(var(--text-dim))" }}
        >
          ≡
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border">
          <div className="mx-auto max-w-[1400px] px-6 py-3 flex flex-col gap-3">
            {links.map((l) => {
              const active = pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="font-mono-dm text-[11px] tracking-[0.2em]"
                  style={{
                    color: active ? "hsl(var(--foreground))" : "hsl(var(--text-dim))",
                  }}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};
