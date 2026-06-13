import { BY_ID, type IntelligenceId } from "@/data/intelligences";
import { X } from "lucide-react";

interface Props {
  selected: IntelligenceId[];
  onClear: () => void;
}

export const StatusBar = ({ selected, onClear }: Props) => {
  return (
    <div
      className="fixed top-[64px] left-0 right-0 z-40 status-bar-glass transition-all duration-300"
      style={{
        backgroundColor: selected.length > 0
          ? "hsla(var(--background), 0.85)"
          : "hsla(var(--background), 0.7)",
      }}
    >
      <div className="mx-auto max-w-[1400px] px-6 h-[56px] flex items-center gap-4">
        <span
          className="font-mono-dm text-[12px] tracking-[0.2em] shrink-0"
          style={{ color: "hsl(var(--text-dim))" }}
        >
          נבחרו: <span style={{ color: "hsl(var(--foreground))" }}>{String(selected.length).padStart(2, "0")}</span>
        </span>

        <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {selected.map((id) => {
            const intel = BY_ID[id];
            return (
              <span
                key={id}
                className="shrink-0 font-mono-dm text-[10px] tracking-[0.1em] px-3 py-1.5 rounded-lg"
                style={{
                  background: `hsla(${intel.hue}, 0.1)`,
                  color: `hsl(${intel.hue})`,
                  border: `1px solid hsla(${intel.hue}, 0.2)`,
                }}
              >
                {intel.name}
              </span>
            );
          })}
          {selected.length === 0 && (
            <span
              className="font-mono-dm text-[11px] tracking-[0.1em]"
              style={{ color: "hsl(var(--text-dim))", opacity: 0.5 }}
            >
              בחר אינטליגנציות מהמפה
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onClear}
          disabled={selected.length === 0}
          className="shrink-0 p-2 rounded-lg transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed hover:opacity-70"
          style={{
            color: "hsl(var(--text-dim))",
            background: "hsla(var(--foreground), 0.05)",
          }}
          aria-label="נקה בחירה"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
