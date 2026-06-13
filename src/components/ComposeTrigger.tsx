interface Props {
  count: number;
  onClick: () => void;
}

export const ComposeTrigger = ({ count, onClick }: Props) => {
  let label = "בחר לפחות שתי אינטליגנציות";
  if (count === 1) label = "אינטליגנציה אחת אינה מספיקה לצירוף";
  if (count === 2) label = "גלה את הכישור שנוצר";
  if (count === 3) label = "גלה את המשולש שנוצר";
  if (count >= 4) label = "גלה את הכישור הרב-ממדי";

  const active = count >= 2;

  return (
    <div className="py-14 flex justify-center">
      <button
        type="button"
        onClick={onClick}
        disabled={!active}
        className="group relative font-serif-display text-[28px] md:text-[34px] tracking-tight transition-all duration-300"
        style={{
          color: active ? "hsl(var(--foreground))" : "hsl(var(--text-dim))",
          opacity: active ? 1 : 0.45,
          cursor: active ? "pointer" : "not-allowed",
        }}
      >
        <span className="relative inline-block pb-2">
          {label}
          <span
            className="absolute bottom-0 right-0 left-0 h-[2px] transition-all duration-500 origin-right rounded-full"
            style={{
              background: active
                ? "linear-gradient(90deg, hsla(260, 70%, 60%, 1), hsla(200, 80%, 55%, 1))"
                : "hsl(var(--foreground))",
              transform: active ? "scaleX(1)" : "scaleX(0)",
            }}
          />
        </span>
        <span
          className="block mt-3 font-mono-dm text-[10px] tracking-[0.4em] transition-all"
          style={{
            color: "hsl(var(--text-dim))",
            opacity: active ? 0.6 : 0.3,
          }}
        >
          ↓
        </span>
      </button>
    </div>
  );
};
