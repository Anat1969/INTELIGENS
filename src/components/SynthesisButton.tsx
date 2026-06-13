import { useState, useEffect, useRef } from 'react'
import { synthesizeIntelligence, SynthesizedIntelligence } from '@/lib/gemini'
import { findExisting, saveNew } from '@/lib/sqlite-store'
import SynthesisResult from './SynthesisResult'

interface Intelligence {
  id: string
  name: string
  domain: string
  description: string
}

interface Props {
  selected: Intelligence[]
}

type Phase = 'idle' | 'checking' | 'generating' | 'done' | 'error'

export default function SynthesisButton({ selected }: Props) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [result, setResult] = useState<SynthesizedIntelligence | null>(null)
  const [isFromCache, setIsFromCache] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const resultRef = useRef<HTMLDivElement>(null)
  const prevKeyRef = useRef<string>('')

  const canSynthesize = selected.length >= 2
  const selectedKey = selected.map(i => i.id).sort().join('+')

  // Reset when selection changes
  useEffect(() => {
    if (selectedKey !== prevKeyRef.current) {
      prevKeyRef.current = selectedKey
      if (phase === 'done' || phase === 'error') {
        setPhase('idle')
        setResult(null)
        setErrorMessage('')
      }
    }
  }, [selectedKey, phase])

  // Scroll to result
  useEffect(() => {
    if (phase === 'done' && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [phase])

  async function handleSynthesize() {
    if (!canSynthesize) return

    setPhase('checking')
    setResult(null)
    setIsFromCache(false)

    try {
      // Check cache first
      let existing: SynthesizedIntelligence | null = null
      try {
        existing = await findExisting(selected.map(i => i.id))
      } catch {
        // Server unavailable — proceed to generate
      }

      if (existing) {
        setResult(existing)
        setIsFromCache(true)
        setPhase('done')
        return
      }

      // Generate with Gemini
      setPhase('generating')

      const generated = await synthesizeIntelligence(selected)

      // Try to save but don't block
      try {
        await saveNew(generated)
      } catch {
        // graceful degradation
      }

      setResult(generated)
      setPhase('done')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'שגיאה לא ידועה')
      setPhase('error')
    }
  }

  // Prompt text based on selection count
  let promptText = 'בחר לפחות שתי אינטליגנציות'
  if (selected.length === 1) promptText = 'בחר עוד אינטליגנציה אחת לפחות'
  if (selected.length === 2) promptText = 'סנתז את הכישור שנוצר →'
  if (selected.length === 3) promptText = 'סנתז את המשולש שנוצר →'
  if (selected.length >= 4) promptText = 'סנתז את הכישור הרב-ממדי →'

  return (
    <div className="flex flex-col items-center">

      {/* Main action area */}
      <div className="py-10 flex flex-col items-center gap-6">
        {phase === 'idle' || phase === 'done' ? (
          <button
            onClick={handleSynthesize}
            disabled={!canSynthesize}
            className="synthesis-btn font-sans-he"
          >
            {promptText}
          </button>
        ) : phase === 'error' ? (
          <div className="text-center max-w-[500px]">
            <div
              className="glass-card rounded-2xl p-8"
              style={{ borderColor: 'hsla(0, 70%, 50%, 0.2)' }}
            >
              <p className="font-mono-dm text-[14px] tracking-[0.1em] mb-3" style={{ color: 'hsl(var(--destructive))' }}>
                שגיאה בסינתזה
              </p>
              <p className="font-mono-dm text-[12px] mb-2" style={{ color: 'hsl(var(--foreground))', direction: 'ltr' }}>
                {errorMessage || 'שגיאה לא ידועה'}
              </p>
              <p className="font-mono-dm text-[11px] mb-4" style={{ color: 'hsl(var(--text-dim))' }}>
                בדוק את Console (F12) לפרטים
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
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="relative flex items-center justify-center">
              <div className="loading-orb" />
              <div className="loading-ring" />
            </div>
            <p
              className="font-mono-dm text-[13px] tracking-[0.15em]"
              style={{ color: 'hsl(var(--text-dim))' }}
            >
              {phase === 'checking' ? 'בודק אם הצירוף כבר גולה' : 'מסנתז אינטליגנציה חדשה — זה יכול לקחת כמה שניות'}
            </p>
          </div>
        )}
      </div>

      {/* Result */}
      <div ref={resultRef}>
        {phase === 'done' && result && (
          <SynthesisResult result={result} isFromCache={isFromCache} />
        )}
      </div>
    </div>
  )
}
