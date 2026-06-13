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
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) translateY(-4px) scale(1.01)`;
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
        "px-6 py-7 transition-all duration-300 ease-out",
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
        borderRadius: "16px",
        opacity: isExt && !selected ? 0.75 : 1,
      }}
    >
      {/* Glow effect for selected */}
      <div
        className="intel-card-glow"
        style={{
          background: `linear-gradient(135deg, hsla(${hue}, 0.15), transparent 60%)`,
          borderRadius: "16px",
        }}
      />

      {/* Number */}
      <span
        className="relative z-10 block absolute top-5 left-5 font-mono-dm text-[11px] tracking-[0.3em] transition-colors"
        style={{
          color: selected ? `hsl(${hue})` : "hsl(var(--text-dim))",
          opacity: selected ? 1 : 0.5,
        }}
      >
        {intel.number}
      </span>

      <div className="relative z-10">
        <h3 className="font-serif-display text-[20px] leading-tight text-foreground">
          {intel.name}
        </h3>

        <div
          className="mt-1 font-mono-dm text-[9px] tracking-[0.15em]"
          style={{ color: "hsl(var(--text-dim))", opacity: 0.5 }}
        >
          {intel.source}
        </div>

        <div
          className="mt-3 font-mono-dm text-[10px] tracking-[0.2em] uppercase"
          style={{ color: `hsl(${hue})` }}
        >
          {intel.domain}
        </div>

        <p
          className="mt-3 text-[13px] leading-[1.75]"
          style={{ color: "hsl(var(--text-dim))" }}
        >
          {intel.description}
        </p>

        <div
          className="mt-4 inline-block font-mono-dm text-[10px] tracking-[0.2em] pb-1"
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
          className="absolute top-4 right-4 w-3 h-3 rounded-full"
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
