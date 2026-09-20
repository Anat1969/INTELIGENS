import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type DragEvent,
} from 'react'
import { Link } from 'react-router-dom'
import { hasToken } from '@/lib/gh-token'
import { saveImage } from '@/lib/github-store'
import {
  clearLocalImage,
  onImageUpdated,
  resolveImage,
  setLocalImage,
} from '@/lib/living-image'
import { compressImage } from '@/lib/image-compress'
import { cn } from '@/lib/utils'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'local' | 'error'

interface Props {
  /** Storage id for the cover image (e.g. `coverImageId(mergeId)`). */
  id: string
  /** `card` = compact media strip inside a library card. `panel` = a wide dropzone. */
  variant?: 'card' | 'panel'
  /** Accent bar / gradient shown behind an empty `card`. */
  gradient?: string
  /** Legacy inline image to fall back to when nothing is cached yet. */
  fallbackSrc?: string
  /** The prompt for generating this cover image — surfaced as a copy button. */
  visualPrompt?: string
  /** Notified whenever the shown image changes. */
  onChange?: (src: string | null) => void
}

/**
 * Attach one "cover" image to a merge, via upload / drag-drop / paste.
 * The image is stored with the shared living-image cache (IndexedDB locally,
 * GitHub as the source of truth) so it also appears wherever else the same
 * cover id is rendered. Placed OUTSIDE any navigating button so its own
 * clicks never trigger navigation.
 */
export function CoverUploader({
  id,
  variant = 'card',
  gradient,
  fallbackSrc,
  visualPrompt,
  onChange,
}: Props) {
  const [src, setSrc] = useState<string | null>(fallbackSrc ?? null)
  const [status, setStatus] = useState<SaveStatus>('idle')
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [hover, setHover] = useState(false)
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const copyPrompt = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    if (!visualPrompt) return
    void navigator.clipboard.writeText(visualPrompt)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  // Resolve the best available image (GitHub first, then local cache) and keep
  // in sync when the same cover is changed elsewhere.
  useEffect(() => {
    let alive = true
    void resolveImage(id).then((resolved) => {
      if (!alive) return
      const next = resolved ?? fallbackSrc ?? null
      setSrc(next)
      onChange?.(next)
    })
    const off = onImageUpdated((updatedId) => {
      if (updatedId !== id) return
      void resolveImage(id).then((resolved) => {
        if (!alive) return
        setSrc(resolved)
        onChange?.(resolved)
      })
    })
    return () => {
      alive = false
      off()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleNewImage = useCallback(
    async (rawDataUrl: string) => {
      const dataUrl = await compressImage(rawDataUrl)
      void setLocalImage(id, dataUrl)
      setSrc(dataUrl)
      onChange?.(dataUrl)
      setError('')
      if (!hasToken()) {
        setStatus('local')
        return
      }
      setStatus('saving')
      try {
        await saveImage(id, dataUrl)
        setStatus('saved')
      } catch (e) {
        setStatus('error')
        setError(e instanceof Error ? e.message : 'שמירת התמונה למאגר נכשלה.')
      }
    },
    [id, onChange],
  )

  const readFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') void handleNewImage(reader.result)
      }
      reader.readAsDataURL(file)
    },
    [handleNewImage],
  )

  // Paste is global, so only listen while this uploader is hovered/focused —
  // that keeps it unambiguous when many cards are on screen at once.
  useEffect(() => {
    if (!hover) return
    const onPaste = (e: ClipboardEvent) => {
      const imageItem = Array.from(e.clipboardData?.items ?? []).find((it) =>
        it.type.startsWith('image/'),
      )
      const file = imageItem?.getAsFile()
      if (!file) return
      e.preventDefault()
      readFile(file)
    }
    document.addEventListener('paste', onPaste)
    return () => document.removeEventListener('paste', onPaste)
  }, [hover, readFile])

  const openPicker = () => inputRef.current?.click()

  const removeImage = () => {
    void clearLocalImage(id)
    setSrc(null)
    onChange?.(null)
    setStatus('idle')
    setError('')
  }

  const dropProps = {
    onDrop: (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) readFile(file)
    },
    onDragOver: (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setDragOver(true)
    },
    onDragLeave: () => setDragOver(false),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onFocus: () => setHover(true),
    onBlur: () => setHover(false),
  }

  const statusNote = (
    <>
      {status === 'saving' && (
        <span className="cover-status">שומר תמונה...</span>
      )}
      {status === 'saved' && <span className="cover-status">התמונה נשמרה</span>}
      {status === 'local' && (
        <span className="cover-status">
          נשמר במחשב זה בלבד. להזנת טוקן:{' '}
          <Link to="/settings" className="underline">
            הגדרות
          </Link>
        </span>
      )}
      {status === 'error' && (
        <span className="cover-status cover-status--error">
          שמירת התמונה נכשלה. {error}
        </span>
      )}
    </>
  )

  const hiddenInput = (
    <input
      ref={inputRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0]
        if (file) readFile(file)
        e.target.value = ''
      }}
    />
  )

  /* ------------------------------ panel ------------------------------ */
  if (variant === 'panel') {
    return (
      <div dir="rtl" {...dropProps} className="no-print">
        {src ? (
          <div className="flex flex-col items-center">
            <div
              className="rounded-xl overflow-hidden w-full max-w-[360px] aspect-square"
              style={{ border: '1px solid hsla(var(--foreground), 0.08)' }}
            >
              <img
                src={src}
                alt="תמונת המיזוג"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
              {visualPrompt && (
                <button type="button" onClick={copyPrompt} className="tool-btn">
                  {copied ? 'הפרומפט הועתק' : 'העתק פרומפט לתמונה'}
                </button>
              )}
              <button type="button" onClick={openPicker} className="tool-btn">
                החלפת תמונה
              </button>
              <button type="button" onClick={removeImage} className="tool-btn">
                הסרת תמונה
              </button>
              {statusNote}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div
              role="button"
              tabIndex={0}
              onClick={openPicker}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') openPicker()
              }}
              className={cn(
                'cursor-pointer rounded-xl flex flex-col items-center justify-center gap-2 w-full max-w-[360px] aspect-square transition-all duration-200 text-center px-6',
              )}
              style={{
                border: `2px dashed ${
                  dragOver
                    ? 'hsla(var(--foreground), 0.3)'
                    : 'hsla(var(--foreground), 0.12)'
                }`,
                background: dragOver
                  ? 'hsla(var(--foreground), 0.04)'
                  : 'transparent',
              }}
            >
              <span
                className="font-sans-he text-[15px]"
                style={{ color: 'hsla(var(--foreground), 0.85)' }}
              >
                גררו תמונה לכאן · הדביקו (Ctrl+V) · או לחצו להעלאה
              </span>
              <span
                className="font-mono-dm text-[10px] tracking-[0.15em] uppercase"
                style={{ color: 'hsl(var(--text-dim))' }}
              >
                תמונה ריבועית — תופיע על הכרטיס בספריית הגילויים
              </span>
            </div>
            {visualPrompt && (
              <button type="button" onClick={copyPrompt} className="tool-btn mt-3">
                {copied ? 'הפרומפט הועתק' : 'העתק פרומפט לתמונה'}
              </button>
            )}
            <div className="mt-2">{statusNote}</div>
          </div>
        )}
        {hiddenInput}
      </div>
    )
  }

  /* ------------------------------ card ------------------------------- */
  return (
    <div
      {...dropProps}
      className="relative w-full group/cover"
      style={{ direction: 'rtl' }}
    >
      {/* Square framed image / dropzone */}
      <div
        className="relative w-full aspect-square overflow-hidden"
        style={{
          borderBottom: '1px solid hsla(var(--foreground), 0.06)',
        }}
      >
        <span
          className="absolute top-0 left-0 right-0 h-1 z-10"
          style={{ background: gradient ?? 'hsla(var(--foreground), 0.1)' }}
          aria-hidden="true"
        />

        {src ? (
          <>
            <img
              src={src}
              alt="תמונת המיזוג"
              className="w-full h-full object-cover"
            />
            <div className="no-print absolute top-3 left-2 flex gap-1.5 opacity-0 group-hover/cover:opacity-100 transition-opacity duration-200">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  openPicker()
                }}
                className="cover-chip"
              >
                החלפה
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeImage()
                }}
                className="cover-chip"
              >
                הסרה
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              openPicker()
            }}
            className="no-print absolute inset-0 m-2 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-200 text-center px-3"
            style={{
              background: dragOver
                ? 'hsla(var(--foreground), 0.05)'
                : 'hsla(var(--foreground), 0.02)',
              border: `2px dashed ${
                dragOver
                  ? 'hsla(var(--foreground), 0.3)'
                  : 'hsla(var(--foreground), 0.12)'
              }`,
            }}
          >
            <span
              className="font-sans-he text-[13px]"
              style={{ color: 'hsla(var(--foreground), 0.75)' }}
            >
              הוסיפו תמונה למיזוג
            </span>
            <span
              className="font-mono-dm text-[9px] tracking-[0.12em] uppercase"
              style={{ color: 'hsl(var(--text-dim))' }}
            >
              גררו · הדביקו · או לחצו
            </span>
          </button>
        )}
      </div>

      {/* Prompt for generating the (square) cover image */}
      {visualPrompt && (
        <button
          type="button"
          onClick={copyPrompt}
          className="no-print w-full flex items-center justify-center gap-2 py-2 transition-colors duration-200 cover-prompt-btn"
        >
          <span className="font-mono-dm text-[10px] tracking-[0.12em] uppercase">
            {copied ? 'הפרומפט הועתק ✓' : 'העתק פרומפט לתמונה'}
          </span>
        </button>
      )}

      {status !== 'idle' && (
        <div className="no-print px-3 pt-1 pb-1">{statusNote}</div>
      )}
      {hiddenInput}
    </div>
  )
}

export default CoverUploader
