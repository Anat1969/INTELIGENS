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
    <section className="result-panel mt-8 pb-24">
      {/* Combo display row */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 justify-center">
        {intels.map((i, idx) => (
          <span key={i.id} className="flex items-center gap-3">
            <span
              className="font-mono-dm text-[11px] tracking-[0.2em] px-3 py-1 rounded-lg"
              style={{
                color: `hsl(${i.hue})`,
                background: `hsla(${i.hue}, 0.08)`,
                border: `1px solid hsla(${i.hue}, 0.15)`,
              }}
            >
              {i.number} · {i.name}
            </span>
            {idx < intels.length - 1 && (
              <span
                className="font-mono-dm text-[14px]"
                style={{ color: "hsl(var(--text-dim))", opacity: 0.4 }}
              >
                +
              </span>
            )}
          </span>
        ))}
      </div>

      {/* Gradient divider */}
      <div
        className="mx-auto mt-10 h-[2px] w-full max-w-[640px] reveal-1 rounded-full"
        style={{ background: gradient, opacity: 0.6 }}
      />

      {/* Skill name */}
      <h2 className="reveal-1 mt-12 font-serif-display text-center text-[44px] md:text-[56px] leading-[1.05] tracking-tight text-foreground">
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
          className="reveal-2 mt-4 text-center font-mono-dm text-[10px] tracking-[0.1em] px-4 py-2 rounded-lg mx-auto w-fit"
          style={{
            color: "hsl(var(--text-dim))",
            background: "hsla(var(--foreground), 0.03)",
          }}
        >
          צירוף זה כולל אינטליגנציה שאינה חלק מהתיאוריה המקורית של גארדנר
        </p>
      )}

      {/* Body — two columns */}
      <div className="reveal-3 mt-14 grid gap-10 md:grid-cols-2 mx-auto max-w-[960px]">
        <div className="glass-card p-6 rounded-2xl">
          <div
            className="font-mono-dm text-[10px] tracking-[0.2em] uppercase mb-4"
            style={{ color: "hsla(260, 70%, 65%, 0.7)" }}
          >
            המהות
          </div>
          <p className="text-[15px] leading-[1.85] text-foreground">
            {combo.essence}
          </p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <div
            className="font-mono-dm text-[10px] tracking-[0.2em] uppercase mb-4"
            style={{ color: "hsla(200, 80%, 60%, 0.7)" }}
          >
            הכוח
          </div>
          <p className="text-[15px] leading-[1.85] text-foreground">
            {combo.power}
          </p>
        </div>
      </div>

      {/* Roles */}
      <div className="reveal-4 mt-14 mx-auto max-w-[960px]">
        <div
          className="font-mono-dm text-[10px] tracking-[0.2em] uppercase mb-5 text-center"
          style={{ color: "hsl(var(--text-dim))" }}
        >
          תפקידים
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {combo.roles.map((role, idx) => {
            const hue = intels[idx % intels.length]?.hue ?? "240, 14%, 47%";
            return (
              <span
                key={role}
                className="px-4 py-2 text-[12px] font-sans-he rounded-xl"
                style={{
                  border: `1px solid hsla(${hue}, 0.2)`,
                  color: "hsl(var(--foreground))",
                  backgroundColor: `hsla(${hue}, 0.06)`,
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
        className="reveal-5 mt-14 mx-auto max-w-[760px] p-6 rounded-2xl"
        style={{
          background: "hsla(var(--surface), 0.4)",
          borderRight: `3px solid transparent`,
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
