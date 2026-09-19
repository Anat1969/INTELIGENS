import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppNav } from "@/components/AppNav";
import { MagazineArticle } from "@/components/MagazineArticle";
import { Button } from "@/components/ui/button";
import { fetchProfile } from "@/lib/github-store";
import { getProfile, type SavedProfile } from "@/lib/local-profiles";
import { computeScores } from "@/lib/profile-scores";
import { BY_ID } from "@/data/intelligences";
import { getLayers } from "@/lib/synthesize";

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
      <div className="base-article-page min-h-screen">
        <AppNav />
        <main className="pt-28 pb-20 px-5 sm:px-8">
          <p className="mag-body">טוען את הפרופיל...</p>
        </main>
      </div>
    );
  }

  const sorted = computeScores(profile.answers);
  const dominant = BY_ID[sorted[0].intelligence];

  return (
    <div className="base-article-page min-h-screen">
      <AppNav />
      <main className="pt-28 pb-20 px-5 sm:px-8">
        <div className="no-print mag-topbar" style={{ gap: "18px", alignItems: "center" }}>
          <Button type="button" className="tool-btn" onClick={() => window.print()}>
            הורד PDF
          </Button>
          <Link to="/profile" className="mag-body" style={{ textDecoration: "underline" }}>
            חזרה לפרופילים
          </Link>
        </div>

        <MagazineArticle
          title={`פרופיל של ${profile.fillerName}`}
          subtitle={formatDate(profile.date)}
          sourceChain={`האינטליגנציה הדומיננטית: ${dominant.name} · ${sorted[0].percent}%`}
          lead={dominant.description}
          layers={getLayers(sorted[0].intelligence)}
          idPrefix={`profile-${profile.id}`}
          footer={`${profile.fillerName} · ${formatDate(profile.date)}`}
        >
          <section className="mag-section">
            <h2 className="mag-subheading">האינטליגנציה הדומיננטית</h2>
            <p className="mag-body">
              {dominant.name} · {dominant.domain} · {sorted[0].percent}%
            </p>
          </section>

          <section className="mag-section">
            <h2 className="mag-subheading">הפרופיל המלא</h2>
            <ul className="mag-list">
              {sorted.map((s) => (
                <li key={s.intelligence}>
                  {BY_ID[s.intelligence].name} — {s.percent}%
                </li>
              ))}
            </ul>
          </section>
        </MagazineArticle>
      </main>
    </div>
  );
};

export default ProfileReport;
