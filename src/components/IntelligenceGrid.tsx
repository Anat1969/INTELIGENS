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
    <div className="space-y-10">
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
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
      <div className="space-y-3">
        <div className="h-px w-full bg-border" />
        <div className="flex items-baseline justify-between gap-4">
          <h2
            className="font-serif-display text-[18px]"
            style={{ color: "hsl(var(--text-dim))" }}
          >
            הרחבות
          </h2>
          <span
            className="font-mono-dm text-[10px] tracking-[0.2em] uppercase"
            style={{ color: "hsl(var(--text-dim))", opacity: 0.6 }}
          >
            שנויות במחלוקת — מחוץ לתיאוריה המקורית
          </span>
        </div>
        <div className="h-px w-full bg-border" />
      </div>

      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
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
