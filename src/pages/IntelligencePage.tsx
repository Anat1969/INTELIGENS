import { useParams, useNavigate, Link } from 'react-router-dom'
import { useEffect, useState, useRef, useCallback } from 'react'
import { getLibraryItem, updateItemImage, addToLibrary, type LibraryItem } from '@/lib/local-library'
import { fetchMerge, saveMerge } from '@/lib/github-store'
import { hasToken } from '@/lib/gh-token'
import { composeIntelligence, comboLabel } from '@/lib/synthesize'
import { BY_ID, INTELLIGENCES, type IntelligenceId } from '@/data/intelligences'
import { ArrowRight, Upload, Image, Copy, Check, Trash2 } from 'lucide-react'
import { AppNav } from '@/components/AppNav'
import { PrintButton } from '@/components/print/PrintButton'
import { PrintableArticle } from '@/components/print/PrintableArticle'

export default function IntelligencePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [item, setItem] = useState<LibraryItem | null>(null)
  const [visualCopied, setVisualCopied] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
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

  const handleImageFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/') || !id) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = e.target?.result as string
      updateItemImage(id, data)
      setItem(prev => prev ? { ...prev, image_data: data } : null)
    }
    reader.readAsDataURL(file)
  }, [id])

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return
    for (const clipItem of Array.from(items)) {
      if (clipItem.type.startsWith('image/')) {
        e.preventDefault()
        const file = clipItem.getAsFile()
        if (file) handleImageFile(file)
        break
      }
    }
  }, [handleImageFile])

  useEffect(() => {
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [handlePaste])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleImageFile(file)
  }, [handleImageFile])

  const handleRemoveImage = useCallback(() => {
    if (!id) return
    updateItemImage(id, '')
    setItem(prev => prev ? { ...prev, image_data: undefined } : null)
  }, [id])

  function handleCopyVisual() {
    if (item?.visualPrompt) {
      navigator.clipboard.writeText(item.visualPrompt)
      setVisualCopied(true)
      setTimeout(() => setVisualCopied(false), 2000)
    }
  }

  if (!item) return null

  const sourceNames = item.source_ids
    .map(sid => (sid in BY_ID ? BY_ID[sid as keyof typeof BY_ID].name : sid))
    .join(' + ')

  const sourceHues = item.source_ids
    .filter(sid => sid in BY_ID)
    .map(sid => BY_ID[sid as keyof typeof BY_ID].hue)

  const gradientBg = sourceHues.length >= 2
    ? `linear-gradient(135deg, ${sourceHues.map((h, i) => `hsla(${h}, 0.06) ${(i / (sourceHues.length - 1)) * 100}%`).join(', ')})`
    : sourceHues.length === 1
      ? `radial-gradient(ellipse at 50% 0%, hsla(${sourceHues[0]}, 0.1), transparent 60%)`
      : 'none'

  return (
    <div className="min-h-screen" style={{ background: `${gradientBg}, hsl(var(--background))` }}>
      <AppNav />

      <article className="mx-auto max-w-[900px] px-6 pt-32 pb-20">
        {/* Back button */}
        <button
          onClick={() => navigate('/composer')}
          className="flex items-center gap-2 font-mono-dm text-[11px] tracking-[0.15em] mb-12 transition-opacity hover:opacity-60"
          style={{ color: 'hsl(var(--text-dim))' }}
        >
          <ArrowRight size={14} />
          חזרה למפה
        </button>

        {/* Magazine Header */}
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span
              className="font-mono-dm text-[9px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full"
              style={{
                color: sourceHues[0] ? `hsl(${sourceHues[0]})` : 'hsl(var(--text-dim))',
                border: `1px solid ${sourceHues[0] ? `hsla(${sourceHues[0]}, 0.2)` : 'hsla(var(--foreground), 0.1)'}`,
              }}
            >
              צירוף של {item.source_ids.length}
            </span>
            <span
              className="font-mono-dm text-[9px] tracking-[0.1em]"
              style={{ color: 'hsl(var(--text-dim))', opacity: 0.5 }}
            >
              {new Date(item.created_at).toLocaleDateString('he-IL')}
            </span>
          </div>

          <h1
            className="font-serif-display leading-[1.05] tracking-[-0.02em] text-foreground"
            style={{ fontSize: 'clamp(40px, 7vw, 72px)' }}
          >
            {item.name}
          </h1>

          <p
            className="mt-4 font-mono-dm text-[14px] tracking-[0.12em] uppercase"
            style={{ color: 'hsl(var(--text-dim))' }}
          >
            {item.type}
          </p>

          <p
            className="mt-3 font-sans-he text-[15px]"
            style={{ color: 'hsl(var(--foreground))' }}
          >
            נוצר מהצירוף: {sourceNames}
          </p>

          {chain.length > 0 && (
            <div className="mt-3">
              <p
                className="font-mono-dm text-[9px] tracking-[0.2em] uppercase mb-2"
                style={{ color: 'hsl(var(--text-dim))', opacity: 0.6 }}
              >
                שרשרת המקור
              </p>
              <p
                className="font-sans-he text-[14px] leading-[1.9]"
                style={{ color: 'hsl(var(--text-dim))' }}
              >
                {[...chain, item.name].join('  ←  ')}
              </p>
            </div>
          )}


          {/* Rainbow line from source hues */}
          <div
            className="mt-8 h-[3px] w-48 rounded-full"
            style={{
              background: sourceHues.length >= 2
                ? `linear-gradient(90deg, ${sourceHues.map(h => `hsl(${h})`).join(', ')})`
                : sourceHues[0]
                  ? `hsl(${sourceHues[0]})`
                  : 'hsla(var(--foreground), 0.1)',
            }}
          />

          <div className="mt-8">
            <PrintButton />
          </div>
        </header>

        {/* Image Section */}
        <section className="mb-16">
          {item.image_data ? (
            <div className="relative group">
              <div
                className="rounded-2xl overflow-hidden"
                style={{ border: '1px solid hsla(var(--foreground), 0.06)' }}
              >
                <img
                  src={item.image_data}
                  alt={item.name}
                  className="w-full max-h-[500px] object-cover"
                />
              </div>
              <button
                onClick={handleRemoveImage}
                className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg"
                style={{
                  background: 'hsla(0, 0%, 0%, 0.6)',
                  color: 'white',
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
              onDragLeave={() => setIsDragOver(false)}
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer rounded-2xl flex flex-col items-center justify-center gap-4 py-16 transition-all duration-200"
              style={{
                border: `2px dashed ${isDragOver ? 'hsla(var(--foreground), 0.3)' : 'hsla(var(--foreground), 0.08)'}`,
                background: isDragOver ? 'hsla(var(--foreground), 0.03)' : 'transparent',
              }}
            >
              <Upload
                size={32}
                style={{ color: 'hsl(var(--text-dim))', opacity: 0.3 }}
              />
              <div className="text-center">
                <p
                  className="font-sans-he text-[14px]"
                  style={{ color: 'hsl(var(--text-dim))' }}
                >
                  גרור תמונה לכאן, הדבק (Ctrl+V) או לחץ להעלאה
                </p>
                <p
                  className="font-mono-dm text-[10px] mt-2"
                  style={{ color: 'hsl(var(--text-dim))', opacity: 0.5 }}
                >
                  צור תמונה עם הפרומפט הויזואלי והדבק אותה כאן
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageFile(file)
                }}
              />
            </div>
          )}
        </section>

        {/* Source intelligences */}
        <div
          className="font-mono-dm text-[10px] tracking-[0.15em] mb-12 pb-8"
          style={{
            color: 'hsl(var(--text-dim))',
            borderBottom: '1px solid hsla(var(--foreground), 0.06)',
          }}
        >
          {sourceNames}
        </div>

        {/* Essence — Full width, large text */}
        <section className="mb-16">
          <h2
            className="font-mono-dm text-[10px] tracking-[0.25em] uppercase mb-6"
            style={{ color: sourceHues[0] ? `hsla(${sourceHues[0]}, 0.6)` : 'hsl(var(--text-dim))' }}
          >
            הגרעין
          </h2>
          <p
            className="font-sans-he text-[20px] md:text-[22px] leading-[2]"
            style={{ color: 'hsl(var(--foreground))' }}
          >
            {item.essence}
          </p>
        </section>

        {/* Divider */}
        <div
          className="h-px w-full mb-16"
          style={{
            background: sourceHues.length >= 2
              ? `linear-gradient(90deg, ${sourceHues.map(h => `hsla(${h}, 0.2)`).join(', ')}, transparent)`
              : 'hsla(var(--foreground), 0.06)',
          }}
        />

        {/* Power */}
        <section className="mb-16">
          <h2
            className="font-mono-dm text-[10px] tracking-[0.25em] uppercase mb-6"
            style={{ color: sourceHues[1] ? `hsla(${sourceHues[1]}, 0.6)` : 'hsl(var(--text-dim))' }}
          >
            העוצמה
          </h2>
          <p
            className="font-sans-he text-[18px] leading-[1.9]"
            style={{ color: 'hsl(var(--foreground))' }}
          >
            {item.power}
          </p>
        </section>

        {/* Roles — magazine-style scattered layout */}
        <section className="mb-16">
          <h2
            className="font-mono-dm text-[10px] tracking-[0.25em] uppercase mb-8"
            style={{ color: 'hsl(var(--text-dim))' }}
          >
            תפקידים
          </h2>
          <div className="flex flex-wrap gap-4">
            {item.roles.map((role, i) => (
              <span
                key={role}
                className="font-sans-he text-[15px] px-5 py-2.5 rounded-xl"
                style={{
                  color: 'hsl(var(--foreground))',
                  background: sourceHues[i % sourceHues.length]
                    ? `hsla(${sourceHues[i % sourceHues.length]}, 0.06)`
                    : 'hsla(var(--foreground), 0.04)',
                  border: `1px solid ${sourceHues[i % sourceHues.length]
                    ? `hsla(${sourceHues[i % sourceHues.length]}, 0.1)`
                    : 'hsla(var(--foreground), 0.06)'}`,
                }}
              >
                {role}
              </span>
            ))}
          </div>
        </section>

        {/* Quote — large, centered, dramatic */}
        <section className="mb-16 py-12">
          <div
            className="pr-6"
            style={{
              borderRight: `3px solid ${sourceHues[0] ? `hsla(${sourceHues[0]}, 0.4)` : 'hsla(260, 70%, 60%, 0.3)'}`,
            }}
          >
            <p
              className="font-serif-display text-[24px] md:text-[28px] leading-[1.7] italic"
              style={{ color: 'hsl(var(--foreground))' }}
            >
              "{item.quote}"
            </p>
          </div>
        </section>

        {/* Key Question */}
        {item.keyQuestion && (
          <section className="mb-16">
            <h2
              className="font-mono-dm text-[10px] tracking-[0.25em] uppercase mb-6"
              style={{ color: 'hsla(340, 70%, 60%, 0.7)' }}
            >
              שאלת מפתח
            </h2>
            <p
              className="font-sans-he text-[18px] leading-[1.9]"
              style={{ color: 'hsl(var(--text-dim))' }}
            >
              {item.keyQuestion}
            </p>
          </section>
        )}

        {/* Visual Prompt */}
        {item.visualPrompt && (
          <section className="mb-16">
            <div
              className="h-px w-full mb-12"
              style={{ background: 'hsla(var(--foreground), 0.06)' }}
            />
            <div className="flex items-center justify-between mb-6">
              <h2
                className="font-mono-dm text-[10px] tracking-[0.25em] uppercase flex items-center gap-2"
                style={{ color: 'hsla(170, 70%, 55%, 0.7)' }}
              >
                <Image size={14} />
                פרומפט ויזואלי
              </h2>
              <button
                onClick={handleCopyVisual}
                className="flex items-center gap-2 font-mono-dm text-[10px] tracking-[0.1em] px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-70"
                style={{
                  color: 'hsla(170, 70%, 55%, 0.8)',
                  background: 'hsla(170, 70%, 55%, 0.06)',
                  border: '1px solid hsla(170, 70%, 55%, 0.15)',
                }}
              >
                {visualCopied ? <Check size={12} /> : <Copy size={12} />}
                {visualCopied ? 'הועתק' : 'העתק פרומפט'}
              </button>
            </div>
            <div
              className="p-6 rounded-xl"
              style={{
                background: 'hsla(170, 70%, 55%, 0.04)',
                border: '1px solid hsla(170, 70%, 55%, 0.1)',
                direction: 'ltr',
              }}
            >
              <p
                className="font-mono-dm text-[13px] leading-[1.9]"
                style={{ color: 'hsl(var(--text-dim))' }}
              >
                {item.visualPrompt}
              </p>
            </div>
          </section>
        )}

        {/* Continue merging */}
        <section className="mb-16">
          <div
            className="h-px w-full mb-12"
            style={{ background: 'hsla(var(--foreground), 0.06)' }}
          />
          <h2
            className="font-mono-dm text-[10px] tracking-[0.25em] uppercase mb-6"
            style={{ color: 'hsl(var(--text-dim))' }}
          >
            המשך למזג
          </h2>
          <p
            className="font-sans-he text-[14px] mb-6"
            style={{ color: 'hsl(var(--text-dim))' }}
          >
            בחרו אינטליגנציות נוספות כדי לצמוח מהמיזוג הזה לאינטליגנציה חדשה.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            {INTELLIGENCES.filter((intel) => !item.source_ids.includes(intel.id)).map((intel) => {
              const on = picked.includes(intel.id)
              return (
                <button
                  key={intel.id}
                  onClick={() => togglePick(intel.id)}
                  className="font-sans-he text-[14px] px-4 py-2 rounded-xl transition-all duration-200"
                  style={{
                    color: on ? `hsl(${intel.hue})` : 'hsl(var(--foreground))',
                    background: on ? `hsla(${intel.hue}, 0.12)` : 'hsla(var(--foreground), 0.03)',
                    border: `1px solid ${on ? `hsla(${intel.hue}, 0.35)` : 'hsla(var(--foreground), 0.08)'}`,
                  }}
                >
                  {intel.name}
                </button>
              )
            })}
          </div>
          <button
            onClick={handleContinueMerge}
            disabled={picked.length === 0}
            className="font-sans-he text-[15px] px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-40"
            style={{
              color: 'hsl(var(--foreground))',
              background: 'hsla(var(--foreground), 0.05)',
              border: '1px solid hsla(var(--foreground), 0.12)',
            }}
          >
            מזג ליצירת אינטליגנציה חדשה
          </button>
          {!hasToken() && (
            <p
              className="mt-4 font-sans-he text-[12px] leading-[1.8]"
              style={{ color: 'hsl(var(--text-dim))' }}
            >
              מצב קריאה בלבד — המיזוג לא נשמר למאגר הציבורי. להזנת טוקן:{' '}
              <Link to="/settings" className="underline">הגדרות</Link>
            </p>
          )}
        </section>

        {/* Footer */}
        <footer
          className="pt-8 mt-8 text-center"
          style={{ borderTop: '1px solid hsla(var(--foreground), 0.06)' }}
        >
          <p
            className="font-mono-dm text-[9px] tracking-[0.2em] uppercase"
            style={{ color: 'hsl(var(--text-dim))', opacity: 0.4 }}
          >
            Intelligence Composer
          </p>
        </footer>
      </article>

      <PrintableArticle>
        <h1>{item.name}</h1>
        <p className="print-sub">{item.type}</p>
        <p className="print-meta">
          צירוף של {item.source_ids.length} · {sourceNames} ·{' '}
          {new Date(item.created_at).toLocaleDateString('he-IL')}
        </p>
        {chain.length > 0 && (
          <p className="print-meta">שרשרת המקור: {[...chain, item.name].join(' ← ')}</p>
        )}

        {item.image_data && (
          <img className="print-img" src={item.image_data} alt={item.name} />
        )}

        <h2>הגרעין</h2>
        <p>{item.essence}</p>

        <h2>העוצמה</h2>
        <p>{item.power}</p>

        <h2>תפקידים</h2>
        <ul>
          {item.roles.map((role) => (
            <li key={role}>{role}</li>
          ))}
        </ul>

        <p className="print-quote">{item.quote}</p>

        {item.keyQuestion && (
          <>
            <h2>שאלת מפתח</h2>
            <p>{item.keyQuestion}</p>
          </>
        )}
      </PrintableArticle>
    </div>
  )
}
