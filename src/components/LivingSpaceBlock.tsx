import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { hasToken } from '@/lib/gh-token'
import { saveImage } from '@/lib/github-store'
import {
  clearLocalImage,
  getLocalImage,
  remoteImageUrl,
  setLocalImage,
} from '@/lib/living-image'
import { compressImage } from '@/lib/image-compress'

interface Props {
  id: string
  visualPrompt?: string
  description?: string
  /** Section heading. */
  title?: string
  /** Hebrew interpretation paragraph, rendered as readable content. */
  interpretation?: string
  /** Notified whenever the shown image changes (used for the printed report). */
  onImage?: (src: string | null) => void
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'local' | 'error'

const DEFAULT_HELP =
  'צרו תמונה עם הפרומפט, ואז גררו/הדביקו (Ctrl+V) או העלו אותה כאן — היא תישמר למאגר.'

export function LivingSpaceBlock({
  id,
  visualPrompt,
  description,
  title,
  interpretation,
  onImage,
}: Props) {

  const [src, setSrc] = useState<string | null>(() => remoteImageUrl(id))
  const [copied, setCopied] = useState(false)
  const [status, setStatus] = useState<SaveStatus>('idle')
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setSrc(remoteImageUrl(id))
    setStatus('idle')
    setError('')
  }, [id])

  const handleRemoteError = useCallback(() => {
    void getLocalImage(id).then((local) => {
      setSrc(local)
      onImage?.(local)
    })
  }, [id, onImage])

  const handleNewImage = useCallback(
    async (rawDataUrl: string) => {
      const dataUrl = await compressImage(rawDataUrl)
      void setLocalImage(id, dataUrl)
      setSrc(dataUrl)
      onImage?.(dataUrl)
      if (!hasToken()) {
        setStatus('local')
        return
      }
      setStatus('saving')
      setError('')
      try {
        await saveImage(id, dataUrl)
        setStatus('saved')
      } catch (e) {
        setStatus('error')
        setError(e instanceof Error ? e.message : 'שמירת התמונה למאגר נכשלה.')
      }
    },
    [id, onImage],
  )

  const readFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = e.target?.result as string
        if (data) void handleNewImage(data)
      }
      reader.readAsDataURL(file)
    },
    [handleNewImage],
  )

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return
      for (const it of Array.from(items)) {
        if (it.type.startsWith('image/')) {
          e.preventDefault()
          const file = it.getAsFile()
          if (file) readFile(file)
          break
        }
      }
    }
    document.addEventListener('paste', onPaste)
    return () => document.removeEventListener('paste', onPaste)
  }, [readFile])

  const handleCopy = () => {
    if (!visualPrompt) return
    navigator.clipboard.writeText(visualPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRemove = () => {
    clearLocalImage(id)
    setSrc(null)
    onImage?.(null)
    setStatus('idle')
  }

  return (
    <section dir="rtl" className="mb-16">
      <h2
        className="font-mono-dm text-[10px] tracking-[0.25em] uppercase mb-6"
        style={{ color: 'hsl(var(--text-dim))' }}
      >
        {title ?? 'מרחב מחיה'}
      </h2>

      {interpretation && (
        <p
          className="font-sans-he text-[16px] leading-[1.9] mb-6"
          style={{ color: 'hsla(var(--foreground), 0.9)' }}
        >
          {interpretation}
        </p>
      )}


      {visualPrompt && (
        <div className="no-print mb-6">
          <div className="flex items-center justify-between mb-3">
            <span
              className="font-mono-dm text-[10px] tracking-[0.2em] uppercase"
              style={{ color: 'hsl(var(--text-dim))' }}
            >
              פרומפט ויזואלי
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="tool-btn"
            >
              {copied ? 'הועתק' : 'העתק פרומפט'}
            </button>
          </div>
          <div
            className="p-6 rounded-xl"
            style={{
              background: 'hsla(var(--foreground), 0.03)',
              border: '1px solid hsla(var(--foreground), 0.08)',
            }}
          >
            <p
              dir="ltr"
              className="font-mono-dm text-[13px] leading-[1.9] text-left"
              style={{ color: 'hsl(var(--text-dim))' }}
            >
              {visualPrompt}
            </p>
          </div>
        </div>
      )}

      <p
        className="no-print font-sans-he text-[14px] leading-[1.9] mb-5"
        style={{ color: 'hsla(var(--foreground), 0.8)' }}
      >
        {description ?? DEFAULT_HELP}
      </p>

      {src ? (
        <div>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid hsla(var(--foreground), 0.06)' }}
          >
            <img
              src={src}
              alt="מרחב מחיה"
              onError={handleRemoteError}
              className="w-full max-h-[500px] object-cover"
            />
          </div>
          <div className="no-print mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="tool-btn"
            >
              החלפת תמונה
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="tool-btn"
            >
              הסרת תמונה
            </button>
          </div>
        </div>
      ) : (
        <div
          className="no-print cursor-pointer rounded-2xl flex flex-col items-center justify-center gap-3 py-16 transition-all duration-200"
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            const file = e.dataTransfer.files[0]
            if (file) readFile(file)
          }}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? 'hsla(var(--foreground), 0.3)' : 'hsla(var(--foreground), 0.08)'}`,
            background: dragOver ? 'hsla(var(--foreground), 0.03)' : 'transparent',
          }}
        >
          <p className="font-sans-he text-[15px]" style={{ color: 'hsla(var(--foreground), 0.8)' }}>
            גררו תמונה לכאן, הדביקו (Ctrl+V) או לחצו להעלאה
          </p>
        </div>
      )}

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

      {status === 'saving' && (
        <p className="no-print mt-4 font-sans-he text-[13px]" style={{ color: 'hsl(var(--text-dim))' }}>
          שומר תמונה...
        </p>
      )}
      {status === 'saved' && (
        <p className="no-print mt-4 font-sans-he text-[13px]" style={{ color: 'hsl(var(--foreground))' }}>
          התמונה נשמרה
        </p>
      )}
      {status === 'local' && (
        <p className="no-print mt-4 font-sans-he text-[13px] leading-[1.8]" style={{ color: 'hsl(var(--text-dim))' }}>
          מצב קריאה בלבד — התמונה נשמרה במחשב זה בלבד. להזנת טוקן:{' '}
          <Link to="/settings" className="underline">הגדרות</Link>
        </p>
      )}
      {status === 'error' && (
        <p className="no-print mt-4 font-sans-he text-[13px]" style={{ color: 'hsl(22, 80%, 55%)' }}>
          שמירת התמונה למאגר נכשלה. {error}
        </p>
      )}
    </section>
  )
}
