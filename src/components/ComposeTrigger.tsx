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
    <div className="py-12 flex justify-center">
      <button
        type="button"
        onClick={onClick}
        disabled={!active}
        className="group font-serif-display text-[28px] md:text-[34px] tracking-tight transition-all duration-300"
        style={{
          color: active ? "hsl(var(--foreground))" : "hsl(var(--text-dim))",
          opacity: active ? 1 : 0.55,
          cursor: active ? "pointer" : "not-allowed",
        }}
      >
        <span className="relative inline-block pb-2">
          {label}
          <span
            className="absolute bottom-0 right-0 left-0 h-px transition-transform origin-right duration-500"
            style={{
              backgroundColor: "hsl(var(--foreground))",
              transform: active ? "scaleX(1)" : "scaleX(0)",
            }}
          />
        </span>
        <span className="block mt-2 font-mono-dm text-[10px] tracking-[0.4em] opacity-60">
          ↓
        </span>
      </button>
    </div>
  );
};
