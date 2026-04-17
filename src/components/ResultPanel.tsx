import { BY_ID, type Combo, type IntelligenceId } from "@/data/intelligences";

interface Props {
  combo: Combo;
  selectedIds: IntelligenceId[];
}

export const ResultPanel = ({ combo, selectedIds }: Props) => {
  const intels = selectedIds.map((id) => BY_ID[id]);
  const hasExtension = intels.some((i) => i.group === "extension");

  const gradient =
    intels.length === 1
      ? `linear-gradient(90deg, transparent, hsl(${intels[0].hue}), transparent)`
      : `linear-gradient(90deg, ${intels
          .map((i) => `hsl(${i.hue})`)
          .join(", ")})`;

  return (
    <section className="result-panel mt-4 pb-24">
      {/* Combo display row */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 justify-center">
        {intels.map((i, idx) => (
          <span key={i.id} className="flex items-center gap-3">
            <span
              className="font-mono-dm text-[11px] tracking-[0.25em]"
              style={{ color: `hsl(${i.hue})` }}
            >
              {i.number} · {i.name}
            </span>
            {idx < intels.length - 1 && (
              <span
                className="font-mono-dm text-[14px]"
                style={{ color: "hsl(var(--text-dim))", opacity: 0.5 }}
              >
                +
              </span>
            )}
          </span>
        ))}
      </div>

      {/* Gradient divider */}
      <div
        className="mx-auto mt-8 h-px w-full max-w-[640px] reveal-1"
        style={{ background: gradient, opacity: 0.7 }}
      />

      {/* Skill name */}
      <h2 className="reveal-1 mt-10 font-serif-display text-center text-[44px] md:text-[56px] leading-[1.05] tracking-tight text-foreground">
        {combo.name}
      </h2>

      <p
        className="reveal-2 mt-3 text-center font-mono-dm text-[11px] tracking-[0.3em] uppercase"
        style={{ color: "hsl(var(--text-dim))" }}
      >
        {combo.type}
      </p>

      {hasExtension && (
        <p
          className="reveal-2 mt-4 text-center font-mono-dm text-[10px] tracking-[0.15em]"
          style={{ color: "hsl(var(--text-dim))", opacity: 0.6 }}
        >
          צירוף זה כולל אינטליגנציה שאינה חלק מהתיאוריה המקורית של גארדנר
        </p>
      )}

      {/* Body — two columns */}
      <div className="reveal-3 mt-12 grid gap-10 md:grid-cols-2 mx-auto max-w-[960px]">
        <div>
          <div
            className="font-mono-dm text-[10px] tracking-[0.3em] uppercase mb-3"
            style={{ color: "hsl(var(--text-dim))" }}
          >
            המהות
          </div>
          <p className="text-[15px] leading-[1.85] text-foreground">
            {combo.essence}
          </p>
        </div>
        <div>
          <div
            className="font-mono-dm text-[10px] tracking-[0.3em] uppercase mb-3"
            style={{ color: "hsl(var(--text-dim))" }}
          >
            הכוח
          </div>
          <p className="text-[15px] leading-[1.85] text-foreground">
            {combo.power}
          </p>
        </div>
      </div>

      {/* Roles */}
      <div className="reveal-4 mt-12 mx-auto max-w-[960px]">
        <div
          className="font-mono-dm text-[10px] tracking-[0.3em] uppercase mb-4 text-center"
          style={{ color: "hsl(var(--text-dim))" }}
        >
          תפקידים
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {combo.roles.map((role, idx) => {
            const hue = intels[idx % intels.length]?.hue ?? "240, 14%, 47%";
            return (
              <span
                key={role}
                className="px-3 py-1.5 text-[12px] font-sans-he border rounded-sm"
                style={{
                  borderColor: `hsla(${hue}, 0.5)`,
                  color: "hsl(var(--foreground))",
                  backgroundColor: `hsla(${hue}, 0.04)`,
                }}
              >
                {role}
              </span>
            );
          })}
        </div>
      </div>

      {/* Quote */}
      <blockquote
        className="reveal-5 mt-14 mx-auto max-w-[760px] pr-6"
        style={{
          borderRight: `2px solid transparent`,
          borderImage: `${gradient} 1`,
          borderImageSlice: 1,
        }}
      >
        <p className="font-serif-display text-[22px] md:text-[26px] leading-[1.4] text-foreground italic">
          {combo.quote}
        </p>
      </blockquote>
    </section>
  );
};
