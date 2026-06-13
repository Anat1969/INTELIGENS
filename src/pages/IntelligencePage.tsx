import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef, useCallback } from 'react'
import { getLibraryItem, updateItemImage, type LibraryItem } from '@/lib/local-library'
import { BY_ID } from '@/data/intelligences'
import { ArrowRight, Upload, Image, Copy, Check, Trash2 } from 'lucide-react'
import { AppNav } from '@/components/AppNav'

export default function IntelligencePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [item, setItem] = useState<LibraryItem | null>(null)
  const [visualCopied, setVisualCopied] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (id) {
      const found = getLibraryItem(id)
      if (found) setItem(found)
      else navigate('/composer')
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
    </div>
  )
}
