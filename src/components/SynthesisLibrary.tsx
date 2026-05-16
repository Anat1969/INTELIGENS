// src/components/SynthesisLibrary.tsx
// ספריית האינטליגנציות החדשות — מתחת לכל האפליקציה

import { useEffect, useState } from 'react'
import { fetchLibrary } from '@/lib/sqlite-store'
import { SynthesizedIntelligence } from '@/lib/gemini'
import LibraryCard from './LibraryCard'

export default function SynthesisLibrary() {
  const [library, setLibrary] = useState<SynthesizedIntelligence[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetchLibrary().then(data => {
      setLibrary(data)
      setLoading(false)
    })
  }, [])

  if (loading || library.length === 0) return null

  return (
    <section style={{
      marginTop:    '80px',
      paddingTop:   '48px',
      borderTop:    '1px solid var(--border)',
    }}>

      {/* כותרת סקשן */}
      <div style={{
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'baseline',
        marginBottom:   '32px',
      }}>
        <h2 style={{
          fontFamily:    '"DM Serif Display", serif',
          fontSize:      '24px',
          color:         'var(--text)',
          fontWeight:    400,
          letterSpacing: '-0.5px',
        }}>
          ספריית הגילויים
        </h2>
        <span style={{
          fontFamily:    '"DM Mono", monospace',
          fontSize:      '10px',
          letterSpacing: '2px',
          color:         'var(--text-muted)',
          textTransform: 'uppercase',
        }}>
          אינטליגנציות שנוצרו בסינתזה — מחוץ לתיאוריה המקורית
        </span>
      </div>

      {/* הסבר */}
      <p style={{
        fontFamily:   '"IBM Plex Sans Hebrew", "Heebo", sans-serif',
        fontSize:     '13px',
        color:        'var(--text-muted)',
        lineHeight:   1.7,
        marginBottom: '32px',
        maxWidth:     '600px',
        fontWeight:   300,
      }}>
        כל אינטליגנציה שמופיעה כאן נוצרה על-ידי משתמש שבחר צירוף ספציפי.
        היא לא חלק מתיאוריית גארדנר — היא נוצרה בשיחה בין כישורים קיימים.
      </p>

      {/* גריד הספריה — קטן יותר מהגריד הראשי */}
      <div style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap:                 '10px',
      }}>
        {library.map(item => (
          <LibraryCard
            key={item.source_ids.join('+')}
            intelligence={item}
            isExpanded={expanded === item.source_ids.join('+')}
            onToggle={() => setExpanded(
              expanded === item.source_ids.join('+')
                ? null
                : item.source_ids.join('+')
            )}
          />
        ))}
      </div>

    </section>
  )
}
