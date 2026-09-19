import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppNav } from "@/components/AppNav";
import { ProfileResult } from "@/components/profile/ProfileResult";
import { PrintButton } from "@/components/print/PrintButton";
import { PrintableArticle } from "@/components/print/PrintableArticle";
import { fetchProfile } from "@/lib/github-store";
import { getProfile, type SavedProfile } from "@/lib/local-profiles";
import { computeScores, getProfileCombos } from "@/lib/profile-scores";
import { BY_ID } from "@/data/intelligences";
import { LivingSpaceBlock } from "@/components/LivingSpaceBlock";
import { baseVisualPrompt } from "@/lib/synthesize";
import { resolvePrintImage } from "@/lib/living-image";

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("he-IL");
};

const isValid = (p: unknown): p is SavedProfile => {
  if (!p || typeof p !== "object") return false;
  const o = p as Record<string, unknown>;
  return typeof o.id === "string" && Array.isArray(o.answers);
};

const ProfileReport = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<SavedProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [printImage, setPrintImage] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    if (!id) return;
    resolvePrintImage(`profile-${id}`).then((found) => {
      if (alive) setPrintImage(found);
    });
    return () => {
      alive = false;
    };
  }, [id]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const remote = await fetchProfile(id);
      let found: SavedProfile | null = isValid(remote)
        ? {
            ...remote,
            fillerName: remote.fillerName || "ללא שם",
            date: remote.date || remote.created_at || "",
            created_at: remote.created_at || remote.date || "",
          }
        : null;
      if (!found) found = getProfile(id);
      if (!alive) return;
      if (!found) {
        navigate("/profile", { replace: true });
        return;
      }
      setProfile(found);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [id, navigate]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
        <AppNav />
        <main className="mx-auto max-w-[1400px] px-6 py-32">
          <p className="text-[13px]" style={{ color: "hsl(var(--text-dim))" }}>
            טוען את הפרופיל...
          </p>
        </main>
      </div>
    );
  }

  const sorted = computeScores(profile.answers);
  const combos = getProfileCombos(sorted);
  const dominant = BY_ID[sorted[0].intelligence];

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      <AppNav />

      <main dir="rtl" className="mx-auto max-w-[1400px] px-6 py-12">
        <header className="mx-auto max-w-[800px] mb-8">
          <h1 className="font-serif-display text-[34px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-foreground">
            פרופיל של {profile.fillerName} · {formatDate(profile.date)}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-6">
            <PrintButton />
            <Link
              to="/profile"
              className="no-print font-mono-dm text-[11px] tracking-[0.2em] hover:opacity-80"
              style={{ color: "hsl(var(--text-dim))" }}
            >
              חזרה לפרופילים
            </Link>
          </div>
        </header>

        <ProfileResult
          answers={profile.answers}
          manualSelection={profile.manualSelection}
          showAction={false}
        />

        <div className="mx-auto max-w-[800px] mt-12">
          <LivingSpaceBlock
            id={`profile-${profile.id}`}
            visualPrompt={baseVisualPrompt(sorted[0].intelligence)}
            onImage={() => {
              resolvePrintImage(`profile-${profile.id}`).then(setPrintImage);
            }}
          />
        </div>
      </main>

      <PrintableArticle>
        <h1>פרופיל של {profile.fillerName}</h1>
        <p className="print-sub">{formatDate(profile.date)}</p>
        <p className="print-meta">
          האינטליגנציה הדומיננטית: {dominant.name} · {dominant.domain} ·{" "}
          {sorted[0].percent}%
        </p>

        <h2>הפרופיל המלא</h2>
        <ul>
          {sorted.map((s) => (
            <li key={s.intelligence}>
              {BY_ID[s.intelligence].name} — {s.percent}%
            </li>
          ))}
        </ul>

        <h2>השילובים שלך</h2>
        {combos.map((c, i) => (
          <div className="print-combo" key={i}>
            <strong>{c.combo.name}</strong> · {c.combo.type}
            <p>{c.combo.essence}</p>
          </div>
        ))}
        {printImage && (
          <img className="print-img" src={printImage} alt={profile.fillerName} />
        )}
      </PrintableArticle>
    </div>
  );
};

export default ProfileReport;
