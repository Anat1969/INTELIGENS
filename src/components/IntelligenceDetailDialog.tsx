import { Dialog, DialogContent } from '@/components/ui/dialog'
import { COMBOS, BY_ID, type Intelligence } from '@/data/intelligences'
import { PrintButton } from '@/components/print/PrintButton'
import { PrintableArticle } from '@/components/print/PrintableArticle'

interface Props {
  intel: Intelligence | null
  onClose: () => void
}

function relatedCombos(id: string) {
  return Object.entries(COMBOS)
    .filter(([key]) => key.split('+').includes(id))
    .map(([key, combo]) => ({
      key,
      combo,
      partners: key
        .split('+')
        .filter((sid) => sid !== id)
        .map((sid) => (sid in BY_ID ? BY_ID[sid as keyof typeof BY_ID].name : sid))
        .join(' + '),
    }))
}

function firstSentence(text: string) {
  const s = text.split(/(?<=\.)\s/)[0]
  return s.length > 220 ? `${s.slice(0, 220)}…` : s
}

export function IntelligenceDetailDialog({ intel, onClose }: Props) {
  if (!intel) return null

  const groupLabel = intel.group === 'gardner' ? 'גארדנר' : 'הרחבה'
  const combos = relatedCombos(intel.id)

  return (
    <>
      <Dialog open={!!intel} onOpenChange={(o) => !o && onClose()}>
        <DialogContent
          dir="rtl"
          className="no-print max-w-[640px] max-h-[85vh] overflow-y-auto text-right"
        >
          <div className="flex items-center gap-3">
            <span
              className="font-mono-dm text-[11px] tracking-[0.3em]"
              style={{ color: `hsl(${intel.hue})` }}
            >
              {intel.number}
            </span>
            <span
              className="font-mono-dm text-[9px] tracking-[0.18em] uppercase"
              style={{ color: 'hsl(var(--text-dim))' }}
            >
              {groupLabel} · {intel.source}
            </span>
          </div>

          <h2 className="font-serif-display text-[30px] leading-tight text-foreground">
            {intel.name}
          </h2>
          <p
            className="font-mono-dm text-[11px] tracking-[0.15em] uppercase"
            style={{ color: `hsl(${intel.hue})` }}
          >
            {intel.domain} · {intel.keyword}
          </p>

          <p className="font-sans-he text-[15px] leading-[1.9] text-foreground/90">
            {intel.description}
          </p>

          {combos.length > 0 && (
            <div className="space-y-4 pt-2">
              <h3
                className="font-mono-dm text-[10px] tracking-[0.22em] uppercase"
                style={{ color: 'hsl(var(--text-dim))' }}
              >
                צירופים בולטים
              </h3>
              {combos.map(({ key, combo, partners }) => (
                <div key={key} className="space-y-1">
                  <p className="font-serif-display text-[17px] text-foreground">
                    {combo.name}
                    <span
                      className="font-mono-dm text-[9px] tracking-[0.12em] mr-2"
                      style={{ color: 'hsl(var(--text-dim))' }}
                    >
                      + {partners}
                    </span>
                  </p>
                  <p
                    className="font-mono-dm text-[10px] tracking-[0.1em]"
                    style={{ color: 'hsl(var(--text-dim))' }}
                  >
                    {combo.type}
                  </p>
                  <p
                    className="font-sans-he text-[13px] leading-[1.8]"
                    style={{ color: 'hsl(var(--text-dim))' }}
                  >
                    {firstSentence(combo.essence)}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2">
            <PrintButton />
          </div>
        </DialogContent>
      </Dialog>

      <PrintableArticle>
        <h1>{intel.name}</h1>
        <p className="print-sub">
          {intel.domain} · {intel.keyword}
        </p>
        <p className="print-meta">
          אינטליגנציה {intel.number} מתוך 12 · {groupLabel} · מקור: {intel.source}
        </p>
        <p>{intel.description}</p>

        {combos.length > 0 && (
          <>
            <h2>צירופים בולטים</h2>
            {combos.map(({ key, combo, partners }) => (
              <div className="print-combo" key={key}>
                <strong>{combo.name}</strong> — {combo.type} ({partners})
                <p>{firstSentence(combo.essence)}</p>
              </div>
            ))}
          </>
        )}
      </PrintableArticle>
    </>
  )
}
