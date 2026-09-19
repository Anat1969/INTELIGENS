import { memo, useRef, useCallback } from "react";
import { Info } from "lucide-react";
import type { Intelligence } from "@/data/intelligences";
import { cn } from "@/lib/utils";

interface Props {
  intel: Intelligence;
  selected: boolean;
  onToggle: (id: Intelligence["id"]) => void;
  onOpenDetails?: (intel: Intelligence) => void;
}

const IntelligenceCardBase = ({ intel, selected, onToggle, onOpenDetails }: Props) => {
  const isExt = intel.group === "extension";
  const hue = intel.hue;
  const cardRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) translateY(-2px) scale(1.01)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = selected
      ? "translateY(-3px) scale(1.01)"
      : "translateY(0) scale(1)";
  }, [selected]);

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={() => onToggle(intel.id)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-pressed={selected}
      className={cn(
        "intel-card-3d group relative text-right w-full",
        "px-5 py-4 transition-all duration-300 ease-out",
        "card-press cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40",
        selected && "selected",
      )}
      style={{
        borderWidth: "1px",
        borderStyle: isExt && !selected ? "dashed" : "solid",
        borderColor: selected ? `hsla(${hue}, 0.5)` : "hsl(var(--border))",
        backgroundColor: selected
          ? `hsla(${hue}, 0.08)`
          : isExt
            ? "hsla(var(--surface), 0.3)"
            : "hsl(var(--surface))",
        borderRadius: "14px",
        opacity: isExt && !selected ? 0.75 : 1,
      }}
    >
      {/* Glow effect for selected */}
      <div
        className="intel-card-glow"
        style={{
          background: `linear-gradient(90deg, hsla(${hue}, 0.12), transparent 60%)`,
          borderRadius: "14px",
        }}
      />

      {/* Colored right accent line (RTL) */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] rounded-l-full transition-all duration-300"
        style={{
          height: selected ? "60%" : "30%",
          background: `hsl(${hue})`,
          opacity: selected ? 0.8 : 0.3,
        }}
      />

      {/* Horizontal layout: number | content | keyword + indicator */}
      <div className="relative z-10 flex items-center gap-4">
        {/* Number */}
        <span
          className="font-mono-dm text-[11px] tracking-[0.3em] shrink-0 w-8 text-center transition-colors"
          style={{
            color: selected ? `hsl(${hue})` : "hsl(var(--text-dim))",
            opacity: selected ? 1 : 0.4,
          }}
        >
          {intel.number}
        </span>

        {/* Vertical separator */}
        <div
          className="w-px h-10 shrink-0 transition-colors"
          style={{ background: selected ? `hsla(${hue}, 0.3)` : "hsla(var(--foreground), 0.08)" }}
        />

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h3 className="font-serif-display text-[17px] leading-tight text-foreground">
              {intel.name}
            </h3>
            <span
              className="font-mono-dm text-[9px] tracking-[0.2em] uppercase shrink-0"
              style={{ color: `hsl(${hue})` }}
            >
              {intel.domain}
            </span>
          </div>

          <p
            className="mt-1 text-[16px] leading-[1.9] line-clamp-2"
            style={{ color: "hsla(var(--foreground), 0.9)" }}
          >
            {intel.description}
          </p>
        </div>

        {/* Right side: keyword + selection dot */}
        <div className="flex items-center gap-3 shrink-0">
          <span
            className="hidden sm:block font-mono-dm text-[9px] tracking-[0.15em] pb-0.5"
            style={{
              color: "hsl(var(--foreground))",
              borderBottom: `1px solid hsla(${hue}, 0.4)`,
            }}
          >
            {intel.keyword}
          </span>

          {onOpenDetails && (
            <span
              role="button"
              tabIndex={0}
              aria-label={`פרטים על ${intel.name}`}
              title="פרטים והורדת PDF"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails(intel);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  onOpenDetails(intel);
                }
              }}
              className="shrink-0 grid place-items-center w-6 h-6 rounded-full transition-opacity opacity-40 hover:opacity-100"
              style={{ border: `1px solid hsla(${hue}, 0.4)` }}
            >
              <Info size={12} style={{ color: `hsl(${hue})` }} />
            </span>
          )}

          {selected && (
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{
                background: `hsl(${hue})`,
                boxShadow: `0 0 10px hsla(${hue}, 0.5)`,
              }}
            />
          )}
        </div>
      </div>

      {/* Source tag - tiny */}
      <div
        className="absolute bottom-2 left-3 font-mono-dm text-[7px] tracking-[0.1em]"
        style={{ color: "hsl(var(--text-dim))", opacity: 0.3 }}
      >
        {intel.source}
      </div>
    </button>
  );
};

export const IntelligenceCard = memo(IntelligenceCardBase);
