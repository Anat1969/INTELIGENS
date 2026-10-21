import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AppNav } from '@/components/AppNav'
import { CoverUploader } from '@/components/CoverUploader'
import { BY_ID, type IntelligenceId } from '@/data/intelligences'
import { composeFusion, fusionPlainText, fusionUrl } from '@/lib/fusion'
import { coverImageId } from '@/lib/living-image'

const STEPS = [
  { key: 'mind', no: '01', label: 'שכל' },
  { key: 'heart', no: '02', label: 'רגש' },
  { key: 'gut', no: '03', label: 'יצר' },
  { key: 'intuition', no: '04', label: 'אינטואיציה בפעולה' },
] as const

/** Darkens a raw "H, S%, L%" hue for text that must stay readable on white. */
const deep = (hue: string) => hue.replace(/(\d+)%\s*$/, '30%')

export default function Flyer() {
  const [params] = useSearchParams()
  const [shared, setShared] = useState('')
  const pageRef = useRef<HTMLElement>(null)

  const ids = useMemo(
    () =>
      (params.get('selected') ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter((s): s is IntelligenceId => s in BY_ID),
    [params],
  )
  const fusion = composeFusion(ids)
  const fitKey = ids.join(',')

  // Long cards shrink their text step by step until the page holds exactly one A4 sheet.
  useLayoutEffect(() => {
    const page = pageRef.current
    if (!page) return
    const fit = () => {
      let t = 1
      page.style.setProperty('--t', '1')
      while (page.scrollHeight > page.clientHeight + 1 && t > 0.72) {
        t -= 0.03
        page.style.setProperty('--t', t.toFixed(2))
      }
    }
    fit()
    void document.fonts?.ready.then(fit)
    const ro = new ResizeObserver(fit)
    ro.observe(page)
    return () => ro.disconnect()
  }, [fitKey])

  if (!fusion) {
    return (
      <div className="min-h-screen">
        <AppNav />
        <main className="mx-auto max-w-[720px] px-6 pt-40 text-center">
          <p className="text-[18px]">כדי ליצור פלייר, בחרו לפחות שתי אינטליגנציות במפה.</p>
          <Link to="/composer" className="tool-btn mt-6">
            למפת האינטליגנציות
          </Link>
        </main>
      </div>
    )
  }

  const itemId = fusion.ids.join('-')
  const intels = fusion.ids.map((id) => BY_ID[id])
  const band = `linear-gradient(90deg, ${intels.map((i) => `hsl(${i.hue})`).join(', ')})`
  const wash = `linear-gradient(160deg, ${intels.map((i) => `hsla(${i.hue}, 0.10)`).join(', ')})`
  const shareUrl = fusionUrl(fusion.ids, '/flyer')
  const today = new Date().toLocaleDateString('he-IL')

  async function share() {
    const data = { title: fusion!.name, text: `${fusion!.name}: ${fusion!.distillation}`, url: shareUrl }
    try {
      if (navigator.share) {
        await navigator.share(data)
        return
      }
      await navigator.clipboard.writeText(`${data.text}\n${shareUrl}`)
      setShared('הקישור לפלייר הועתק')
    } catch {
      try {
        await navigator.clipboard.writeText(`${data.text}\n${shareUrl}`)
        setShared('הקישור לפלייר הועתק')
      } catch {
        setShared('לא ניתן לשתף מהדפדפן הזה')
      }
    }
    window.setTimeout(() => setShared(''), 2200)
  }

  return (
    <div className="flyer-screen min-h-screen">
      <div className="no-print">
        <AppNav />
      </div>

      <main className="flyer-main">
        <div className="flyer-toolbar no-print" dir="rtl">
          <button type="button" className="tool-btn tool-btn--primary" onClick={() => window.print()}>
            הדפסה או שמירה כ-PDF
          </button>
          <button type="button" className="tool-btn" onClick={share}>
            שיתוף
          </button>
          <button
            type="button"
            className="tool-btn"
            onClick={() => void navigator.clipboard.writeText(fusionPlainText(fusion)).then(() => setShared('הטקסט הועתק'))}
          >
            העתקת הטקסט
          </button>
          <Link to={`/composer?selected=${fusion.ids.join(',')}`} className="tool-btn">
            חזרה למיזוג
          </Link>
          {shared && <span className="flyer-note" aria-live="polite">{shared}</span>}
        </div>

        <article ref={pageRef} className="flyer-page" dir="rtl" style={{ ['--flyer-band' as string]: band, ['--flyer-wash' as string]: wash }}>
          <div className="flyer-band" aria-hidden="true" />

          <header className="flyer-head">
            <span className="flyer-mono">מפת האינטליגנציות · אינטליגנציה חדשה</span>
            <span className="flyer-sources">
              {intels.map((i, idx) => (
                <span key={i.id} style={{ color: `hsl(${deep(i.hue)})` }}>
                  {i.name}
                  {idx < intels.length - 1 ? <span className="flyer-plus"> + </span> : null}
                </span>
              ))}
            </span>
          </header>

          <h1 className="flyer-name">{fusion.name}</h1>
          <p className="flyer-type">{fusion.type}</p>

          <dl className="flyer-mech">
            {(
              [
                ['החיכוך', fusion.friction],
                ['ההשתלה', fusion.transplant],
                ['הגדרה', fusion.definition],
                ['איך מזהים אותה', fusion.recognize],
              ] as const
            ).map(([label, text]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{text}</dd>
              </div>
            ))}
          </dl>

          <div className="flyer-grid">
            <figure className="flyer-frame">
              <div className="flyer-frame-image">
                <div className="flyer-frame-fallback" aria-hidden="true">
                  <span>{fusion.visual}</span>
                </div>
                <div className="flyer-frame-upload">
                  <CoverUploader id={coverImageId(itemId)} variant="card" gradient={band} />
                </div>
              </div>
              <figcaption className="flyer-caption">{fusion.name}</figcaption>
            </figure>

            <div className="flyer-copy">
              <p className="flyer-distill">{fusion.distillation}</p>
              <ol className="flyer-steps">
                {STEPS.map((s) => (
                  <li key={s.key} className="flyer-step">
                    <span className="flyer-step-label">
                      <span className="flyer-step-no">{s.no}</span> {s.label}
                    </span>
                    <span className="flyer-step-text">{fusion[s.key]}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <section>
            <blockquote className="flyer-pull">{fusion.insight}</blockquote>
            <div className="flyer-roles">
              {fusion.roles.map((r) => (
                <span key={r}>{r}</span>
              ))}
            </div>
          </section>

          <section className="flyer-practice">
            <span className="flyer-step-label flyer-step-label--inverse">תרגול להיום</span>
            <p>{fusion.practice}</p>
          </section>

          <footer className="flyer-foot">
            <span className="flyer-novelty">
              <strong>מבחן חדשנות. </strong>
              {fusion.novelty}
            </span>
            <span className="flyer-mono flyer-url" dir="ltr">
              {shareUrl.replace(/^https?:\/\//, '')} · {today}
            </span>
          </footer>
        </article>
      </main>
    </div>
  )
}
