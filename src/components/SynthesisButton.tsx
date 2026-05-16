// src/components/SynthesisButton.tsx

import { useState } from 'react'
import { synthesizeIntelligence, SynthesizedIntelligence } from '@/lib/gemini'
import { findExisting, saveNew } from '@/lib/synthesis-store'
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
  checking:   'בודק אם הצירוף כבר גולה ···',
  generating: 'מסנתז ···',
}

export default function SynthesisButton({ selected }: Props) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [result, setResult] = useState<SynthesizedIntelligence | null>(null)
  const [isFromCache, setIsFromCache] = useState(false)

  const canSynthesize = selected.length >= 2

  async function handleSynthesize() {
    if (!canSynthesize) return

    setPhase('checking')
    setResult(null)

    try {
      // בדיקה במאגר קודם
      const existing = await findExisting(selected.map(i => i.id))

      if (existing) {
        setResult(existing)
        setIsFromCache(true)
        setPhase('done')
        return
      }

      // אין במאגר — נוצר עם Gemini
      setPhase('generating')
      setIsFromCache(false)

      const generated = await synthesizeIntelligence(selected)
      await saveNew(generated)

      setResult(generated)
      setPhase('done')
    } catch (error) {
      console.error('Synthesis error:', error)
      setPhase('error')
    }
  }

  // איפוס כאשר הבחירה משתנה
  if (phase === 'done' && result) {
    const resultKey = result.source_ids.slice().sort().join('+')
    const selectedKey = selected.map(i => i.id).sort().join('+')
    if (resultKey !== selectedKey) {
      setPhase('idle')
      setResult(null)
    }
  }

  return (
    <div style={{ marginTop: '12px', textAlign: 'center' }}>

      {phase === 'idle' || phase === 'done' ? (
        <button
          onClick={handleSynthesize}
          disabled={!canSynthesize}
          style={{
            background:    'none',
            border:        canSynthesize ? '1px solid hsl(var(--border-selected))' : '1px solid hsl(var(--border))',
            color:         canSynthesize ? 'hsl(var(--text-dim))' : 'hsl(var(--text-muted))',
            fontFamily:    '"IBM Plex Sans Hebrew", "Heebo", sans-serif',
            fontSize:      '14px',
            fontStyle:     'italic',
            padding:       '14px 36px',
            borderRadius:  '2px',
            cursor:        canSynthesize ? 'pointer' : 'not-allowed',
            letterSpacing: '0.3px',
            transition:    'all 200ms ease',
          }}
        >
          {canSynthesize
            ? 'סנתז אינטליגנציה חדשה  →'
            : 'בחר לפחות שתי אינטליגנציות'}
        </button>
      ) : phase === 'error' ? (
        <p style={{
          fontFamily:    '"DM Mono", monospace',
          fontSize:      '13px',
          letterSpacing: '2px',
          color:         'hsl(var(--destructive))',
        }}>
          שגיאה בסינתזה — נסה שוב
        </p>
      ) : (
        <p style={{
          fontFamily:    '"DM Mono", monospace',
          fontSize:      '13px',
          letterSpacing: '2px',
          color:         'hsl(var(--text-dim))',
          animation:     'pulse 1.4s ease-in-out infinite',
        }}>
          {LOADING_MESSAGES[phase]}
        </p>
      )}

      {phase === 'done' && result && (
        <SynthesisResult result={result} isFromCache={isFromCache} />
      )}

    </div>
  )
}
