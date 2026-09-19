import { useCallback, useEffect, useState } from "react";
import { hasToken } from "@/lib/gh-token";

export function useGitHubAuth() {
  const [tokenPresent, setTokenPresent] = useState<boolean>(() => hasToken());

  const refresh = useCallback(() => setTokenPresent(hasToken()), []);

  useEffect(() => {
    refresh();
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === "gh_token") refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  return { hasToken: tokenPresent, refresh };
}
