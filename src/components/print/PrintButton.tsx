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
        className="tool-btn"
      >
        <Printer size={14} />
        הורד PDF (A4)
      </button>
      {note && (
        <p
          className="font-mono-dm text-[11px] tracking-[0.08em]"
          style={{ color: 'hsl(var(--text-dim))' }}
        >
          נפתח חלון הדפסה — בחרו "שמירה כ-PDF"
        </p>
      )}
    </div>
  )
}
