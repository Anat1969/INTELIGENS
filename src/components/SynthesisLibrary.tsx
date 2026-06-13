import { useEffect, useState } from 'react'
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

  if (loading || library.length === 0) return null

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
          אינטליגנציות שנוצרו בסינתזה
        </span>
      </div>

      <p
        className="font-sans-he text-[13px] leading-[1.8] mb-10 max-w-[600px]"
        style={{ color: 'hsl(var(--text-dim))' }}
      >
        כל אינטליגנציה שמופיעה כאן נוצרה על-ידי משתמש שבחר צירוף ספציפי.
        היא לא חלק מתיאוריית גארדנר — היא נוצרה בשיחה בין כישורים קיימים.
      </p>

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
        {library.map(item => (
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
    </section>
  )
}
