// src/components/LibraryCard.tsx
// כרטיס קטן לספריה — לחיצה מרחיבה לפרטים מלאים

import { SynthesizedIntelligence } from '@/lib/gemini'

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
      style={{
        background:    'var(--surface)',
        border:        '1px dashed var(--border)',
        borderRadius:  '4px',
        padding:       isExpanded ? '24px 20px' : '18px 16px',
        cursor:        'pointer',
        transition:    'all 300ms ease',
        position:      'relative',
        overflow:      'hidden',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'rgba(124,106,247,0.4)'
        el.style.borderStyle = 'solid'
      }}
      onMouseLeave={e => {
        if (!isExpanded) {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = 'var(--border)'
          el.style.borderStyle = 'dashed'
        }
      }}
    >
      {/* תגית סינתזה */}
      <span style={{
        fontFamily:    '"DM Mono", monospace',
        fontSize:      '9px',
        letterSpacing: '2px',
        color:         'var(--text-muted)',
        textTransform: 'uppercase',
        display:       'block',
        marginBottom:  '10px',
      }}>
        סינתזה
      </span>

      {/* שם */}
      <h3 style={{
        fontFamily:   '"DM Serif Display", serif',
        fontSize:     '16px',
        color:        'var(--text)',
        marginBottom: '6px',
        lineHeight:   1.3,
        fontWeight:   400,
      }}>
        {name}
      </h3>

      {/* תת-כותרת */}
      <p style={{
        fontFamily:    '"DM Mono", monospace',
        fontSize:      '9px',
        letterSpacing: '1.5px',
        color:         'var(--text-muted)',
        textTransform: 'uppercase',
        marginBottom:  isExpanded ? '20px' : 0,
      }}>
        {type}
      </p>

      {/* תוכן מורחב */}
      {isExpanded && (
        <div style={{ animation: 'resultReveal 300ms ease forwards' }}>

          <div style={{
            height:       '1px',
            background:   'var(--border)',
            marginBottom: '16px',
          }} />

          <p style={{
            fontFamily:   '"IBM Plex Sans Hebrew", "Heebo", sans-serif',
            fontSize:     '12px',
            color:        'var(--text-dim)',
            lineHeight:   1.75,
            fontWeight:   300,
            marginBottom: '16px',
          }}>
            {essence}
          </p>

          {/* תפקידים */}
          <div style={{
            display:      'flex',
            flexWrap:     'wrap',
            gap:          '8px',
            marginBottom: '16px',
          }}>
            {roles.map(role => (
              <span key={role} style={{
                fontFamily:    '"DM Mono", monospace',
                fontSize:      '9px',
                letterSpacing: '1px',
                color:         'var(--accent3)',
                borderBottom:  '1px solid var(--accent3)',
                paddingBottom: '1px',
                opacity:       0.7,
              }}>
                {role}
              </span>
            ))}
          </div>

          {/* ציטוט */}
          <p style={{
            fontFamily:  '"DM Serif Display", serif',
            fontSize:    '13px',
            color:       'var(--text-dim)',
            fontStyle:   'italic',
            lineHeight:  1.6,
            borderRight: '2px solid var(--border)',
            paddingRight: '12px',
          }}>
            {quote}
          </p>

          {/* מקורות */}
          <p style={{
            fontFamily:    '"DM Mono", monospace',
            fontSize:      '9px',
            letterSpacing: '1px',
            color:         'var(--text-muted)',
            marginTop:     '14px',
            opacity:       0.5,
          }}>
            {source_ids.join(' + ')}
          </p>

        </div>
      )}

      {/* חץ מצב */}
      <span style={{
        position:   'absolute',
        bottom:     '14px',
        left:       '14px',
        fontFamily: '"DM Mono", monospace',
        fontSize:   '10px',
        color:      'var(--text-muted)',
        opacity:    0.4,
        transition: 'transform 200ms ease',
        transform:  isExpanded ? 'rotate(180deg)' : 'none',
      }}>
        ↓
      </span>

    </div>
  )
}
