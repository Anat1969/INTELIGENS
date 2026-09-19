import { Printer } from 'lucide-react'

interface Props {
  className?: string
  note?: boolean
}

export function PrintButton({ className = '', note = true }: Props) {
  return (
    <div className={`no-print flex flex-col items-start gap-2 ${className}`}>
      <button
        type="button"
        onClick={() => window.print()}
        className="flex items-center gap-2 rounded-full px-4 py-2 font-mono-dm text-[11px] tracking-[0.12em] transition-opacity hover:opacity-70"
        style={{
          color: 'hsl(var(--foreground))',
          border: '1px solid hsla(var(--foreground), 0.18)',
          background: 'hsla(var(--foreground), 0.03)',
        }}
      >
        <Printer size={14} />
        הורד PDF (A4)
      </button>
      {note && (
        <p
          className="font-mono-dm text-[9px] tracking-[0.08em]"
          style={{ color: 'hsl(var(--text-dim))', opacity: 0.7 }}
        >
          נפתח חלון הדפסה — בחרו "שמירה כ-PDF"
        </p>
      )}
    </div>
  )
}
