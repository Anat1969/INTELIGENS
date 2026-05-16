// src/components/SynthesisButton.tsx

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
  checking:   'בודק אם הצירוף כבר גולה ···',
  generating: 'מסנתז ···',
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

      // Try to save but don't fail if server not available
      try {
        await saveNew(generated)
      } catch (e) {
        console.warn('Could not save to database:', e)
      }

      setResult(generated)
      setPhase('done')
    } catch (error) {
      console.error('Synthesis error:', error)
      setErrorMessage(error instanceof Error ? error.message : 'שגיאה לא ידועה')
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
            background:    canSynthesize ? 'hsl(var(--surface))' : 'transparent',
            border:        canSynthesize ? '2px solid hsl(var(--foreground))' : '2px solid hsl(var(--border))',
            color:         canSynthesize ? 'hsl(var(--foreground))' : 'hsl(var(--text-dim))',
            fontFamily:    '"IBM Plex Sans Hebrew", "Heebo", sans-serif',
            fontSize:      '16px',
            fontStyle:     'italic',
            padding:       '16px 40px',
            borderRadius:  '4px',
            cursor:        canSynthesize ? 'pointer' : 'not-allowed',
            letterSpacing: '0.3px',
            transition:    'all 200ms ease',
            fontWeight:    500,
          }}
          onMouseEnter={e => {
            if (canSynthesize) {
              e.currentTarget.style.opacity = '0.8';
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          {canSynthesize
            ? 'סנתז אינטליגנציה חדשה  →'
            : 'בחר לפחות שתי אינטליגנציות'}
        </button>
      ) : phase === 'error' ? (
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontFamily:    '"DM Mono", monospace',
            fontSize:      '15px',
            letterSpacing: '2px',
            color:         'hsl(var(--destructive))',
            fontWeight:    600,
            marginBottom:  '12px',
          }}>
            ⚠️ שגיאה בסינתזה
          </p>
          <p style={{
            fontFamily:    '"DM Mono", monospace',
            fontSize:      '13px',
            color:         'hsl(var(--foreground))',
            marginBottom:  '8px',
            direction:     'ltr',
            maxWidth:      '500px',
            margin:        '0 auto 8px',
          }}>
            {errorMessage || 'שגיאה לא ידועה'}
          </p>
          <p style={{
            fontFamily:    '"DM Mono", monospace',
            fontSize:      '12px',
            color:         'hsl(var(--text-dim))',
          }}>
            בדוק את Console (F12) לפרטים
          </p>
          <button
            onClick={handleSynthesize}
            style={{
              marginTop:    '12px',
              background:   'none',
              border:       '1px solid hsl(var(--foreground))',
              color:        'hsl(var(--foreground))',
              fontFamily:   '"DM Mono", monospace',
              fontSize:     '13px',
              padding:      '8px 16px',
              cursor:       'pointer',
              borderRadius: '3px',
              transition:   'opacity 200ms',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            נסה שוב
          </button>
        </div>
      ) : (
        <p style={{
          fontFamily:    '"DM Mono", monospace',
          fontSize:      '15px',
          letterSpacing: '2px',
          color:         'hsl(var(--foreground))',
          animation:     'pulse 1.4s ease-in-out infinite',
          fontWeight:    600,
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
