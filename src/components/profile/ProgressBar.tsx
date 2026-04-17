import { BY_ID, type IntelligenceId } from "@/data/intelligences";

interface Props {
  current: number; // 0-based current question index
  total: number;
  answeredHues: IntelligenceId[]; // intelligence id for each answered question, in order
}

export const ProgressBar = ({ current, total, answeredHues }: Props) => {
  const answered = answeredHues.length;
  const pct = Math.round((answered / total) * 100);

  const fill =
    answeredHues.length === 0
      ? "hsl(var(--text-dim))"
      : answeredHues.length === 1
        ? `hsl(${BY_ID[answeredHues[0]].hue})`
        : `linear-gradient(90deg, ${answeredHues
            .map((id) => `hsl(${BY_ID[id].hue})`)
            .join(", ")})`;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span
          className="font-mono-dm text-[11px] tracking-[0.15em]"
          style={{ color: "hsl(var(--text-dim))" }}
        >
          שאלה {Math.min(current + 1, total)} מתוך {total}
        </span>
        <span
          className="font-mono-dm text-[11px] tracking-[0.15em]"
          style={{ color: "hsl(var(--text-dim))" }}
        >
          {pct}%
        </span>
      </div>
      <div
        className="h-[2px] w-full overflow-hidden rounded-sm"
        style={{ backgroundColor: "hsl(var(--border))" }}
      >
        <div
          className="h-full transition-[width] duration-300"
          style={{ width: `${pct}%`, background: fill }}
        />
      </div>
    </div>
  );
};
