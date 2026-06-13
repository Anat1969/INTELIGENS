import { memo, useRef, useCallback } from "react";
import type { Intelligence } from "@/data/intelligences";
import { cn } from "@/lib/utils";

interface Props {
  intel: Intelligence;
  selected: boolean;
  onToggle: (id: Intelligence["id"]) => void;
}

const IntelligenceCardBase = ({ intel, selected, onToggle }: Props) => {
  const isExt = intel.group === "extension";
  const hue = intel.hue;
  const cardRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
    card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) translateY(-4px) scale(1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = selected
      ? "translateY(-6px) scale(1.02)"
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
        "px-4 py-6 transition-all duration-300 ease-out",
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
        minHeight: "280px",
      }}
    >
      {/* Glow effect for selected */}
      <div
        className="intel-card-glow"
        style={{
          background: `linear-gradient(180deg, hsla(${hue}, 0.15), transparent 70%)`,
          borderRadius: "14px",
        }}
      />

      {/* Colored top accent line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] rounded-b-full transition-all duration-300"
        style={{
          width: selected ? "60%" : "30%",
          background: `hsl(${hue})`,
          opacity: selected ? 0.8 : 0.3,
        }}
      />

      {/* Number badge */}
      <span
        className="relative z-10 block font-mono-dm text-[10px] tracking-[0.3em] mb-4 transition-colors"
        style={{
          color: selected ? `hsl(${hue})` : "hsl(var(--text-dim))",
          opacity: selected ? 1 : 0.4,
        }}
      >
        {intel.number}
      </span>

      <div className="relative z-10 flex flex-col h-full">
        <h3 className="font-serif-display text-[18px] leading-tight text-foreground">
          {intel.name}
        </h3>

        <div
          className="mt-1 font-mono-dm text-[8px] tracking-[0.15em]"
          style={{ color: "hsl(var(--text-dim))", opacity: 0.4 }}
        >
          {intel.source}
        </div>

        <div
          className="mt-3 font-mono-dm text-[9px] tracking-[0.2em] uppercase"
          style={{ color: `hsl(${hue})` }}
        >
          {intel.domain}
        </div>

        <p
          className="mt-3 text-[12px] leading-[1.8] flex-1"
          style={{ color: "hsl(var(--text-dim))" }}
        >
          {intel.description}
        </p>

        <div
          className="mt-4 inline-block font-mono-dm text-[9px] tracking-[0.2em] pb-1 self-start"
          style={{
            color: "hsl(var(--foreground))",
            borderBottom: `1px solid hsla(${hue}, 0.5)`,
          }}
        >
          {intel.keyword}
        </div>
      </div>

      {/* Selection indicator */}
      {selected && (
        <div
          className="absolute top-4 left-4 w-2.5 h-2.5 rounded-full"
          style={{
            background: `hsl(${hue})`,
            boxShadow: `0 0 12px hsla(${hue}, 0.5)`,
          }}
        />
      )}
    </button>
  );
};

export const IntelligenceCard = memo(IntelligenceCardBase);
