import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { composeIntelligence, comboLabel, SynthesizedIntelligence } from '@/lib/synthesize'
import type { IntelligenceId } from '@/data/intelligences'
import { addToLibrary, getLibrary } from '@/lib/local-library'
import { hasToken } from '@/lib/gh-token'
import { saveMerge } from '@/lib/github-store'
import SynthesisResult from './SynthesisResult'

interface Intelligence {
  id: string
  name: string
  domain: string
  description: string
}

interface Props {
  selected: Intelligence[]
  onNewSynthesis?: () => void
}

type Phase = 'idle' | 'done' | 'error'
type SaveState = 'none' | 'saving' | 'saved' | 'failed' | 'readonly'

export default function SynthesisButton({ selected, onNewSynthesis }: Props) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [result, setResult] = useState<SynthesizedIntelligence | null>(null)
  const [resultId, setResultId] = useState<string>('')
  const [isFromCache, setIsFromCache] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [saveState, setSaveState] = useState<SaveState>('none')
  const [saveError, setSaveError] = useState<string>('')
  const resultRef = useRef<HTMLDivElement>(null)
  const prevKeyRef = useRef<string>('')

  const canSynthesize = selected.length >= 2
  const selectedKey = selected.map(i => i.id).sort().join('+')

  useEffect(() => {
    if (selectedKey !== prevKeyRef.current) {
      prevKeyRef.current = selectedKey
      if (phase === 'done' || phase === 'error') {
        setPhase('idle')
        setResult(null)
        setResultId('')
        setErrorMessage('')
        setSaveState('none')
        setSaveError('')
      }
    }
  }, [selectedKey, phase])

  useEffect(() => {
    if (phase === 'done' && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [phase])

  function handleSynthesize() {
    if (!canSynthesize) return

    setResult(null)
    setResultId('')
    setIsFromCache(false)
    setSaveError('')

    try {
      const ids = selected.map(i => i.id as IntelligenceId)
      const composed = composeIntelligence(ids)
      const sorted = [...composed.source_ids].sort()
      const stableId = sorted.join('-')
      const key = sorted.join('+')
      const existed = getLibrary().some(
        i => [...i.source_ids].sort().join('+') === key,
      )
      addToLibrary(composed, stableId)
      setIsFromCache(existed)
      setResultId(stableId)
      setResult(composed)
      setPhase('done')
      onNewSynthesis?.()

      if (hasToken()) {
        setSaveState('saving')
        saveMerge({
          ...composed,
          id: stableId,
          created_at: new Date().toISOString(),
          date: new Date().toISOString(),
          combo: comboLabel(sorted as IntelligenceId[]),
        })
          .then(() => {
            setSaveState('saved')
            onNewSynthesis?.()
          })
          .catch((err: unknown) => {
            setSaveState('failed')
            setSaveError(err instanceof Error ? err.message : 'השמירה למאגר נכשלה')
          })
      } else {
        setSaveState('readonly')
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'שגיאה לא ידועה')
      setPhase('error')
    }
  }

  let promptText = 'בחר לפחות שתי אינטליגנציות'
  if (selected.length === 1) promptText = 'בחר עוד אינטליגנציה אחת לפחות'
  if (selected.length === 2) promptText = 'סנתז את הכישור שנוצר →'
  if (selected.length === 3) promptText = 'סנתז את המשולש שנוצר →'
  if (selected.length >= 4) promptText = 'סנתז את הכישור הרב-ממדי →'

  return (
    <div className="flex flex-col items-center">
      <div className="py-10 flex flex-col items-center gap-6">
        {phase === 'error' ? (
          <div className="text-center max-w-[500px]">
            <div
              className="glass-card rounded-2xl p-8"
              style={{ borderColor: 'hsla(0, 70%, 50%, 0.2)' }}
            >
              <p className="font-mono-dm text-[14px] tracking-[0.1em] mb-3" style={{ color: 'hsl(var(--destructive))' }}>
                שגיאה בסינתזה
              </p>
              <p className="font-mono-dm text-[12px] mb-4" style={{ color: 'hsl(var(--foreground))', direction: 'ltr' }}>
                {errorMessage || 'שגיאה לא ידועה'}
              </p>
              <button
                onClick={handleSynthesize}
                className="font-mono-dm text-[12px] px-5 py-2.5 rounded-xl transition-all duration-200 hover:opacity-70"
                style={{
                  color: 'hsl(var(--foreground))',
                  border: '1px solid hsla(var(--foreground), 0.15)',
                  background: 'hsla(var(--surface), 0.5)',
                }}
              >
                נסה שוב
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleSynthesize}
            disabled={!canSynthesize}
            className="synthesis-btn font-sans-he"
          >
            {promptText}
          </button>
        )}

        {phase === 'done' && saveState !== 'none' && (
          <p
            className="font-sans-he text-[13px] text-center max-w-[560px] leading-[1.8]"
            style={{ color: 'hsla(var(--foreground), 0.8)' }}
          >
            {saveState === 'saving' && 'שומר למאגר...'}
            {saveState === 'saved' && 'נשמר למאגר'}
            {saveState === 'failed' && (saveError || 'השמירה למאגר נכשלה')}
            {saveState === 'readonly' && (
              <>
                מצב קריאה בלבד — המיזוג לא נשמר למאגר הציבורי. להזנת טוקן:{' '}
                <Link to="/settings" className="underline">הגדרות</Link>
              </>
            )}
          </p>
        )}
      </div>

      <div ref={resultRef}>
        {phase === 'done' && result && (
          <SynthesisResult result={result} isFromCache={isFromCache} itemId={resultId} />
        )}
      </div>
    </div>
  )
}
