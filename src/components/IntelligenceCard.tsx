import { memo, useRef, useCallback, useEffect, useState } from "react";
import type { Intelligence } from "@/data/intelligences";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { onImageUpdated, resolveImage } from "@/lib/living-image";

interface Props {
  intel: Intelligence;
  selected: boolean;
  onToggle: (id: Intelligence["id"]) => void;
  onOpenArticle: (id: Intelligence["id"]) => void;
}

const IntelligenceCardBase = ({ intel, selected, onToggle, onOpenArticle }: Props) => {
  const isExt = intel.group === "extension";
  const hue = intel.hue;
  const imageId = `base-${intel.id}-persona`;
  const cardRef = useRef<HTMLDivElement>(null);
  const [personaImage, setPersonaImage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const refresh = () => {
      void resolveImage(imageId).then((image) => {
        if (active) setPersonaImage(image);
      });
    };

    refresh();
    const unsubscribe = onImageUpdated((updatedId) => {
      if (updatedId === imageId) refresh();
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [imageId]);

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

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle(intel.id);
    }
  }, [intel.id, onToggle]);

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      onClick={() => onToggle(intel.id)}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-pressed={selected}
      aria-label={`${intel.name} — בחירה להרכבה`}
      className={cn(
        "intel-card-3d group relative text-right w-full",
        "p-4 transition-all duration-300 ease-out",
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

      <div className="relative z-10 flex items-stretch gap-4">
        <div
          className="relative w-28 sm:w-32 shrink-0 self-stretch min-h-28 overflow-hidden rounded-md border"
          style={{
            borderColor: selected ? `hsla(${hue}, 0.42)` : "hsla(var(--foreground), 0.1)",
            background: personaImage
              ? "hsl(var(--surface-elevated))"
              : `linear-gradient(145deg, hsla(${hue}, 0.34), hsla(${hue}, 0.06))`,
          }}
        >
          {personaImage && (
            <img
              src={personaImage}
              alt={`דימוי אישיות עבור ${intel.name}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          {!personaImage && (
            <span
              aria-hidden="true"
              className="absolute inset-0 grid place-items-center font-serif-display text-[36px]"
              style={{ color: `hsl(${hue})`, opacity: 0.7 }}
            >
              {intel.number}
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span
              className="font-mono-dm text-[10px] tracking-[0.24em] transition-colors"
              style={{ color: selected ? `hsl(${hue})` : "hsl(var(--text-dim))" }}
            >
              {intel.number}
            </span>
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
            className="mt-2 text-[16px] leading-[1.75]"
            style={{ color: "hsla(var(--foreground), 0.9)" }}
          >
            {intel.description}
          </p>

          <div className="mt-auto flex items-center justify-between gap-3 pt-3">
            <Button
              type="button"
              variant="ghost"
              className="tool-btn h-auto"
              onClick={(e) => {
                e.stopPropagation();
                onOpenArticle(intel.id);
              }}
              aria-label={`פתח מאמר על ${intel.name}`}
            >
              פתח מאמר
            </Button>

            <span className="font-mono-dm text-[9px] tracking-[0.12em]" style={{ color: "hsl(var(--text-dim))" }}>
              {intel.source}
            </span>
          </div>
        </div>

        {selected && (
          <div
            className="absolute left-3 top-3 h-2.5 w-2.5 rounded-full"
            style={{ background: `hsl(${hue})`, boxShadow: `0 0 10px hsla(${hue}, 0.5)` }}
          />
        )}
      </div>
    </div>
  );
};

export const IntelligenceCard = memo(IntelligenceCardBase);
