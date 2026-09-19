import { API_BASE, DATA_BRANCH, RAW_BASE } from "./repo-config";
import { getToken } from "./gh-token";

export type IndexEntry = {
  id: string;
  name: string;
  combo?: string;
  parent?: string;
  fillerName?: string;
  date: string;
  path: string;
  imagePath?: string;
};

export type Index = {
  version: number;
  updatedAt: string;
  merges: IndexEntry[];
  profiles: IndexEntry[];
  images: string[];
};

const emptyIndex = (): Index => ({
  version: 1,
  updatedAt: "",
  merges: [],
  profiles: [],
  images: [],
});

const bust = (url: string) => `${url}?t=${Date.now()}`;

/* ---------- READ (public, no token) ---------- */

export async function fetchIndex(): Promise<Index> {
  try {
    const res = await fetch(bust(`${RAW_BASE}/data/index.json`), { cache: "no-store" });
    if (!res.ok) return emptyIndex();
    const json = (await res.json()) as Partial<Index>;
    return { ...emptyIndex(), ...json } as Index;
  } catch {
    return emptyIndex();
  }
}

async function fetchJson(path: string): Promise<unknown | null> {
  try {
    const res = await fetch(bust(`${RAW_BASE}/${path}`), { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export function fetchMerge(id: string): Promise<unknown | null> {
  return fetchJson(`data/library/merges/${id}.json`);
}

export function fetchProfile(id: string): Promise<unknown | null> {
  return fetchJson(`data/library/profiles/${id}.json`);
}

export function imageUrl(id: string): string {
  return `${RAW_BASE}/data/images/${id}.png`;
}

/* ---------- helpers ---------- */

export function toBase64Utf8(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

function requireToken(): string {
  const token = getToken();
  if (!token) {
    throw new Error("לא הוזן טוקן. יש להזין טוקן בעמוד ההגדרות כדי לשמור נתונים.");
  }
  return token;
}

function ghHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };
}

async function getSha(path: string, token: string): Promise<string | undefined> {
  const res = await fetch(`${API_BASE}/contents/${path}?ref=${DATA_BRANCH}`, {
    headers: ghHeaders(token),
    cache: "no-store",
  });
  if (res.status === 404) return undefined;
  if (!res.ok) {
    throw new Error(`שגיאה בקריאת הקובץ מהמאגר (${res.status})`);
  }
  const json = (await res.json()) as { sha?: string };
  return json.sha;
}

async function putFile(path: string, contentBase64: string, message: string): Promise<void> {
  const token = requireToken();
  const sha = await getSha(path, token);
  const res = await fetch(`${API_BASE}/contents/${path}`, {
    method: "PUT",
    headers: ghHeaders(token),
    body: JSON.stringify({ message, content: contentBase64, branch: DATA_BRANCH, ...(sha ? { sha } : {}) }),
  });
  if (!res.ok) {
    const details = await res.text();
    throw new Error(`שמירה נכשלה (${res.status}): ${details}`);
  }
}

async function fetchIndexViaApi(token: string): Promise<{ index: Index; sha?: string }> {
  const res = await fetch(`${API_BASE}/contents/data/index.json?ref=${DATA_BRANCH}`, {
    headers: ghHeaders(token),
    cache: "no-store",
  });
  if (res.status === 404) return { index: emptyIndex() };
  if (!res.ok) throw new Error(`שגיאה בקריאת האינדקס (${res.status})`);
  const json = (await res.json()) as { sha?: string; content?: string };
  let index = emptyIndex();
  try {
    if (json.content) {
      const binary = atob(json.content.replace(/\n/g, ""));
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
      index = { ...emptyIndex(), ...JSON.parse(new TextDecoder().decode(bytes)) };
    }
  } catch {
    index = emptyIndex();
  }
  return { index, sha: json.sha };
}

type IndexKind = "merges" | "profiles";

function upsert(list: IndexEntry[], entry: IndexEntry): IndexEntry[] {
  const next = list.filter((e) => e.id !== entry.id);
  next.push(entry);
  return next;
}

async function updateIndex(
  mutate: (index: Index) => Index,
  message: string,
): Promise<void> {
  const token = requireToken();
  const { index, sha } = await fetchIndexViaApi(token);
  const next = mutate({ ...index });
  next.updatedAt = new Date().toISOString();
  const res = await fetch(`${API_BASE}/contents/data/index.json`, {
    method: "PUT",
    headers: ghHeaders(token),
    body: JSON.stringify({
      message,
      content: toBase64Utf8(JSON.stringify(next, null, 2)),
      branch: DATA_BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!res.ok) {
    const details = await res.text();
    throw new Error(`עדכון האינדקס נכשל (${res.status}): ${details}`);
  }
}

export type SaveItem = {
  id: string;
  name: string;
  combo?: string;
  parent?: string;
  fillerName?: string;
  date?: string;
  imagePath?: string;
  [key: string]: unknown;
};

async function saveEntity(kind: IndexKind, item: SaveItem): Promise<void> {
  const folder = kind === "merges" ? "merges" : "profiles";
  const path = `data/library/${folder}/${item.id}.json`;
  await putFile(path, toBase64Utf8(JSON.stringify(item, null, 2)), `save ${folder}/${item.id}`);
  const entry: IndexEntry = {
    id: item.id,
    name: item.name,
    combo: item.combo,
    parent: item.parent,
    fillerName: item.fillerName,
    date: item.date ?? new Date().toISOString(),
    path,
    imagePath: item.imagePath,
  };
  await updateIndex((index) => ({ ...index, [kind]: upsert(index[kind], entry) }) as Index, `update index (${folder}/${item.id})`);
}

export function saveMerge(item: SaveItem): Promise<void> {
  return saveEntity("merges", item);
}

export function saveProfile(item: SaveItem): Promise<void> {
  return saveEntity("profiles", item);
}

export async function saveImage(id: string, pngBase64: string): Promise<void> {
  const clean = pngBase64.includes(",") ? pngBase64.split(",")[1] : pngBase64;
  const path = `data/images/${id}.png`;
  await putFile(path, clean, `save image ${id}`);
  await updateIndex(
    (index) => ({ ...index, images: Array.from(new Set([...index.images, id])) }),
    `update index (image ${id})`,
  );
}

/* ---------- connection check ---------- */

export type ConnectionResult = { ok: boolean; canWrite: boolean; message: string };

export async function validateConnection(): Promise<ConnectionResult> {
  const token = getToken();
  if (!token) {
    return { ok: false, canWrite: false, message: "לא הוזן טוקן — מצב קריאה בלבד." };
  }
  try {
    const res = await fetch(API_BASE, { headers: ghHeaders(token), cache: "no-store" });
    if (res.status === 401) {
      return { ok: false, canWrite: false, message: "הטוקן אינו תקין או שפג תוקפו." };
    }
    if (res.status === 404) {
      return { ok: false, canWrite: false, message: "המאגר לא נמצא, או שלטוקן אין הרשאה אליו." };
    }
    if (!res.ok) {
      return { ok: false, canWrite: false, message: `שגיאת חיבור (${res.status}).` };
    }
    const json = (await res.json()) as { permissions?: { push?: boolean } };
    const canWrite = Boolean(json.permissions?.push);
    return {
      ok: true,
      canWrite,
      message: canWrite ? "מחובר לכתיבה" : "טוקן תקין, אך ללא הרשאת כתיבה",
    };
  } catch {
    return { ok: false, canWrite: false, message: "החיבור נכשל. בדקו את החיבור לאינטרנט ונסו שוב." };
  }
}
