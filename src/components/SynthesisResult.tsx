import { SynthesizedIntelligence, comboLabel } from '@/lib/synthesize'
import type { IntelligenceId } from '@/data/intelligences'
import { Copy, Check, Image, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Props {
  result: SynthesizedIntelligence
  isFromCache: boolean
  itemId?: string
}

function buildCopyText(result: SynthesizedIntelligence) {
  return `${result.name}
${result.type}

הגרעין:
${result.essence}

העוצמה:
${result.power}

תפקידים: ${result.roles.join(' · ')}

"${result.quote}"
${result.keyQuestion ? `\nשאלת מפתח: ${result.keyQuestion}` : ''}

נוצר ב-Intelligence Composer`.trim()
}

export default function SynthesisResult({ result, isFromCache, itemId }: Props) {
  const [copied, setCopied] = useState(false)
  const [visualCopied, setVisualCopied] = useState(false)
  const navigate = useNavigate()

  function handleCopy() {
    navigator.clipboard.writeText(buildCopyText(result))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleCopyVisual() {
    if (result.visualPrompt) {
      navigator.clipboard.writeText(result.visualPrompt)
      setVisualCopied(true)
      setTimeout(() => setVisualCopied(false), 2000)
    }
  }

  return (
    <div className="synthesis-result-card glass-card w-full max-w-[900px] mx-auto mt-10 p-8 md:p-12 text-right">

      {/* Source tag + actions */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span
            className="font-mono-dm text-[10px] tracking-[0.15em] px-3 py-1.5 rounded-lg"
            style={{
              background: isFromCache
                ? "hsla(200, 80%, 50%, 0.1)"
                : "hsla(260, 80%, 60%, 0.1)",
              color: isFromCache
                ? "hsla(200, 80%, 55%, 1)"
                : "hsla(260, 70%, 65%, 1)",
              border: `1px solid ${isFromCache ? "hsla(200, 80%, 50%, 0.15)" : "hsla(260, 80%, 60%, 0.15)"}`,
            }}
          >
            {isFromCache ? 'נשלפה מהספריה' : 'אינטליגנציה חדשה'}
          </span>

          {itemId && (
            <button
              onClick={() => navigate(`/intelligence/${itemId}`)}
              className="tool-btn"
            >
              <ExternalLink size={12} />
              צפה בדף המלא
            </button>
          )}
        </div>

        <button
          onClick={handleCopy}
          className="tool-btn"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'הועתק' : 'העתק'}
        </button>
      </div>

      {/* Name */}
      <h2
        className="font-serif-display leading-[1.15] tracking-[-0.02em]"
        style={{
          fontSize: 'clamp(36px, 5vw, 56px)',
          color: 'hsl(var(--foreground))',
        }}
      >
        {result.name}
      </h2>

      <p
        className="mt-3 font-mono-dm text-[12px] tracking-[0.15em] uppercase"
        style={{ color: 'hsl(var(--text-dim))' }}
      >
        {result.type}
      </p>

      <p
        className="mt-2 font-sans-he text-[14px]"
        style={{ color: 'hsla(var(--foreground), 0.8)' }}
      >
        נוצר מהצירוף: {comboLabel(result.source_ids as IntelligenceId[])}
      </p>

      <div
        className="mt-8 h-px w-full"
        style={{ background: 'linear-gradient(90deg, hsla(260, 70%, 60%, 0.3), hsla(200, 80%, 55%, 0.3), transparent)' }}
      />

      {/* Essence + Power */}
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <h4
            className="font-mono-dm text-[11px] tracking-[0.2em] uppercase mb-4"
            style={{ color: 'hsla(260, 70%, 65%, 0.8)' }}
          >
            הגרעין
          </h4>
          <p
            className="font-sans-he text-[15px] leading-[1.85]"
            style={{ color: 'hsl(var(--foreground))' }}
          >
            {result.essence}
          </p>
        </div>

        <div>
          <h4
            className="font-mono-dm text-[11px] tracking-[0.2em] uppercase mb-4"
            style={{ color: 'hsla(200, 80%, 60%, 0.8)' }}
          >
            העוצמה
          </h4>
          <p
            className="font-sans-he text-[15px] leading-[1.85]"
            style={{ color: 'hsl(var(--foreground))' }}
          >
            {result.power}
          </p>
        </div>
      </div>

      <div className="mt-8 h-px w-full" style={{ background: 'hsla(var(--foreground), 0.06)' }} />

      {/* Roles */}
      <div className="mt-8">
        <h4
          className="font-mono-dm text-[11px] tracking-[0.2em] uppercase mb-5"
          style={{ color: 'hsl(var(--text-dim))' }}
        >
          תפקידים שמתאימים לצירוף
        </h4>
        <div className="flex flex-wrap gap-3">
          {result.roles.map(role => (
            <span
              key={role}
              className="font-sans-he text-[13px] px-4 py-2 rounded-xl"
              style={{
                color: 'hsl(var(--foreground))',
                background: 'hsla(var(--foreground), 0.04)',
                border: '1px solid hsla(var(--foreground), 0.08)',
              }}
            >
              {role}
            </span>
          ))}
        </div>
      </div>

      {/* Quote */}
      <div
        className="mt-8 p-6 rounded-2xl"
        style={{
          background: 'hsla(var(--surface), 0.5)',
          borderRight: '3px solid hsla(260, 70%, 60%, 0.5)',
        }}
      >
        <p
          className="font-serif-display text-[18px] md:text-[20px] leading-[1.7] italic"
          style={{ color: 'hsl(var(--foreground))' }}
        >
          "{result.quote}"
        </p>
      </div>

      {/* Key Question */}
      {result.keyQuestion && (
        <div className="mt-6">
          <h4
            className="font-mono-dm text-[11px] tracking-[0.2em] uppercase mb-3"
            style={{ color: 'hsla(340, 70%, 60%, 0.8)' }}
          >
            שאלת מפתח
          </h4>
          <p
            className="font-sans-he text-[15px] leading-[1.9]"
            style={{ color: 'hsla(var(--foreground), 0.85)' }}
          >
            {result.keyQuestion}
          </p>
        </div>
      )}

      {/* Visual Prompt */}
      {result.visualPrompt && (
        <div className="mt-8">
          <div className="h-px w-full mb-6" style={{ background: 'hsla(var(--foreground), 0.06)' }} />
          <div className="flex items-center justify-between mb-4">
            <h4
              className="font-mono-dm text-[11px] tracking-[0.2em] uppercase flex items-center gap-2"
              style={{ color: 'hsla(170, 70%, 55%, 0.8)' }}
            >
              <Image size={14} />
              פרומפט ויזואלי
            </h4>
            <button
              onClick={handleCopyVisual}
              className="tool-btn"
            >
              {visualCopied ? <Check size={12} /> : <Copy size={12} />}
              {visualCopied ? 'הועתק' : 'העתק פרומפט'}
            </button>
          </div>
          <div
            className="p-5 rounded-xl"
            style={{
              background: 'hsla(170, 70%, 55%, 0.04)',
              border: '1px solid hsla(170, 70%, 55%, 0.12)',
              direction: 'ltr',
            }}
          >
            <p
              className="font-mono-dm text-[13px] leading-[1.85]"
              style={{ color: 'hsla(var(--foreground), 0.8)' }}
            >
              {result.visualPrompt}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
