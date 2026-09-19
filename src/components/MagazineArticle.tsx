import type { ReactNode } from 'react'
import { LayerSpread } from '@/components/LayerSpread'
import type { IntelligenceLayers } from '@/lib/synthesize'

interface Props {
  title: string
  subtitle?: string
  sourceChain?: string
  lead: string
  layers: IntelligenceLayers
  idPrefix: string
  footer?: string
  children?: ReactNode
}

export function MagazineArticle({ title, subtitle, sourceChain, lead, layers, idPrefix, footer, children }: Props) {
  return (
    <article className="mag" dir="rtl">
      <header className="mag-hero">
        <h1 className="mag-title">{title}</h1>
        {subtitle && <p className="mag-subtitle">{subtitle}</p>}
        {sourceChain && <p className="mag-chain">{sourceChain}</p>}
      </header>

      <p className="mag-lead">{lead}</p>

      {children && <div className="mag-body-extra">{children}</div>}


      <LayerSpread
        id={`${idPrefix}-persona`}
        title="אישיות"
        interpretation={layers.interp.persona}
        visualPrompt={layers.prompts.persona}
        index={0}
      />
      <LayerSpread
        id={`${idPrefix}-space`}
        title="מרחב מחיה"
        interpretation={layers.interp.space}
        visualPrompt={layers.prompts.space}
        index={1}
      />
      <LayerSpread
        id={`${idPrefix}-building`}
        title="מבנה וסביבה"
        interpretation={layers.interp.building}
        visualPrompt={layers.prompts.building}
        index={2}
      />

      {footer && <footer className="mag-footer">{footer}</footer>}
    </article>
  )
}