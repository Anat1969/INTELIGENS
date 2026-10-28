// One public address for the app. Each address keeps its own token and its own
// browser copy of images, so the other published addresses send visitors here.
export const CANONICAL_ORIGIN = "https://anat1969.github.io";
export const CANONICAL_BASE = "/INTELIGENS/";
export const CANONICAL_URL = `${CANONICAL_ORIGIN}${CANONICAL_BASE}`;

// Published copies that redirect. Editor previews (id-preview--*, lovableproject.com) and localhost do not.
const MIRROR_HOSTS = ["inteligens.lovable.app", "inteligens.vercel.app"];

export const isMirror = (): boolean =>
  typeof window !== "undefined" && MIRROR_HOSTS.includes(window.location.hostname);

/** The same page at the canonical address (path, query and hash kept). */
export function canonicalHref(): string {
  const { pathname, search, hash } = window.location;
  return `${CANONICAL_ORIGIN}${CANONICAL_BASE}${pathname.replace(/^\/+/, "")}${search}${hash}`;
}

export function goToCanonical(): void {
  window.location.replace(canonicalHref());
}
