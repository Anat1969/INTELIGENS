// src/components/LibraryCard.tsx

import { SynthesizedIntelligence } from '@/lib/gemini'

interface Props {
  synthesis: SynthesizedIntelligence
}

export default function LibraryCard({ synthesis }: Props) {
  const handleCopy = () => {
    const text = `
${synthesis.name}
${synthesis.type}

הגרעין:
${synthesis.essence}

העוצמה:
${synthesis.power}

תפקידים: ${synthesis.roles.join(' · ')}

"${synthesis.quote}"
    `.trim()
    navigator.clipboard.writeText(text)
  }

  return (
    <div style={{
      background: 'hsl(var(--background))',
      border: '1px solid hsl(var(--border))',
      borderRadius: '8px',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 200ms ease',
      cursor: 'pointer',
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLDivElement).style.borderColor = 'hsl(var(--accent))'
      ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLDivElement).style.borderColor = 'hsl(var(--border))'
      ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
    }}>
      {/* פס עליון */}
      <div style={{
        position: 'absolute',
        top: 0, right: 0, left: 0,
        height: '2px',
        background: 'linear-gradient(90deg, hsl(var(--accent)), hsl(var(--accent2)))',
      }} />

      {/* שם */}
      <h3 style={{
        fontFamily: '"DM Serif Display", serif',
        fontSize: '20px',
        color: 'hsl(var(--foreground))',
        marginBottom: '4px',
        marginTop: '8px',
        lineHeight: 1.2,
      }}>
        {synthesis.name}
      </h3>

      {/* תת-כותרת */}
      <p style={{
        fontFamily: '"DM Mono", monospace',
        fontSize: '9px',
        letterSpacing: '1.5px',
        color: 'hsl(var(--accent))',
        marginBottom: '12px',
        textTransform: 'uppercase',
      }}>
        {synthesis.type}
      </p>

      <div style={{
        height: '1px',
        background: 'hsl(var(--border))',
        marginBottom: '12px',
      }} />

      {/* גרעין קצר */}
      <p style={{
        fontFamily: '"IBM Plex Sans Hebrew", "Heebo", sans-serif',
        fontSize: '13px',
        color: 'hsl(var(--text-dim))',
        lineHeight: 1.6,
        marginBottom: '12px',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {synthesis.essence}
      </p>

      {/* תפקידים */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        marginBottom: '12px',
      }}>
        {synthesis.roles.slice(0, 2).map(role => (
          <span key={role} style={{
            fontFamily: '"DM Mono", monospace',
            fontSize: '9px',
            letterSpacing: '0.5px',
            color: 'hsl(var(--accent3))',
            borderBottom: '1px solid hsl(var(--accent3))',
            paddingBottom: '1px',
            opacity: 0.8,
          }}>
            {role}
          </span>
        ))}
        {synthesis.roles.length > 2 && (
          <span style={{
            fontFamily: '"DM Mono", monospace',
            fontSize: '9px',
            letterSpacing: '0.5px',
            color: 'hsl(var(--text-dim))',
            opacity: 0.6,
          }}>
            +{synthesis.roles.length - 2}
          </span>
        )}
      </div>

      {/* ציטוט */}
      <p style={{
        fontFamily: '"DM Serif Display", serif',
        fontSize: '12px',
        color: 'hsl(var(--text-dim))',
        lineHeight: 1.5,
        fontStyle: 'italic',
        fontWeight: 300,
        marginBottom: '12px',
        display: '-webkit-box',
        WebkitLineClamp: 1,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        "{synthesis.quote}"
      </p>

      {/* כפתור העתקה */}
      <button
        onClick={handleCopy}
        style={{
          background: 'none',
          border: 'none',
          fontFamily: '"DM Mono", monospace',
          fontSize: '9px',
          letterSpacing: '1px',
          color: 'hsl(var(--text-muted))',
          cursor: 'pointer',
          padding: 0,
          transition: 'color 200ms ease',
          textTransform: 'uppercase',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = 'hsl(var(--text-dim))'
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = 'hsl(var(--text-muted))'
        }}
      >
        העתק
      </button>
    </div>
  )
}
