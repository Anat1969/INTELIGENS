import { useState } from "react";
import { Link } from "react-router-dom";
import { addProfile, type SavedProfile } from "@/lib/local-profiles";
import { hasToken } from "@/lib/gh-token";
import { saveProfile } from "@/lib/github-store";
import { readManualSelection } from "@/lib/profile-scores";

interface Props {
  answers: (number | null)[];
  onSaved?: (profile: SavedProfile) => void;
}

const slug = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

const ymd = (d: Date) =>
  `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
    d.getDate(),
  ).padStart(2, "0")}`;

type Status = "idle" | "saving" | "saved" | "local" | "error";

export const SaveProfileBlock = ({ answers, onSaved }: Props) => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [savedId, setSavedId] = useState<string | null>(null);

  const handleSave = async () => {
    const fillerName = name.trim();
    if (!fillerName) return;
    const now = new Date();
    const rand4 = Math.random().toString(36).slice(2, 6);
    const id = `${slug(fillerName) || "profile"}-${ymd(now)}-${rand4}`;
    const manualSelection = readManualSelection();
    const profile: SavedProfile = {
      id,
      fillerName,
      date: now.toISOString(),
      answers,
      ...(manualSelection.length ? { manualSelection } : {}),
      created_at: now.toISOString(),
    };

    addProfile(profile);
    setSavedId(id);
    onSaved?.(profile);

    if (!hasToken()) {
      setStatus("local");
      return;
    }

    setStatus("saving");
    setError("");
    try {
      await saveProfile({
        id,
        name: `פרופיל של ${fillerName}`,
        fillerName,
        date: profile.date,
        answers,
        ...(manualSelection.length ? { manualSelection } : {}),
      });
      setStatus("saved");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "השמירה למאגר נכשלה.");
    }
  };

  return (
    <section dir="rtl" className="no-print mx-auto max-w-[680px] mt-16">
      <div
        className="rounded-sm border p-6"
        style={{ borderColor: "hsla(var(--foreground), 0.12)" }}
      >
        <div
          className="font-mono-dm text-[10px] tracking-[0.3em] uppercase mb-4"
          style={{ color: "hsl(var(--text-dim))" }}
        >
          שמירת הפרופיל
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="שם פרטי"
            className="flex-1 rounded-sm border bg-transparent px-3 py-2 text-[14px] text-foreground outline-none"
            style={{ borderColor: "hsla(var(--foreground), 0.18)" }}
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={!name.trim() || status === "saving"}
            className="tool-btn"
          >
            שמור פרופיל
          </button>
        </div>

        {status === "saving" && (
          <p className="mt-4 text-[13px]" style={{ color: "hsl(var(--text-dim))" }}>
            שומר...
          </p>
        )}
        {status === "saved" && (
          <p className="mt-4 text-[13px]" style={{ color: "hsl(var(--foreground))" }}>
            הפרופיל נשמר
          </p>
        )}
        {status === "local" && (
          <p className="mt-4 text-[13px]" style={{ color: "hsl(var(--text-dim))" }}>
            מצב קריאה בלבד — הפרופיל נשמר במחשב זה בלבד ולא למאגר הציבורי. להזנת
            טוקן:{" "}
            <Link to="/settings" className="underline" style={{ color: "hsl(var(--foreground))" }}>
              הגדרות
            </Link>
          </p>
        )}
        {status === "error" && (
          <p className="mt-4 text-[13px]" style={{ color: "hsl(22, 80%, 55%)" }}>
            שמירת הפרופיל למאגר נכשלה. {error}
          </p>
        )}

        {savedId && (
          <p className="mt-3 text-[13px]">
            <Link
              to={`/profile/${savedId}`}
              className="underline hover:opacity-80"
              style={{ color: "hsl(var(--foreground))" }}
            >
              פתח את דוח הפרופיל
            </Link>
          </p>
        )}
      </div>
    </section>
  );
};
