// Images that were kept locally because saving to the repo failed (no token,
// or a token without access). They are uploaded again once saving works.
const KEY = "pending_images";
const listeners = new Set<() => void>();

function read(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
  listeners.forEach((fn) => fn());
}

export const pendingImages = (): string[] => read();
export const pendingCount = (): number => read().length;

export function markPending(id: string) {
  const ids = read();
  if (!ids.includes(id)) write([...ids, id]);
}

export function clearPending(id: string) {
  const ids = read();
  if (ids.includes(id)) write(ids.filter((x) => x !== id));
}

export function subscribePending(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
