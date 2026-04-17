import { useEffect, useMemo, useRef, useState } from "react";
import { BY_ID, lookupCombo, type Combo, type IntelligenceId } from "@/data/intelligences";
import { IntelligenceGrid } from "@/components/IntelligenceGrid";
import { StatusBar } from "@/components/StatusBar";
import { ComposeTrigger } from "@/components/ComposeTrigger";
import { ResultPanel } from "@/components/ResultPanel";

const Index = () => {
  const [selected, setSelected] = useState<IntelligenceId[]>([]);
  const [result, setResult] = useState<Combo | null>(null);
  const [resultIds, setResultIds] = useState<IntelligenceId[]>([]);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const toggle = (id: IntelligenceId) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    setResult(null);
  };

  const clear = () => {
    setSelected([]);
    setResult(null);
  };

  const analyze = () => {
    if (selected.length < 2) return;
    const combo = lookupCombo(selected);
    setResult(combo);
    setResultIds([...selected]);
  };

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  const background = useMemo(() => {
    if (selected.length === 0) return "hsl(var(--background))";
    const colors = selected.map((id) => BY_ID[id].hue);
    if (colors.length === 1)
      return `radial-gradient(ellipse at 50% 0%, hsla(${colors[0]}, 0.12), hsl(var(--background)) 60%)`;
    const stops = colors
      .map((c, i) => `hsla(${c}, 0.10) ${(i / (colors.length - 1)) * 100}%`)
      .join(", ");
    return `linear-gradient(135deg, ${stops}), hsl(var(--background))`;
  }, [selected]);

  return (
    <div
      className="min-h-screen app-bg-transition"
      style={{ background }}
    >
      <StatusBar selected={selected} onClear={clear} />

      <main className="mx-auto max-w-[1400px] px-6 py-16">
        {/* Header */}
        <header className="mb-16">
          <h1 className="font-serif-display text-[44px] md:text-[56px] leading-[1.05] tracking-[-0.02em] text-foreground">
            מפת האינטליגנציות
          </h1>
          <p
            className="mt-4 font-mono-dm text-[12px] tracking-[0.3em] uppercase"
            style={{ color: "hsl(var(--text-dim))" }}
          >
            בחר · שלב · גלה את מה שנוצר
          </p>
          <div
            className="mt-6 h-px w-32"
            style={{
              background:
                selected.length > 0
                  ? `linear-gradient(90deg, ${selected
                      .map((id) => `hsl(${BY_ID[id].hue})`)
                      .join(", ")})`
                  : "hsl(var(--border))",
            }}
          />
        </header>

        <IntelligenceGrid selected={selected} onToggle={toggle} />

        <ComposeTrigger count={selected.length} onClick={analyze} />

        <div ref={resultRef}>
          {result && <ResultPanel combo={result} selectedIds={resultIds} />}
        </div>
      </main>
    </div>
  );
};

export default Index;
