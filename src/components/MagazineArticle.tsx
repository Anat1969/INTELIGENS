import type { CSSProperties, ReactNode } from 'react'
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
  /** Raw "H, S%, L%" hues driving the art direction (one per intelligence). */
  hues?: string[]
}

const LAYER_TITLES = ['אישיות', 'מרחב מחיה', 'מבנה וסביבה'] as const
const LAYER_KEYS = ['persona', 'space', 'building'] as const

export function MagazineArticle({
  title,
  subtitle,
  sourceChain,
  lead,
  layers,
  idPrefix,
  footer,
  children,
  hues,
}: Props) {
  const palette = hues && hues.length > 0 ? hues : ['260, 20%, 50%']
  const accentGrad =
    palette.length >= 2
      ? `linear-gradient(90deg, ${palette.map((h) => `hsl(${h})`).join(', ')})`
      : `linear-gradient(90deg, hsl(${palette[0]}), transparent)`

  return (
    <article
      className="mag"
      dir="rtl"
      style={{ ['--accent' as string]: `hsl(${palette[0]})` } as CSSProperties}
    >
      <header className="mag-hero">
        <div className="mag-hero-rule" style={{ background: accentGrad }} aria-hidden="true" />
        <h1 className="mag-title">{title}</h1>
        {subtitle && <p className="mag-subtitle">{subtitle}</p>}
        {sourceChain && <p className="mag-chain">{sourceChain}</p>}
      </header>

      <p className="mag-lead">{lead}</p>

      {children && <div className="mag-body-extra">{children}</div>}

      {LAYER_KEYS.map((key, i) => (
        <LayerSpread
          key={key}
          id={`${idPrefix}-${key}`}
          title={LAYER_TITLES[i]}
          interpretation={layers.interp[key]}
          visualPrompt={layers.prompts[key]}
          index={i}
          hue={palette[i % palette.length]}
        />
      ))}

      {footer && <footer className="mag-footer">{footer}</footer>}
    </article>
  )
}
