import { SynthesizedIntelligence } from '@/lib/gemini'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  intelligence: SynthesizedIntelligence
  isExpanded: boolean
  onToggle: () => void
}

export default function LibraryCard({ intelligence, isExpanded, onToggle }: Props) {
  const { name, type, essence, roles, quote, source_ids } = intelligence

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
      <span
        className="font-mono-dm text-[9px] tracking-[0.15em] uppercase block mb-3"
        style={{ color: 'hsla(260, 70%, 65%, 0.5)' }}
      >
        סינתזה
      </span>

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
