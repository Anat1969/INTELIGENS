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
        fontSize:      'clamp(36px, 5vw, 52px)',
        color:         'hsl(var(--foreground))',
        marginBottom:  '8px',
        lineHeight:    1.2,
        letterSpacing: '-0.5px',
      }}>
        {result.name}
      </h2>

      {/* תת-כותרת */}
      <p style={{
        fontFamily:    '"DM Mono", monospace',
        fontSize:      '13px',
        letterSpacing: '2px',
        color:         'hsl(var(--foreground))',
        marginBottom:  '32px',
        textTransform: 'uppercase',
        fontWeight:    500,
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
            fontSize:      '12px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color:         'hsl(var(--foreground))',
            marginBottom:  '16px',
            fontWeight:    600,
          }}>
            הגרעין
          </h4>
          <p style={{
            fontFamily:  '"IBM Plex Sans Hebrew", "Heebo", sans-serif',
            fontSize:    '16px',
            color:       'hsl(var(--foreground))',
            lineHeight:  1.8,
            fontWeight:  400,
          }}>
            {result.essence}
          </p>
        </div>

        <div>
          <h4 style={{
            fontFamily:    '"DM Mono", monospace',
            fontSize:      '12px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color:         'hsl(var(--foreground))',
            marginBottom:  '16px',
            fontWeight:    600,
          }}>
            העוצמה
          </h4>
          <p style={{
            fontFamily:  '"IBM Plex Sans Hebrew", "Heebo", sans-serif',
            fontSize:    '16px',
            color:       'hsl(var(--foreground))',
            lineHeight:  1.8,
            fontWeight:  400,
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
          fontSize:      '12px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color:         'hsl(var(--foreground))',
          marginBottom:  '16px',
          fontWeight:    600,
        }}>
          תפקידים שמתאימים לצירוף
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {result.roles.map(role => (
            <span key={role} style={{
              fontFamily:    '"IBM Plex Sans Hebrew", "Heebo", sans-serif',
              fontSize:      '14px',
              color:         'hsl(var(--foreground))',
              borderBottom:  '2px solid hsl(var(--foreground))',
              paddingBottom: '4px',
              fontWeight:    500,
            }}>
              {role}
            </span>
          ))}
        </div>
      </div>

      {/* ציטוט */}
      <div style={{
        padding:       '24px 28px',
        borderRight:   '3px solid hsl(var(--foreground))',
        background:    'hsl(var(--surface))',
        marginBottom:  '28px',
      }}>
        <p style={{
          fontFamily:  '"DM Serif Display", serif',
          fontSize:    '19px',
          color:       'hsl(var(--foreground))',
          lineHeight:  1.7,
          fontStyle:   'italic',
          fontWeight:  400,
        }}>
          "{result.quote}"
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
