// src/components/SynthesisLibrary.tsx

import { useEffect, useState } from 'react'
import { fetchLibrary } from '@/lib/synthesis-store'
import { SynthesizedIntelligence } from '@/lib/gemini'
import LibraryCard from './LibraryCard'

export default function SynthesisLibrary() {
  const [library, setLibrary] = useState<SynthesizedIntelligence[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const items = await fetchLibrary()
      setLibrary(items)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <section style={{
        marginTop: '80px',
        paddingTop: '40px',
        borderTop: '1px solid hsl(var(--border))',
      }}>
        <h3 style={{
          fontFamily: '"DM Serif Display", serif',
          fontSize: '32px',
          color: 'hsl(var(--foreground))',
          marginBottom: '24px',
        }}>
          ספריית הגילויים
        </h3>
        <p style={{
          fontFamily: '"IBM Plex Sans Hebrew", "Heebo", sans-serif',
          fontSize: '14px',
          color: 'hsl(var(--text-dim))',
        }}>
          טוען ···
        </p>
      </section>
    )
  }

  if (library.length === 0) {
    return (
      <section style={{
        marginTop: '80px',
        paddingTop: '40px',
        borderTop: '1px solid hsl(var(--border))',
      }}>
        <h3 style={{
          fontFamily: '"DM Serif Display", serif',
          fontSize: '32px',
          color: 'hsl(var(--foreground))',
          marginBottom: '24px',
        }}>
          ספריית הגילויים
        </h3>
        <p style={{
          fontFamily: '"IBM Plex Sans Hebrew", "Heebo", sans-serif',
          fontSize: '14px',
          color: 'hsl(var(--text-dim))',
        }}>
          עדיין אין אינטליגנציות שנוצרו. סנתז את הראשונה שלך.
        </p>
      </section>
    )
  }

  return (
    <section style={{
      marginTop: '80px',
      paddingTop: '40px',
      borderTop: '1px solid hsl(var(--border))',
    }}>
      <h3 style={{
        fontFamily: '"DM Serif Display", serif',
        fontSize: '32px',
        color: 'hsl(var(--foreground))',
        marginBottom: '24px',
      }}>
        ספריית הגילויים
      </h3>
      <p style={{
        fontFamily: '"DM Mono", monospace',
        fontSize: '11px',
        letterSpacing: '2px',
        color: 'hsl(var(--text-dim))',
        marginBottom: '32px',
        textTransform: 'uppercase',
      }}>
        {library.length} אינטליגנציות שנוצרו עד כה
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '24px',
      }}>
        {library.map(item => (
          <LibraryCard key={item.source_ids.join('+')} synthesis={item} />
        ))}
      </div>
    </section>
  )
}
