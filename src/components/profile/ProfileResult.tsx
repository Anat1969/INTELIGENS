import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BY_ID,
  type Combo,
  type IntelligenceId,
} from "@/data/intelligences";
import {
  computeScores,
  getProfileCombos,
  readManualSelection,
} from "@/lib/profile-scores";

interface Props {
  answers: (number | null)[];
  /** When provided, used instead of reading sessionStorage. */
  manualSelection?: string[];
  /** Hide the "go to composer" action (e.g. in a saved report). */
  showAction?: boolean;
}

const ComboBlock = ({
  combo,
  ids,
}: {
  combo: Combo;
  ids: IntelligenceId[];
}) => {
  const intels = ids.map((id) => BY_ID[id]);
  const gradient =
    intels.length === 1
      ? `linear-gradient(90deg, transparent, hsl(${intels[0].hue}), transparent)`
      : `linear-gradient(90deg, ${intels.map((i) => `hsl(${i.hue})`).join(", ")})`;

  return (
    <div className="mt-12 pb-4">
      <div
        className="text-center font-mono-dm text-[9px] tracking-[0.2em]"
        style={{ color: "hsl(var(--text-dim))", opacity: 0.6 }}
      >
        נוצר מ: {intels.map((i) => i.name).join(" · ")}
      </div>

      <h3 className="mt-4 font-serif-display text-center text-[34px] md:text-[42px] leading-[1.05] tracking-tight text-foreground">
        {combo.name}
      </h3>
      <p
        className="mt-2 text-center font-mono-dm text-[11px] tracking-[0.3em] uppercase"
        style={{ color: "hsl(var(--text-dim))" }}
      >
        {combo.type}
      </p>

      <div
        className="mx-auto mt-6 h-px w-full max-w-[520px]"
        style={{ background: gradient, opacity: 0.7 }}
      />

      <div className="mt-8 grid gap-8 md:grid-cols-2 mx-auto max-w-[760px]">
        <div>
          <div
            className="font-mono-dm text-[10px] tracking-[0.3em] uppercase mb-2"
            style={{ color: "hsl(var(--text-dim))" }}
          >
            המהות
          </div>
          <p className="text-[15px] leading-[1.9] text-foreground">{combo.essence}</p>
        </div>
        <div>
          <div
            className="font-mono-dm text-[10px] tracking-[0.3em] uppercase mb-2"
            style={{ color: "hsl(var(--text-dim))" }}
          >
            הכוח
          </div>
          <p className="text-[15px] leading-[1.9] text-foreground">{combo.power}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {combo.roles.map((role, idx) => {
          const hue = intels[idx % intels.length].hue;
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

      <blockquote
        className="mt-8 mx-auto max-w-[640px] pr-5"
        style={{
          borderRight: `2px solid hsl(${intels[0].hue})`,
        }}
      >
        <p className="font-serif-display text-[18px] md:text-[20px] leading-[1.5] text-foreground italic">
          {combo.quote}
        </p>
      </blockquote>
    </div>
  );
};

export const ProfileResult = ({
  answers,
  manualSelection: manualProp,
  showAction = true,
}: Props) => {
  const navigate = useNavigate();
  const sorted = useMemo(() => computeScores(answers), [answers]);
  const dominant = sorted[0];
  const dominantIntel = BY_ID[dominant.intelligence];

  // Animate bar widths from 0 to final
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Combos — uses PROFILE_COMBOS (personal voice), distinct from the Map's COMBOS
  const combos = useMemo(() => getProfileCombos(sorted), [sorted]);

  // Comparison with manual selection (prop wins over sessionStorage)
  const manualSelection = useMemo<IntelligenceId[]>(() => {
    if (manualProp) {
      return manualProp.filter((x) => x in BY_ID) as IntelligenceId[];
    }
    return readManualSelection();
  }, [manualProp]);

  const measuredTop = sorted.filter((s) => s.percent >= 65).map((s) => s.intelligence);
  const manualSet = new Set(manualSelection);
  const measuredSet = new Set(measuredTop);

  const showComparison = manualSelection.length > 0;

  // For action button
  const actionTargets = sorted
    .filter((s) => s.percent >= 65)
    .slice(0, 4)
    .map((s) => s.intelligence);

  const handleGoToComposer = () => {
    const list = actionTargets.length >= 2 ? actionTargets : sorted.slice(0, 2).map((s) => s.intelligence);
    navigate(`/?selected=${list.join(",")}`);
  };

  return (
    <section className="result-section mt-16 pb-24">
      {/* DOMINANT CARD */}
      <div
        className="dominant-card mx-auto max-w-[800px] rounded-sm border p-8"
        style={{
          borderColor: `hsl(${dominantIntel.hue})`,
          backgroundColor: `hsla(${dominantIntel.hue}, 0.04)`,
        }}
      >
        <div
          className="font-mono-dm text-[11px] tracking-[0.3em]"
          style={{ color: `hsl(${dominantIntel.hue})` }}
        >
          {dominantIntel.number}
        </div>
        <h2 className="mt-2 font-serif-display text-[34px] md:text-[42px] leading-tight text-foreground">
          {dominantIntel.name}
        </h2>
        <div
          className="mt-1 font-mono-dm text-[10px] tracking-[0.2em] uppercase"
          style={{ color: `hsl(${dominantIntel.hue})` }}
        >
          {dominantIntel.domain}
        </div>
        <p
          className="mt-4 text-[16px] leading-[1.85]"
          style={{ color: "hsla(var(--foreground), 0.85)" }}
        >
          {dominantIntel.description}
        </p>
        <div className="mt-6 flex items-center gap-3">
          <div
            className="h-[6px] flex-1 overflow-hidden rounded-sm"
            style={{ backgroundColor: "hsl(var(--border))" }}
          >
            <div
              className="h-full transition-[width] duration-700 ease-out"
              style={{
                width: animate ? `${dominant.percent}%` : "0%",
                background: `hsl(${dominantIntel.hue})`,
              }}
            />
          </div>
          <span
            className="font-mono-dm text-[12px] tracking-[0.15em]"
            style={{ color: "hsl(var(--foreground))" }}
          >
            {dominant.percent}%
          </span>
        </div>
      </div>

      {/* BAR CHART */}
      <div className="bar-chart mx-auto max-w-[800px] mt-16">
        <div
          className="font-mono-dm text-[10px] tracking-[0.3em] uppercase mb-5 text-center"
          style={{ color: "hsl(var(--text-dim))" }}
        >
          הפרופיל המלא
        </div>
        <div className="flex flex-col gap-[10px]">
          {sorted.map((s, i) => {
            const intel = BY_ID[s.intelligence];
            return (
              <div key={s.intelligence} className="flex items-center gap-3">
                <span
                  className="font-sans-he text-[14px] min-w-[140px] text-right"
                  style={{ color: "hsla(var(--foreground), 0.85)" }}
                >
                  {intel.name}
                </span>
                <div
                  className="flex-1 h-[4px] rounded-sm overflow-hidden"
                  style={{ backgroundColor: "hsl(var(--border))" }}
                >
                  <div
                    className="h-full rounded-sm"
                    style={{
                      width: animate ? `${s.percent}%` : "0%",
                      background: `hsl(${s.hue})`,
                      transition: `width 800ms cubic-bezier(0.16, 1, 0.3, 1) ${100 + i * 80}ms`,
                    }}
                  />
                </div>
                <span
                  className="font-mono-dm text-[12px] min-w-[36px] text-left"
                  style={{ color: "hsla(var(--foreground), 0.8)" }}
                >
                  {s.percent}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* COMBINATIONS */}
      <div className="combos mx-auto max-w-[800px] mt-16">
        <div
          className="font-mono-dm text-[10px] tracking-[0.3em] uppercase mb-2 text-center"
          style={{ color: "hsl(var(--text-dim))" }}
        >
          השילובים שלך
        </div>
        {combos.map((c, i) => (
          <ComboBlock key={i} combo={c.combo} ids={c.ids} />
        ))}
      </div>

      {/* COMPARISON */}
      {showComparison && (
        <div className="comparison mx-auto max-w-[800px] mt-16">
          <div
            className="font-mono-dm text-[10px] tracking-[0.2em] uppercase mb-6 text-center"
            style={{ color: "hsl(var(--text-dim))" }}
          >
            בחרת לעומת מה שנמדד
          </div>

          <div className="grid grid-cols-2 gap-6 mx-auto max-w-[640px]">
            <div>
              <div
                className="font-mono-dm text-[10px] tracking-[0.2em] mb-3 text-right"
                style={{ color: "hsl(var(--text-dim))" }}
              >
                בחרת
              </div>
              <div className="flex flex-col gap-2">
                {manualSelection.map((id) => {
                  const intel = BY_ID[id];
                  const measuredHigh = measuredSet.has(id);
                  const indicator = measuredHigh ? "✓" : "↓";
                  const color = measuredHigh
                    ? "hsl(var(--text-dim))"
                    : "hsl(22, 80%, 55%)";
                  return (
                    <div
                      key={id}
                      className="flex items-center gap-2 text-right justify-end"
                    >
                      <span
                        className="font-sans-he text-[13px]"
                        style={{ color: "hsl(var(--foreground))" }}
                      >
                        {intel.name}
                      </span>
                      <span
                        className="font-mono-dm text-[12px] inline-block w-3 text-center"
                        style={{ color }}
                      >
                        {indicator}
                      </span>
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ backgroundColor: `hsl(${intel.hue})` }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div
                className="font-mono-dm text-[10px] tracking-[0.2em] mb-3 text-right"
                style={{ color: "hsl(var(--text-dim))" }}
              >
                נמדד
              </div>
              <div className="flex flex-col gap-2">
                {sorted.slice(0, Math.max(3, manualSelection.length)).map((s) => {
                  const intel = BY_ID[s.intelligence];
                  const inManual = manualSet.has(s.intelligence);
                  const indicator = inManual ? "✓" : "↑";
                  const color = inManual
                    ? "hsl(var(--text-dim))"
                    : "hsl(148, 60%, 42%)";
                  return (
                    <div
                      key={s.intelligence}
                      className="flex items-center gap-2 text-right justify-end"
                    >
                      <span
                        className="font-sans-he text-[13px]"
                        style={{ color: "hsl(var(--foreground))" }}
                      >
                        {intel.name}
                      </span>
                      <span
                        className="font-mono-dm text-[12px] inline-block w-3 text-center"
                        style={{ color }}
                      >
                        {indicator}
                      </span>
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ backgroundColor: `hsl(${intel.hue})` }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {(() => {
            const missed = sorted.find(
              (s) => s.percent >= 65 && !manualSet.has(s.intelligence),
            );
            if (!missed) return null;
            return (
              <div
                className="mt-6 text-center font-mono-dm text-[11px] tracking-[0.15em]"
                style={{ color: "hsl(var(--text-dim))" }}
              >
                האינטליגנציה הגבוהה שלא בחרת: {BY_ID[missed.intelligence].name}
              </div>
            );
          })()}
        </div>
      )}

      {/* ACTION */}
      {showAction && (
        <div className="action mt-16 flex justify-center">
          <button
            type="button"
            onClick={handleGoToComposer}
            className="font-serif-display text-[22px] md:text-[26px] tracking-tight pb-2 border-b border-foreground transition-opacity hover:opacity-80"
            style={{ color: "hsl(var(--foreground))" }}
          >
            עבור לדף הצירופים עם הנבחרים שלך
          </button>
        </div>
      )}
    </section>
  );
};
