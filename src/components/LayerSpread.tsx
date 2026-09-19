import { useCallback, useEffect, useRef, useState, type CSSProperties, type DragEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { hasToken } from '@/lib/gh-token'
import { saveImage } from '@/lib/github-store'
import {
  clearLocalImage,
  onImageUpdated,
  resolvePrintImage,
  setLocalImage,
} from '@/lib/living-image'
import { cn } from '@/lib/utils'

interface Props {
  id: string
  title: string
  interpretation: string
  visualPrompt: string
  index: number
  /** Raw "H, S%, L%" hue of the intelligence, for the art-directed color field. */
  hue?: string
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'local' | 'error'

export function LayerSpread({ id, title, interpretation, visualPrompt, index, hue }: Props) {
  const [src, setSrc] = useState<string | null>(null)
  const [editing, setEditing] = useState(true)
  const [copied, setCopied] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [status, setStatus] = useState<SaveStatus>('idle')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const flip = index % 2 === 1

  const loadImage = useCallback(async () => {
    const image = await resolvePrintImage(id)
    setSrc(image)
    setEditing(!image)
  }, [id])

  useEffect(() => {
    void loadImage()
    return onImageUpdated((updatedId) => {
      if (updatedId === id) void resolvePrintImage(id).then(setSrc)
    })
  }, [id, loadImage])

  const saveNewImage = useCallback(async (dataUrl: string) => {
    setLocalImage(id, dataUrl)
    setSrc(dataUrl)
    setError('')
    if (!hasToken()) {
      setStatus('local')
      return
    }
    setStatus('saving')
    try {
      await saveImage(id, dataUrl)
      setStatus('saved')
    } catch (reason) {
      setStatus('error')
      setError(reason instanceof Error ? reason.message : 'שמירת התמונה למאגר נכשלה.')
    }
  }, [id])

  const readFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') void saveNewImage(reader.result)
    }
    reader.readAsDataURL(file)
  }, [saveNewImage])

  useEffect(() => {
    if (!editing) return
    const handlePaste = (event: ClipboardEvent) => {
      const imageItem = Array.from(event.clipboardData?.items ?? []).find((item) => item.type.startsWith('image/'))
      const file = imageItem?.getAsFile()
      if (!file) return
      event.preventDefault()
      readFile(file)
    }
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [editing, readFile])

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(visualPrompt)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  const removeImage = () => {
    clearLocalImage(id)
    setSrc(null)
    setEditing(true)
    setStatus('idle')
    setError('')
  }

  const canDrop = editing && !src
  const dropHandlers = canDrop
    ? {
        onClick: () => inputRef.current?.click(),
        onDrop: (event: DragEvent<HTMLDivElement>) => {
          event.preventDefault()
          setDragOver(false)
          const file = event.dataTransfer.files[0]
          if (file) readFile(file)
        },
        onDragOver: (event: DragEvent<HTMLDivElement>) => {
          event.preventDefault()
          setDragOver(true)
        },
        onDragLeave: () => setDragOver(false),
        role: 'button' as const,
        tabIndex: 0,
        onKeyDown: (event: { key: string }) => {
          if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click()
        },
      }
    : {}

  return (
    <section
      className={cn('mag-layer', flip && 'mag-layer--flip')}
      style={{ ['--layer-hue' as string]: hue ?? '260, 20%, 50%' } as CSSProperties}
    >
      <div
        className={cn(
          'mag-layer-media',
          !src && 'mag-layer-media--placeholder',
          canDrop && 'mag-layer-media--drop',
          dragOver && 'mag-layer-media--over',
        )}
        {...dropHandlers}
      >
        {src && <img src={src} alt={title} />}
        {canDrop && (
          <span className="mag-layer-drophint no-print">
            גררו תמונה · הדביקו (Ctrl+V) · או לחצו להעלאה
          </span>
        )}
      </div>

      <div className="mag-layer-scrim" aria-hidden="true" />

      <div className="mag-layer-text">
        <p className="mag-layer-kicker">שכבה {index + 1} · {title}</p>
        <h2 className="mag-layer-heading">{title}</h2>
        <p className="mag-layer-interp">{interpretation}</p>

        <div className="no-print mag-layer-tools">
          {editing ? (
            <>
              <Button type="button" className="tool-btn mag-glass-btn" onClick={() => void copyPrompt()}>
                {copied ? 'הועתק' : 'העתק פרומפט'}
              </Button>
              <Button type="button" className="tool-btn mag-glass-btn" onClick={() => inputRef.current?.click()}>
                {src ? 'החלפת תמונה' : 'העלאת תמונה'}
              </Button>
              {src && (
                <Button type="button" className="tool-btn mag-glass-btn" onClick={removeImage}>
                  הסרת תמונה
                </Button>
              )}
              <Button type="button" className="tool-btn mag-glass-btn" onClick={() => setEditing(false)}>
                שמור וסגור
              </Button>
            </>
          ) : (
            <Button type="button" className="tool-btn mag-glass-btn" onClick={() => setEditing(true)}>
              ערוך
            </Button>
          )}
        </div>

        {status === 'saving' && <p className="no-print mag-layer-note">שומר תמונה...</p>}
        {status === 'saved' && <p className="no-print mag-layer-note">התמונה נשמרה</p>}
        {status === 'local' && (
          <p className="no-print mag-layer-note">
            מצב קריאה בלבד — התמונה נשמרה במחשב זה בלבד. להזנת טוקן: <Link to="/settings">הגדרות</Link>
          </p>
        )}
        {status === 'error' && <p className="no-print mag-layer-note">שמירת התמונה נכשלה. {error}</p>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) readFile(file)
          event.target.value = ''
        }}
      />
    </section>
  )
}
