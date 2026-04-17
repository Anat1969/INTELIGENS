import { memo } from "react";
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

  const style: React.CSSProperties = selected
    ? {
        borderColor: `hsl(${hue})`,
        borderStyle: "solid",
        backgroundColor: `hsla(${hue}, 0.06)`,
        boxShadow: `0 0 0 1px hsla(${hue}, 0.3)`,
        opacity: 1,
      }
    : {
        borderStyle: isExt ? "dashed" : "solid",
        backgroundColor: isExt ? "transparent" : "hsl(var(--surface))",
        opacity: isExt ? 0.75 : 1,
      };

  return (
    <button
      type="button"
      onClick={() => onToggle(intel.id)}
      aria-pressed={selected}
      className={cn(
        "group relative text-right rounded-sm border w-full",
        "px-6 py-7 transition-all duration-200 ease-out",
        "card-press cursor-pointer",
        "border-border hover:opacity-100 hover:[border-style:solid]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40",
      )}
      style={style}
    >
      {/* Number — top-left in RTL = visual top-right */}
      <span
        className="absolute top-5 left-5 font-mono-dm text-[11px] tracking-[0.3em] transition-colors"
        style={{
          color: selected ? `hsl(${hue})` : "hsl(var(--text-dim))",
          opacity: selected ? 1 : 0.5,
        }}
      >
        {intel.number}
      </span>

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
          borderBottom: `1px solid hsl(${hue})`,
        }}
      >
        {intel.keyword}
      </div>
    </button>
  );
};

export const IntelligenceCard = memo(IntelligenceCardBase);
