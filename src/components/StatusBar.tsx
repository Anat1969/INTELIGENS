import { BY_ID, type IntelligenceId } from "@/data/intelligences";

interface Props {
  selected: IntelligenceId[];
  onClear: () => void;
}

export const StatusBar = ({ selected, onClear }: Props) => {
  const names = selected.map((id) => BY_ID[id].name).join(" · ");

  return (
    <div
      className="sticky top-0 z-30 backdrop-blur-md border-b border-border"
      style={{ backgroundColor: "hsla(240, 33%, 5%, 0.85)" }}
    >
      <div className="mx-auto max-w-[1400px] px-6 h-[60px] flex items-center gap-6">
        <span
          className="font-mono-dm text-[11px] tracking-[0.2em] shrink-0"
          style={{ color: "hsl(var(--text-dim))" }}
        >
          נבחרו: {String(selected.length).padStart(2, "0")}
        </span>

        <span
          className="flex-1 truncate text-[13px]"
          style={{ color: "hsl(var(--foreground))" }}
        >
          {names || (
            <span style={{ color: "hsl(var(--text-dim))", opacity: 0.6 }}>
              עוד לא נבחרה אינטליגנציה
            </span>
          )}
        </span>

        <button
          type="button"
          onClick={onClear}
          disabled={selected.length === 0}
          className="font-mono-dm text-[11px] tracking-[0.2em] underline-offset-4 hover:underline disabled:opacity-30 disabled:no-underline transition-opacity"
          style={{ color: "hsl(var(--text-dim))" }}
        >
          נקה
        </button>
      </div>
    </div>
  );
};
