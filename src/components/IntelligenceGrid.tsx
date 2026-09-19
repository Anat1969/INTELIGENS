import { useNavigate } from "react-router-dom";
import { INTELLIGENCES, type IntelligenceId } from "@/data/intelligences";
import { IntelligenceCard } from "./IntelligenceCard";

interface Props {
  selected: IntelligenceId[];
  onToggle: (id: IntelligenceId) => void;
}

export const IntelligenceGrid = ({ selected, onToggle }: Props) => {
  const navigate = useNavigate();
  const gardner = INTELLIGENCES.filter((i) => i.group === "gardner");
  const extensions = INTELLIGENCES.filter((i) => i.group === "extension");

  return (
    <div className="space-y-10">
      {/* Gardner intelligences — stacked rows, 2 columns on wide screens */}
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: "1fr",
        }}
      >
        {gardner.map((intel) => (
          <IntelligenceCard
            key={intel.id}
            intel={intel}
            selected={selected.includes(intel.id)}
            onToggle={onToggle}
            onOpenArticle={(id) => navigate(`/intelligence/base/${id}`)}
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

      {/* Extensions — same row layout */}
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: "1fr",
        }}
      >
        {extensions.map((intel) => (
          <IntelligenceCard
            key={intel.id}
            intel={intel}
            selected={selected.includes(intel.id)}
            onToggle={onToggle}
            onOpenArticle={(id) => navigate(`/intelligence/base/${id}`)}
          />
        ))}
      </div>
    </div>
  );
};
