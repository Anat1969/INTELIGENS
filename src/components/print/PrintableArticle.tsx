import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'

/**
 * Renders content into a body-level container that is hidden on screen
 * and is the ONLY thing visible when printing (see print rules in index.css).
 */
export function PrintableArticle({ children }: { children: ReactNode }) {
  if (typeof document === 'undefined') return null

  return createPortal(
    <div className="print-root" dir="rtl">
      <div className="print-head">Intelligence Composer</div>
      <article className="print-article">{children}</article>
      <div className="print-foot">
        <span>{new Date().toLocaleDateString('he-IL')}</span>
        <span>inteligens.lovable.app</span>
      </div>
    </div>,
    document.body,
  )
}
