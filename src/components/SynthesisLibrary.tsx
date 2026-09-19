import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLibrary } from '@/lib/local-library'
import { fetchIndex } from '@/lib/github-store'
import { BY_ID, type IntelligenceId } from '@/data/intelligences'

interface Props {
  refreshKey?: number
}

type Card = {
  id: string
  name: string
  type?: string
  essence?: string
  combo: string
  date: string
  count: number
  source_ids: string[]
  image_data?: string
  local: boolean
}

function namesOf(ids: string[]): string {
  return ids.map(id => (id in BY_ID ? BY_ID[id as IntelligenceId].name : id)).join(' + ')
}

export default function SynthesisLibrary({ refreshKey }: Props) {
  const [cards, setCards] = useState<Card[] | null>(null)

  useEffect(() => {
    let alive = true
    setCards(null)

    async function load() {
      const index = await fetchIndex()
      const remote: Card[] = index.merges.map(entry => {
        const ids = entry.id.split('-')
        return {
          id: entry.id,
          name: entry.name,
          combo: entry.combo || namesOf(ids),
          date: entry.date,
          count: ids.length,
          source_ids: ids,
          local: false,
        }
      })

      const seen = new Set(remote.map(c => c.id))
      const local: Card[] = getLibrary()
        .filter(item => !seen.has(item.id))
        .map(item => ({
          id: item.id,
          name: item.name,
          type: item.type,
          essence: item.essence,
          combo: namesOf(item.source_ids),
          date: item.created_at,
          count: item.source_ids.length,
          source_ids: item.source_ids,
          image_data: item.image_data,
          local: true,
        }))

      if (alive) setCards([...remote, ...local])
    }

    load()
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey])

  const grouped = useMemo(() => {
    if (!cards) return []
    const groups: Record<number, Card[]> = {}
    for (const card of cards) {
      if (!groups[card.count]) groups[card.count] = []
      groups[card.count].push(card)
    }
    return Object.entries(groups)
      .map(([count, items]) => ({ count: Number(count), items }))
      .sort((a, b) => a.count - b.count)
  }, [cards])

  const totalCount = cards?.length ?? 0

  const groupLabels: Record<number, string> = {
    2: 'צירוף זוגי',
    3: 'צירוף משולש',
    4: 'צירוף רב-ממדי',
  }

  return (
    <section className="mt-24 pt-12" style={{ borderTop: '1px solid hsla(var(--foreground), 0.06)' }}>
      <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-3 mb-8">
        <h2 className="font-serif-display text-[28px]" style={{ color: 'hsl(var(--foreground))' }}>
          ספריית הגילויים
        </h2>
        <span
          className="font-mono-dm text-[10px] tracking-[0.15em] uppercase"
          style={{ color: 'hsl(var(--text-dim))', opacity: 0.6 }}
        >
          {cards === null ? '' : `${totalCount} אינטליגנציות שנוצרו`}
        </span>
      </div>

      <p
        className="font-sans-he text-[13px] leading-[1.8] mb-10 max-w-[600px]"
        style={{ color: 'hsl(var(--text-dim))' }}
      >
        כל אינטליגנציה שמופיעה כאן נוצרה על-ידי צירוף ספציפי.
        לחץ עליה כדי לפתוח את הדף המלא שלה.
      </p>

      {cards === null && (
        <p className="font-sans-he text-[13px]" style={{ color: 'hsl(var(--text-dim))' }}>
          טוען ספרייה...
        </p>
      )}

      {cards !== null && totalCount === 0 && (
        <p className="font-sans-he text-[13px]" style={{ color: 'hsl(var(--text-dim))' }}>
          המאגר עדיין ריק — כל מיזוג שתיצרו יופיע כאן.
        </p>
      )}

      {grouped.map(({ count, items }) => (
        <div key={count} className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <span
              className="font-mono-dm text-[20px] font-bold"
              style={{ color: 'hsl(var(--foreground))', opacity: 0.15 }}
            >
              {count}
            </span>
            <h3 className="font-serif-display text-[18px]" style={{ color: 'hsl(var(--text-dim))' }}>
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
            <div className="flex-1 h-px" style={{ background: 'hsla(var(--foreground), 0.06)' }} />
          </div>

          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
            {items.map(item => (
              <LibraryItemCard key={item.id} item={item} onClick={() => navigateTo(item.id)} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )

  function navigateTo(id: string) {
    navigate(`/intelligence/${id}`)
  }
}

function LibraryItemCard({ item, onClick }: { item: Card; onClick: () => void }) {
  const sourceHues = item.source_ids
    .filter(sid => sid in BY_ID)
    .map(sid => BY_ID[sid as IntelligenceId].hue)

  const gradientLine = sourceHues.length >= 2
    ? `linear-gradient(90deg, ${sourceHues.map(h => `hsl(${h})`).join(', ')})`
    : sourceHues[0]
      ? `hsl(${sourceHues[0]})`
      : 'hsla(var(--foreground), 0.1)'

  return (
    <button
      onClick={onClick}
      className="library-card-3d text-right w-full transition-all duration-200 hover:translate-y-[-2px]"
      style={{
        background: 'hsla(var(--surface), 0.5)',
        border: '1px solid hsla(var(--foreground), 0.06)',
        padding: '0',
        overflow: 'hidden',
      }}
    >
      {item.image_data ? (
        <div className="w-full h-32 overflow-hidden">
          <img src={item.image_data} alt={item.name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-full h-2" style={{ background: gradientLine }} />
      )}

      <div className="p-5">
        <h3
          className="font-serif-display text-[17px] leading-[1.3] mb-2"
          style={{ color: 'hsl(var(--foreground))' }}
        >
          {item.name}
        </h3>

        {item.type && (
          <p
            className="font-mono-dm text-[9px] tracking-[0.1em] uppercase mb-3"
            style={{ color: 'hsl(var(--text-dim))' }}
          >
            {item.type}
          </p>
        )}

        <p
          className="font-sans-he text-[12px] leading-[1.7] mb-3"
          style={{ color: 'hsl(var(--text-dim))' }}
        >
          נוצר מהצירוף: {item.combo}
        </p>

        {item.essence && (
          <p
            className="font-sans-he text-[12px] leading-[1.7] line-clamp-2 mb-3"
            style={{ color: 'hsl(var(--text-dim))', opacity: 0.7 }}
          >
            {item.essence}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span
            className="font-mono-dm text-[8px] tracking-[0.1em]"
            style={{ color: 'hsl(var(--text-dim))', opacity: 0.4 }}
          >
            {item.local ? 'מקומי בלבד' : 'מהמאגר'}
          </span>
          <span
            className="font-mono-dm text-[8px] tracking-[0.1em]"
            style={{ color: 'hsl(var(--text-dim))', opacity: 0.3 }}
          >
            {item.date ? new Date(item.date).toLocaleDateString('he-IL') : ''}
          </span>
        </div>
      </div>
    </button>
  )
}
