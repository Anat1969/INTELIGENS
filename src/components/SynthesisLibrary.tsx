import { useEffect, useState, useMemo } from 'react'
import { fetchLibrary } from '@/lib/sqlite-store'
import { SynthesizedIntelligence } from '@/lib/gemini'
import LibraryCard from './LibraryCard'

export default function SynthesisLibrary() {
  const [library, setLibrary] = useState<SynthesizedIntelligence[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetchLibrary().then(data => {
      setLibrary(data)
      setLoading(false)
    })
  }, [])

  const grouped = useMemo(() => {
    const groups: Record<number, SynthesizedIntelligence[]> = {}
    for (const item of library) {
      const count = item.source_ids.length
      if (!groups[count]) groups[count] = []
      groups[count].push(item)
    }
    return Object.entries(groups)
      .map(([count, items]) => ({ count: Number(count), items }))
      .sort((a, b) => a.count - b.count)
  }, [library])

  if (loading || library.length === 0) return null

  const groupLabels: Record<number, string> = {
    2: 'צירוף זוגי',
    3: 'צירוף משולש',
    4: 'צירוף רב-ממדי',
  }

  return (
    <section className="mt-24 pt-12" style={{ borderTop: '1px solid hsla(var(--foreground), 0.06)' }}>
      <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-3 mb-8">
        <h2
          className="font-serif-display text-[28px]"
          style={{ color: 'hsl(var(--foreground))' }}
        >
          ספריית הגילויים
        </h2>
        <span
          className="font-mono-dm text-[10px] tracking-[0.15em] uppercase"
          style={{ color: 'hsl(var(--text-dim))', opacity: 0.6 }}
        >
          {library.length} אינטליגנציות שנוצרו בסינתזה
        </span>
      </div>

      <p
        className="font-sans-he text-[13px] leading-[1.8] mb-10 max-w-[600px]"
        style={{ color: 'hsl(var(--text-dim))' }}
      >
        כל אינטליגנציה שמופיעה כאן נוצרה על-ידי משתמש שבחר צירוף ספציפי.
        היא לא חלק מתיאוריית גארדנר — היא נוצרה בשיחה בין כישורים קיימים.
      </p>

      {grouped.map(({ count, items }) => (
        <div key={count} className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <span
              className="font-mono-dm text-[20px] font-bold"
              style={{ color: 'hsl(var(--foreground))', opacity: 0.15 }}
            >
              {count}
            </span>
            <h3
              className="font-serif-display text-[18px]"
              style={{ color: 'hsl(var(--text-dim))' }}
            >
              {groupLabels[count] || `צירוף של ${count} אינטליגנציות`}
            </h3>
            <span
              className="font-mono-dm text-[9px] tracking-[0.15em] px-2 py-1 rounded-md"
              style={{
                color: 'hsl(var(--text-dim))',
                background: 'hsla(var(--foreground), 0.04)',
                opacity: 0.6,
              }}
            >
              {items.length}
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: 'hsla(var(--foreground), 0.06)' }}
            />
          </div>

          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {items.map(item => (
              <LibraryCard
                key={item.source_ids.join('+')}
                intelligence={item}
                isExpanded={expanded === item.source_ids.join('+')}
                onToggle={() => setExpanded(
                  expanded === item.source_ids.join('+')
                    ? null
                    : item.source_ids.join('+')
                )}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
