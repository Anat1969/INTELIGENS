import { LivingSpaceBlock } from '@/components/LivingSpaceBlock'
import type { IntelligenceLayers } from '@/lib/synthesize'

interface Props {
  layers: IntelligenceLayers
  idPrefix: string
}

export function ThreeLayers({ layers, idPrefix }: Props) {
  return (
    <section dir="rtl">
      <p
        className="no-print font-sans-he text-[16px] leading-[1.9] mb-10"
        style={{ color: 'hsla(var(--foreground), 0.8)' }}
      >
        שלוש שכבות, בסדר מתרחב: אישיות ← מרחב מחיה ← מבנה וסביבה.
      </p>

      <LivingSpaceBlock
        id={`${idPrefix}-persona`}
        title="שכבה 1 · אישיות"
        visualPrompt={layers.prompts.persona}
        interpretation={layers.interp.persona}
      />
      <LivingSpaceBlock
        id={`${idPrefix}-space`}
        title="שכבה 2 · מרחב מחיה"
        visualPrompt={layers.prompts.space}
        interpretation={layers.interp.space}
      />
      <LivingSpaceBlock
        id={`${idPrefix}-building`}
        title="שכבה 3 · מבנה וסביבה"
        visualPrompt={layers.prompts.building}
        interpretation={layers.interp.building}
      />
    </section>
  )
}
