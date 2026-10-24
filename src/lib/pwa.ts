/** Registers the service worker. The install offer is handled by the A&I logo button (<ai-menu>). */
export function initPwa() {
  // Skip inside the Lovable editor preview (iframe / id-preview host) so it never serves stale code.
  const inPreview = window.self !== window.top || location.hostname.startsWith("id-preview--");
  if (import.meta.env.PROD && "serviceWorker" in navigator && !inPreview) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    });
  }
}
