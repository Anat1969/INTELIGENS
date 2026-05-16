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
      style={{ backgroundColor: "hsla(0, 30%, 25%, 0.95)" }}
    >
      <div className="mx-auto max-w-[1400px] px-6 h-[70px] flex items-center gap-8">
        <span
          className="font-mono-dm text-[13px] tracking-[0.2em] shrink-0 font-semibold"
          style={{ color: "#fff" }}
        >
          נבחרו: {String(selected.length).padStart(2, "0")}
        </span>

        <span
          className="flex-1 truncate text-[15px] font-semibold"
          style={{ color: "#fff" }}
        >
          {names || (
            <span style={{ color: "rgba(255,255,255,0.6)" }}>
              עוד לא נבחרה אינטליגנציה
            </span>
          )}
        </span>

        <button
          type="button"
          onClick={onClear}
          disabled={selected.length === 0}
          className="font-mono-dm text-[13px] tracking-[0.2em] px-4 py-2 rounded hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity font-semibold"
          style={{
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.3)",
            background: "rgba(255,255,255,0.1)"
          }}
        >
          נקה
        </button>
      </div>
    </div>
  );
};
