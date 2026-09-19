import { useParams, useNavigate, Link } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import { getLibraryItem, addToLibrary, type LibraryItem } from '@/lib/local-library'
import { fetchMerge, saveMerge } from '@/lib/github-store'
import { hasToken } from '@/lib/gh-token'
import { composeIntelligence, comboLabel, mergeLayers } from '@/lib/synthesize'
import { BY_ID, INTELLIGENCES, type IntelligenceId } from '@/data/intelligences'
import { AppNav } from '@/components/AppNav'
import { MagazineArticle } from '@/components/MagazineArticle'
import { Button } from '@/components/ui/button'

export default function IntelligencePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [item, setItem] = useState<LibraryItem | null>(null)
  const [chain, setChain] = useState<string[]>([])
  const [picked, setPicked] = useState<string[]>([])

  useEffect(() => {
    setPicked([])
  }, [id])

  // Walk the parent chain (oldest ancestor → current)
  useEffect(() => {
    let alive = true
    async function walk() {
      if (!item) {
        setChain([])
        return
      }
      const names: string[] = []
      let parentId = item.parent
      const seen = new Set<string>()
      while (parentId && !seen.has(parentId)) {
        seen.add(parentId)
        const remote = (await fetchMerge(parentId)) as LibraryItem | null
        const local = getLibraryItem(parentId)
        const resolved = remote?.name ? remote : local
        names.unshift(
          resolved?.name ??
            parentId
              .split('-')
              .map((sid) => (sid in BY_ID ? BY_ID[sid as IntelligenceId].name : sid))
              .join(' + '),
        )
        parentId = resolved?.parent
      }
      if (alive) setChain(names)
    }
    walk()
    return () => {
      alive = false
    }
  }, [item])

  const togglePick = useCallback((pid: string) => {
    setPicked((prev) => (prev.includes(pid) ? prev.filter((p) => p !== pid) : [...prev, pid]))
  }, [])

  const handleContinueMerge = useCallback(() => {
    if (!item || picked.length === 0) return
    const newSourceIds = Array.from(new Set([...item.source_ids, ...picked])).sort() as IntelligenceId[]
    const newId = newSourceIds.join('-')
    const composed = composeIntelligence(newSourceIds)
    const now = new Date().toISOString()
    addToLibrary(composed, newId, { parent: item.id, combo: comboLabel(newSourceIds) })

    if (hasToken()) {
      saveMerge({
        ...composed,
        id: newId,
        created_at: now,
        date: now,
        combo: comboLabel(newSourceIds),
        parent: item.id,
      }).catch(() => undefined)
    }
    navigate(`/intelligence/${newId}`)
  }, [item, picked, navigate])

  useEffect(() => {
    if (!id) return
    let alive = true

    async function load(mergeId: string) {
      const remote = (await fetchMerge(mergeId)) as LibraryItem | null
      if (!alive) return
      if (remote && remote.name) {
        const local = getLibraryItem(mergeId)
        setItem({
          ...remote,
          created_at: remote.created_at ?? new Date().toISOString(),
          image_data: remote.image_data ?? local?.image_data,
        })
        return
      }
      const found = getLibraryItem(mergeId)
      if (found) setItem(found)
      else navigate('/composer')
    }

    load(id)
    return () => {
      alive = false
    }
  }, [id, navigate])

  if (!item) return null

  const sourceNames = item.source_ids
    .map((sid) => (sid in BY_ID ? BY_ID[sid as keyof typeof BY_ID].name : sid))
    .join(' + ')

  return (
    <div className="base-article-page min-h-screen">
      <AppNav />
      <main className="pt-28 pb-20 px-5 sm:px-8">
        <div className="no-print mag-topbar">
          <Button type="button" className="tool-btn" onClick={() => window.print()}>
            הורד PDF
          </Button>
        </div>

        <MagazineArticle
          title={item.name}
          subtitle={item.type}
          sourceChain={
            chain.length > 0
              ? `שרשרת המקור: ${[...chain, item.name].join('  ←  ')}`
              : `נוצר מהצירוף: ${sourceNames}`
          }
          lead={item.essence}
          layers={mergeLayers(item.source_ids as IntelligenceId[])}
          idPrefix={item.id}
          footer={new Date(item.created_at).toLocaleDateString('he-IL')}
          hues={item.source_ids
            .map((sid) => (sid in BY_ID ? BY_ID[sid as IntelligenceId].hue : ''))
            .filter(Boolean)}
        >
          <section className="mag-section">
            <h2 className="mag-subheading">העוצמה</h2>
            <p className="mag-body">{item.power}</p>
          </section>

          <section className="mag-section">
            <h2 className="mag-subheading">תפקידים</h2>
            <div className="mag-tags">
              {item.roles.map((role) => (
                <span key={role} className="mag-tag">
                  {role}
                </span>
              ))}
            </div>
          </section>

          <section className="mag-section">
            <blockquote className="mag-quote">"{item.quote}"</blockquote>
          </section>

          {item.keyQuestion && (
            <section className="mag-section">
              <h2 className="mag-subheading">שאלת מפתח</h2>
              <p className="mag-body">{item.keyQuestion}</p>
            </section>
          )}
        </MagazineArticle>

        <section className="no-print mag-topbar" style={{ display: 'block', marginTop: '48px' }} dir="rtl">
          <h2 className="mag-subheading">המשך למזג</h2>
          <p className="mag-body" style={{ marginBottom: '20px' }}>
            בחרו אינטליגנציות נוספות כדי לצמוח מהמיזוג הזה לאינטליגנציה חדשה.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            {INTELLIGENCES.filter((intel) => !item.source_ids.includes(intel.id)).map((intel) => {
              const on = picked.includes(intel.id)
              return (
                <button
                  key={intel.id}
                  onClick={() => togglePick(intel.id)}
                  className="mag-tag"
                  style={{
                    background: on ? `hsla(${intel.hue}, 0.14)` : undefined,
                    borderColor: on ? `hsla(${intel.hue}, 0.4)` : undefined,
                  }}
                >
                  {intel.name}
                </button>
              )
            })}
          </div>
          <Button
            type="button"
            className="tool-btn"
            onClick={handleContinueMerge}
            disabled={picked.length === 0}
          >
            מזג ליצירת אינטליגנציה חדשה
          </Button>
          {!hasToken() && (
            <p className="mag-status">
              מצב קריאה בלבד — המיזוג לא נשמר למאגר הציבורי. להזנת טוקן:{' '}
              <Link to="/settings">הגדרות</Link>
            </p>
          )}
        </section>
      </main>
    </div>
  )
}
