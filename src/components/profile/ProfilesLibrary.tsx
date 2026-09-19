import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchIndex } from "@/lib/github-store";
import { getProfiles } from "@/lib/local-profiles";

interface Row {
  id: string;
  fillerName: string;
  date: string;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("he-IL");
};

export const ProfilesLibrary = ({ refreshKey = 0 }: { refreshKey?: number }) => {
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setRows(null);
      const index = await fetchIndex();
      const remote: Row[] = index.profiles.map((e) => ({
        id: e.id,
        fillerName: e.fillerName || e.name,
        date: e.date,
      }));
      const local: Row[] = getProfiles().map((p) => ({
        id: p.id,
        fillerName: p.fillerName,
        date: p.date,
      }));
      const byId = new Map<string, Row>();
      [...remote, ...local].forEach((r) => {
        if (!byId.has(r.id)) byId.set(r.id, r);
      });
      const all = Array.from(byId.values()).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      if (alive) setRows(all);
    })();
    return () => {
      alive = false;
    };
  }, [refreshKey]);

  return (
    <section dir="rtl" className="no-print mx-auto max-w-[680px] mt-20 pb-24">
      <div
        className="font-mono-dm text-[10px] tracking-[0.3em] uppercase mb-5"
        style={{ color: "hsl(var(--text-dim))" }}
      >
        ספריית הפרופילים
      </div>

      {rows === null && (
        <p className="text-[16px]" style={{ color: "hsla(var(--foreground), 0.8)" }}>
          טוען פרופילים...
        </p>
      )}

      {rows !== null && rows.length === 0 && (
        <p className="text-[16px]" style={{ color: "hsla(var(--foreground), 0.8)" }}>
          עדיין לא נשמרו פרופילים.
        </p>
      )}

      {rows !== null && rows.length > 0 && (
        <div className="flex flex-col">
          {rows.map((r) => (
            <Link
              key={r.id}
              to={`/profile/${r.id}`}
              className="flex items-center justify-between border-b py-3 transition-opacity hover:opacity-70"
              style={{ borderColor: "hsla(var(--foreground), 0.08)" }}
            >
              <span className="font-sans-he text-[16px] text-foreground">
                {r.fillerName}
              </span>
              <span
                className="font-mono-dm text-[11px] tracking-[0.12em]"
                style={{ color: "hsl(var(--text-dim))" }}
              >
                {formatDate(r.date)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};
