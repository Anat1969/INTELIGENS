import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { hasToken } from '@/lib/gh-token'
import { saveImage } from '@/lib/github-store'
import {
  clearLocalImage,
  getLocalImage,
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
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'local' | 'error'

export function LayerSpread({ id, title, interpretation, visualPrompt, index }: Props) {
  const [src, setSrc] = useState<string | null>(null)
  const [editing, setEditing] = useState(true)
  const [copied, setCopied] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [status, setStatus] = useState<SaveStatus>('idle')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const loadImage = useCallback(async () => {
    const image = await resolvePrintImage(id)
    setSrc(image)
    setEditing(!image)
  }, [id])

  useEffect(() => {
    void loadImage()
    return onImageUpdated((updatedId) => {
      if (updatedId === id) void loadImage()
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

  const dropHandlers = {
    onDrop: (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      setDragOver(false)
      const file = event.dataTransfer.files[0]
      if (file) readFile(file)
    },
    onDragOver: (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      setDragOver(true)
    },
    onDragLeave: () => setDragOver(false),
  }

  return (
    <section className={cn('mag-spread', index % 2 === 1 && 'mag-spread--flip')}>
      <div className="mag-figure">
        {src ? (
          <img src={src} alt={title} />
        ) : editing ? (
          <div
            className={cn('mag-dropzone no-print', dragOver && 'mag-dropzone--active')}
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click()
            }}
            {...dropHandlers}
          >
            גררו תמונה לכאן, הדביקו (Ctrl+V) או לחצו להעלאה
          </div>
        ) : null}
      </div>

      <div className="mag-copy">
        <h2 className="mag-heading">{title}</h2>
        <p className="mag-body">{interpretation}</p>

        <div className="no-print mag-tools">
          {editing ? (
            <>
              <button type="button" className="tool-btn" onClick={() => void copyPrompt()}>
                {copied ? 'הועתק' : 'העתק פרומפט'}
              </button>
              <button type="button" className="tool-btn" onClick={() => inputRef.current?.click()}>
                {src ? 'החלפת תמונה' : 'העלאת תמונה'}
              </button>
              {src && (
                <button type="button" className="tool-btn" onClick={removeImage}>
                  הסרת תמונה
                </button>
              )}
              <button type="button" className="tool-btn" onClick={() => setEditing(false)}>
                שמור וסגור
              </button>
            </>
          ) : (
            <button type="button" className="tool-btn" onClick={() => setEditing(true)}>
              ערוך
            </button>
          )}
        </div>

        {status === 'saving' && <p className="no-print mag-status">שומר תמונה...</p>}
        {status === 'saved' && <p className="no-print mag-status">התמונה נשמרה</p>}
        {status === 'local' && (
          <p className="no-print mag-status">
            מצב קריאה בלבד — התמונה נשמרה במחשב זה בלבד. להזנת טוקן: <Link to="/settings">הגדרות</Link>
          </p>
        )}
        {status === 'error' && <p className="no-print mag-status">שמירת התמונה נכשלה. {error}</p>}
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