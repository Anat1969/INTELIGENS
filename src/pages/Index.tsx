import { useEffect, useMemo, useRef, useState } from "react";
import { BY_ID, type IntelligenceId } from "@/data/intelligences";
import { IntelligenceGrid } from "@/components/IntelligenceGrid";
import { StatusBar } from "@/components/StatusBar";
import { AppNav } from "@/components/AppNav";
import SynthesisButton from "@/components/SynthesisButton";
import SynthesisLibrary from "@/components/SynthesisLibrary";

const Index = () => {
  const [selected, setSelected] = useState<IntelligenceId[]>([]);
  const [libraryRefresh, setLibraryRefresh] = useState(0);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const toggle = (id: IntelligenceId) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const clear = () => {
    setSelected([]);
  };

  useEffect(() => {
    try {
      sessionStorage.setItem("manualSelection", JSON.stringify(selected));
    } catch {
      // ignore
    }
  }, [selected]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("selected");
    if (!raw) return;
    const ids = raw
      .split(",")
      .map((s) => s.trim())
      .filter((s): s is IntelligenceId => s in BY_ID) as IntelligenceId[];
    if (ids.length >= 1) {
      setSelected(ids);
    }
  }, []);

  const background = useMemo(() => {
    if (selected.length === 0)
      return "radial-gradient(ellipse 80% 50% at 50% 0%, hsla(260, 60%, 30%, 0.06), hsl(var(--background)))";
    const colors = selected.map((id) => BY_ID[id].hue);
    if (colors.length === 1)
      return `radial-gradient(ellipse at 50% 0%, hsla(${colors[0]}, 0.12), hsl(var(--background)) 60%)`;
    const stops = colors
      .map((c, i) => `hsla(${c}, 0.08) ${(i / (colors.length - 1)) * 100}%`)
      .join(", ");
    return `linear-gradient(135deg, ${stops}), radial-gradient(ellipse at 50% 0%, hsla(260, 60%, 30%, 0.05), transparent), hsl(var(--background))`;
  }, [selected]);

  return (
    <div
      className="min-h-screen app-bg-transition"
      style={{ background }}
    >
      <AppNav />
      <StatusBar selected={selected} onClear={clear} />

      <main className="mx-auto max-w-[1400px] px-6 pt-36 pb-20">
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
            className="mt-6 h-[2px] w-32 rounded-full"
            style={{
              background:
                selected.length > 0
                  ? `linear-gradient(90deg, ${selected
                      .map((id) => `hsl(${BY_ID[id].hue})`)
                      .join(", ")})`
                  : "linear-gradient(90deg, hsla(260, 70%, 60%, 0.3), hsla(200, 80%, 55%, 0.3))",
            }}
          />
        </header>

        <IntelligenceGrid selected={selected} onToggle={toggle} />

        <div ref={resultRef} className="mt-8">
          <SynthesisButton
            selected={selected.map((id) => ({
              id,
              name: BY_ID[id].name,
              domain: BY_ID[id].domain,
              description: BY_ID[id].description,
            }))}
            onNewSynthesis={() => setLibraryRefresh(n => n + 1)}
          />
        </div>

        <SynthesisLibrary refreshKey={libraryRefresh} />
      </main>
    </div>
  );
};

export default Index;
