import { SynthesizedIntelligence } from '@/lib/synthesize'
import { ChevronDown, Copy, Check, Image } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface Props {
  intelligence: SynthesizedIntelligence
  isExpanded: boolean
  onToggle: () => void
}

export default function LibraryCard({ intelligence, isExpanded, onToggle }: Props) {
  const { name, type, essence, roles, quote, source_ids, visualPrompt, keyQuestion } = intelligence
  const [visualCopied, setVisualCopied] = useState(false)

  function handleCopyVisual(e: React.MouseEvent) {
    e.stopPropagation()
    if (visualPrompt) {
      navigator.clipboard.writeText(visualPrompt)
      setVisualCopied(true)
      setTimeout(() => setVisualCopied(false), 2000)
    }
  }

  return (
    <div
      onClick={onToggle}
      className={cn("library-card-3d cursor-pointer text-right", isExpanded && "expanded")}
      style={{
        background: isExpanded ? 'hsla(var(--surface), 0.8)' : 'hsla(var(--surface), 0.4)',
        border: isExpanded
          ? '1px solid hsla(260, 70%, 60%, 0.2)'
          : '1px solid hsla(var(--foreground), 0.06)',
        padding: isExpanded ? '24px 20px' : '20px 18px',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className="font-mono-dm text-[9px] tracking-[0.15em] uppercase block mb-3"
          style={{ color: 'hsla(260, 70%, 65%, 0.5)' }}
        >
          סינתזה · {source_ids.length}
        </span>
      </div>

      <h3
        className="font-serif-display text-[16px] leading-[1.3] mb-2"
        style={{ color: 'hsl(var(--foreground))' }}
      >
        {name}
      </h3>

      <p
        className="font-mono-dm text-[9px] tracking-[0.1em] uppercase"
        style={{ color: 'hsl(var(--text-dim))', marginBottom: isExpanded ? '20px' : 0 }}
      >
        {type}
      </p>

      {isExpanded && (
        <div style={{ animation: 'resultReveal 300ms ease forwards' }}>
          <div className="h-px w-full mb-4" style={{ background: 'hsla(var(--foreground), 0.06)' }} />

          <p
            className="font-sans-he text-[12px] leading-[1.8] mb-4"
            style={{ color: 'hsl(var(--text-dim))' }}
          >
            {essence}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {roles.map(role => (
              <span
                key={role}
                className="font-mono-dm text-[9px] tracking-[0.05em] px-2 py-1 rounded-md"
                style={{
                  color: 'hsla(260, 70%, 65%, 0.7)',
                  background: 'hsla(260, 70%, 60%, 0.06)',
                }}
              >
                {role}
              </span>
            ))}
          </div>

          <p
            className="font-serif-display text-[13px] italic leading-[1.6] pr-3 mb-3"
            style={{
              color: 'hsl(var(--text-dim))',
              borderRight: '2px solid hsla(260, 70%, 60%, 0.3)',
            }}
          >
            {quote}
          </p>

          {keyQuestion && (
            <p
              className="font-sans-he text-[11px] leading-[1.7] mb-3 pr-3"
              style={{
                color: 'hsla(340, 70%, 60%, 0.7)',
                borderRight: '2px solid hsla(340, 70%, 60%, 0.2)',
              }}
            >
              {keyQuestion}
            </p>
          )}

          {/* Visual Prompt Frame */}
          {visualPrompt && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span
                  className="font-mono-dm text-[8px] tracking-[0.15em] uppercase flex items-center gap-1.5"
                  style={{ color: 'hsla(170, 70%, 55%, 0.7)' }}
                >
                  <Image size={10} />
                  פרומפט ויזואלי
                </span>
                <button
                  onClick={handleCopyVisual}
                  className="flex items-center gap-1 font-mono-dm text-[8px] tracking-[0.1em] px-2 py-1 rounded-md transition-all duration-200 hover:opacity-70"
                  style={{
                    color: 'hsla(170, 70%, 55%, 0.7)',
                    background: 'hsla(170, 70%, 55%, 0.06)',
                    border: '1px solid hsla(170, 70%, 55%, 0.12)',
                  }}
                >
                  {visualCopied ? <Check size={9} /> : <Copy size={9} />}
                  {visualCopied ? 'הועתק' : 'העתק'}
                </button>
              </div>
              <div
                className="p-3 rounded-lg"
                style={{
                  background: 'hsla(170, 70%, 55%, 0.04)',
                  border: '1px solid hsla(170, 70%, 55%, 0.1)',
                  direction: 'ltr',
                }}
              >
                <p
                  className="font-mono-dm text-[10px] leading-[1.7]"
                  style={{ color: 'hsl(var(--text-dim))', opacity: 0.7 }}
                >
                  {visualPrompt}
                </p>
              </div>
            </div>
          )}

          <p
            className="font-mono-dm text-[9px] tracking-[0.05em] mt-3"
            style={{ color: 'hsl(var(--text-dim))', opacity: 0.4 }}
          >
            {source_ids.join(' + ')}
          </p>
        </div>
      )}

      <div className="absolute bottom-3 left-3">
        <ChevronDown
          size={12}
          className="transition-transform duration-200"
          style={{
            color: 'hsl(var(--text-dim))',
            opacity: 0.3,
            transform: isExpanded ? 'rotate(180deg)' : 'none',
          }}
        />
      </div>
    </div>
  )
}
