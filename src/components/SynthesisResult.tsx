import { SynthesizedIntelligence } from '@/lib/gemini'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface Props {
  result: SynthesizedIntelligence
  isFromCache: boolean
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

export default function SynthesisResult({ result, isFromCache }: Props) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(buildCopyText(result))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="synthesis-result-card glass-card w-full max-w-[900px] mx-auto mt-10 p-8 md:p-12 text-right">

      {/* Source tag */}
      <div className="flex items-center justify-between mb-8">
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

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 font-mono-dm text-[10px] tracking-[0.1em] px-3 py-1.5 rounded-lg transition-all duration-200 hover:opacity-70"
          style={{
            color: "hsl(var(--text-dim))",
            background: "hsla(var(--foreground), 0.04)",
          }}
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

      {/* Subtitle */}
      <p
        className="mt-3 font-mono-dm text-[12px] tracking-[0.15em] uppercase"
        style={{ color: 'hsl(var(--text-dim))' }}
      >
        {result.type}
      </p>

      {/* Divider */}
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

      {/* Divider */}
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
            className="font-sans-he text-[15px] leading-[1.8]"
            style={{ color: 'hsl(var(--text-dim))' }}
          >
            {result.keyQuestion}
          </p>
        </div>
      )}
    </div>
  )
}
