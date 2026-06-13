import { useState } from 'react'
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

const LOADING_MESSAGES: Record<string, string> = {
  checking:   'בודק אם הצירוף כבר גולה',
  generating: 'מסנתז אינטליגנציה חדשה',
}

export default function SynthesisButton({ selected }: Props) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [result, setResult] = useState<SynthesizedIntelligence | null>(null)
  const [isFromCache, setIsFromCache] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const canSynthesize = selected.length >= 2

  async function handleSynthesize() {
    if (!canSynthesize) return

    setPhase('checking')
    setResult(null)

    try {
      const existing = await findExisting(selected.map(i => i.id))

      if (existing) {
        setResult(existing)
        setIsFromCache(true)
        setPhase('done')
        return
      }

      setPhase('generating')
      setIsFromCache(false)

      const generated = await synthesizeIntelligence(selected)

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

  if (phase === 'done' && result) {
    const resultKey = result.source_ids.slice().sort().join('+')
    const selectedKey = selected.map(i => i.id).sort().join('+')
    if (resultKey !== selectedKey) {
      setPhase('idle')
      setResult(null)
    }
  }

  return (
    <div className="mt-4 flex flex-col items-center">

      {phase === 'idle' || phase === 'done' ? (
        <button
          onClick={handleSynthesize}
          disabled={!canSynthesize}
          className="synthesis-btn font-sans-he"
        >
          {canSynthesize
            ? 'סנתז אינטליגנציה חדשה  →'
            : 'בחר לפחות שתי אינטליגנציות'}
        </button>
      ) : phase === 'error' ? (
        <div className="text-center max-w-[500px]">
          <div
            className="glass-card rounded-2xl p-8"
            style={{ borderColor: "hsla(0, 70%, 50%, 0.2)" }}
          >
            <p className="font-mono-dm text-[14px] tracking-[0.1em] mb-3" style={{ color: "hsl(var(--destructive))" }}>
              שגיאה בסינתזה
            </p>
            <p className="font-mono-dm text-[12px] mb-2 dir-ltr" style={{ color: "hsl(var(--foreground))", direction: "ltr" }}>
              {errorMessage || 'שגיאה לא ידועה'}
            </p>
            <p className="font-mono-dm text-[11px] mb-4" style={{ color: "hsl(var(--text-dim))" }}>
              בדוק את Console (F12) לפרטים
            </p>
            <button
              onClick={handleSynthesize}
              className="font-mono-dm text-[12px] px-5 py-2.5 rounded-xl transition-all duration-200 hover:opacity-70"
              style={{
                color: "hsl(var(--foreground))",
                border: "1px solid hsla(var(--foreground), 0.15)",
                background: "hsla(var(--surface), 0.5)",
              }}
            >
              נסה שוב
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="relative flex items-center justify-center">
            <div className="loading-orb" />
            <div className="loading-ring" />
          </div>
          <p
            className="font-mono-dm text-[13px] tracking-[0.15em]"
            style={{ color: "hsl(var(--text-dim))" }}
          >
            {LOADING_MESSAGES[phase]}
          </p>
        </div>
      )}

      {phase === 'done' && result && (
        <SynthesisResult result={result} isFromCache={isFromCache} />
      )}
    </div>
  )
}
