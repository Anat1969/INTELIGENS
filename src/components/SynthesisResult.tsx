// src/components/SynthesisResult.tsx

import { SynthesizedIntelligence } from '@/lib/gemini'

interface Props {
  result: SynthesizedIntelligence
  isFromCache: boolean
}

function copyToClipboard(result: SynthesizedIntelligence) {
  const text = `
${result.name}
${result.type}

הגרעין:
${result.essence}

העוצמה:
${result.power}

תפקידים: ${result.roles.join(' · ')}

"${result.quote}"

נוצר ב-Intelligence Composer — סינתזה
  `.trim()

  navigator.clipboard.writeText(text)
}

export default function SynthesisResult({ result, isFromCache }: Props) {
  return (
    <div style={{
      background:   'hsl(var(--background))',
      border:       '1px solid hsl(var(--border))',
      borderRadius: '8px',
      padding:      '40px',
      marginTop:    '32px',
      position:     'relative',
      overflow:     'hidden',
      animation:    'resultReveal 500ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
      textAlign:    'right',
    }}>

      {/* פס עליון — גרדיאנט */}
      <div style={{
        position:   'absolute',
        top: 0, right: 0, left: 0,
        height:     '2px',
        background: 'linear-gradient(90deg, hsl(var(--accent)), hsl(var(--accent2)))',
      }} />

      {/* תגית מקור */}
      <p style={{
        fontFamily:    '"DM Mono", monospace',
        fontSize:      '10px',
        letterSpacing: '2px',
        color:         'hsl(var(--accent))',
        borderBottom:  '1px dashed hsl(var(--accent))',
        display:       'inline-block',
        marginBottom:  '24px',
        paddingBottom: '2px',
        opacity:       0.8,
      }}>
        {isFromCache
          ? 'אינטליגנציה שכבר גולתה — נשלפה מהספריה'
          : 'אינטליגנציה חדשה — לא הוגדרה עדיין'}
      </p>

      {/* שם */}
      <h2 style={{
        fontFamily:    '"DM Serif Display", serif',
        fontSize:      'clamp(28px, 4vw, 44px)',
        color:         'hsl(var(--foreground))',
        marginBottom:  '6px',
        lineHeight:    1.2,
        letterSpacing: '-0.5px',
      }}>
        {result.name}
      </h2>

      {/* תת-כותרת */}
      <p style={{
        fontFamily:    '"DM Mono", monospace',
        fontSize:      '11px',
        letterSpacing: '2px',
        color:         'hsl(var(--accent))',
        marginBottom:  '32px',
        textTransform: 'uppercase',
      }}>
        {result.type}
      </p>

      <div style={{
        height:     '1px',
        background: 'hsl(var(--border))',
        marginBottom: '28px',
      }} />

      {/* גרעין + עוצמה */}
      <div style={{
        display:             'grid',
        gridTemplateColumns: '1fr 1fr',
        gap:                 '32px',
        marginBottom:        '28px',
      }}>
        <div>
          <h4 style={{
            fontFamily:    '"DM Mono", monospace',
            fontSize:      '10px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color:         'hsl(var(--accent2))',
            marginBottom:  '12px',
          }}>
            הגרעין
          </h4>
          <p style={{
            fontFamily:  '"IBM Plex Sans Hebrew", "Heebo", sans-serif',
            fontSize:    '14px',
            color:       'hsl(var(--text-dim))',
            lineHeight:  1.8,
            fontWeight:  300,
          }}>
            {result.essence}
          </p>
        </div>

        <div>
          <h4 style={{
            fontFamily:    '"DM Mono", monospace',
            fontSize:      '10px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color:         'hsl(var(--accent2))',
            marginBottom:  '12px',
          }}>
            העוצמה
          </h4>
          <p style={{
            fontFamily:  '"IBM Plex Sans Hebrew", "Heebo", sans-serif',
            fontSize:    '14px',
            color:       'hsl(var(--text-dim))',
            lineHeight:  1.8,
            fontWeight:  300,
          }}>
            {result.power}
          </p>
        </div>
      </div>

      <div style={{ height: '1px', background: 'hsl(var(--border))', marginBottom: '24px' }} />

      {/* תפקידים */}
      <div style={{ marginBottom: '28px' }}>
        <h4 style={{
          fontFamily:    '"DM Mono", monospace',
          fontSize:      '10px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color:         'hsl(var(--accent3))',
          marginBottom:  '14px',
        }}>
          תפקידים שמתאימים לצירוף
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {result.roles.map(role => (
            <span key={role} style={{
              fontFamily:    '"DM Mono", monospace',
              fontSize:      '11px',
              letterSpacing: '1px',
              color:         'hsl(var(--accent3))',
              borderBottom:  '1px solid hsl(var(--accent3))',
              paddingBottom: '2px',
              opacity:       0.8,
            }}>
              {role}
            </span>
          ))}
        </div>
      </div>

      {/* ציטוט */}
      <div style={{
        padding:       '20px 24px',
        borderRight:   '2px solid hsl(var(--accent))',
        background:    'rgba(124,106,247,0.04)',
        marginBottom:  '28px',
      }}>
        <p style={{
          fontFamily:  '"DM Serif Display", serif',
          fontSize:    '17px',
          color:       'hsl(var(--foreground))',
          lineHeight:  1.7,
          fontStyle:   'italic',
          fontWeight:  300,
        }}>
          {result.quote}
        </p>
      </div>

      {/* העתקה */}
      <button
        onClick={() => copyToClipboard(result)}
        style={{
          background:    'none',
          border:        'none',
          fontFamily:    '"DM Mono", monospace',
          fontSize:      '11px',
          letterSpacing: '1.5px',
          color:         'hsl(var(--text-muted))',
          cursor:        'pointer',
          padding:       0,
          transition:    'color 200ms ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'hsl(var(--text-dim))')}
        onMouseLeave={e => (e.currentTarget.style.color = 'hsl(var(--text-muted))')}
      >
        העתק את האינטליגנציה
      </button>

    </div>
  )
}
