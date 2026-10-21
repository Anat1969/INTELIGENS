// Code and content live in one repo: code on `main` (synced with Lovable),
// content (merges, profiles, images) on the separate `data` branch,
// so in-app saves never trigger a Lovable sync or rebuild.
export const DATA_OWNER = "Anat1969";
export const DATA_REPO = "INTELIGENS";
export const DATA_BRANCH = "data";

export const RAW_BASE = `https://raw.githubusercontent.com/${DATA_OWNER}/${DATA_REPO}/${DATA_BRANCH}`;
export const API_BASE = `https://api.github.com/repos/${DATA_OWNER}/${DATA_REPO}`;
