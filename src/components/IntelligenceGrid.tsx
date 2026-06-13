import { INTELLIGENCES, type IntelligenceId } from "@/data/intelligences";
import { IntelligenceCard } from "./IntelligenceCard";

interface Props {
  selected: IntelligenceId[];
  onToggle: (id: IntelligenceId) => void;
}

export const IntelligenceGrid = ({ selected, onToggle }: Props) => {
  const gardner = INTELLIGENCES.filter((i) => i.group === "gardner");
  const extensions = INTELLIGENCES.filter((i) => i.group === "extension");

  return (
    <div className="space-y-12">
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        }}
      >
        {gardner.map((intel) => (
          <IntelligenceCard
            key={intel.id}
            intel={intel}
            selected={selected.includes(intel.id)}
            onToggle={onToggle}
          />
        ))}
      </div>

      {/* Section divider */}
      <div className="space-y-4">
        <div
          className="h-px w-full"
          style={{ background: "linear-gradient(90deg, transparent, hsla(var(--foreground), 0.08), transparent)" }}
        />
        <div className="flex items-baseline justify-between gap-4">
          <h2
            className="font-serif-display text-[20px]"
            style={{ color: "hsl(var(--text-dim))" }}
          >
            הרחבות
          </h2>
          <span
            className="font-mono-dm text-[10px] tracking-[0.15em] uppercase"
            style={{ color: "hsl(var(--text-dim))", opacity: 0.5 }}
          >
            מחוץ לתיאוריה המקורית
          </span>
        </div>
        <div
          className="h-px w-full"
          style={{ background: "linear-gradient(90deg, transparent, hsla(var(--foreground), 0.08), transparent)" }}
        />
      </div>

      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        }}
      >
        {extensions.map((intel) => (
          <IntelligenceCard
            key={intel.id}
            intel={intel}
            selected={selected.includes(intel.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
};
