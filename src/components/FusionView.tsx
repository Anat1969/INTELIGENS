import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { BY_ID } from '@/data/intelligences'
import { type ComposedFusion, fusionPlainText, sortIds } from '@/lib/fusion'
import { coverImageId } from '@/lib/living-image'
import { CoverUploader } from '@/components/CoverUploader'

interface Props {
  fusion: ComposedFusion
  /** Stable storage id of the merge (sorted ids joined by "-"). */
  itemId: string
  /** Hide the hero when the page already shows a title (article page). */
  compact?: boolean
  /** Show the link to the full article. */
  showArticleLink?: boolean
}

const ARC: { key: 'mind' | 'heart' | 'gut' | 'intuition'; no: string; label: string; hint: string }[] = [
  { key: 'mind', no: '01', label: 'שכל', hint: 'המנגנון' },
  { key: 'heart', no: '02', label: 'רגש', hint: 'איך זה מרגיש מבפנים' },
  { key: 'gut', no: '03', label: 'יצר', hint: 'מה הגוף עושה לפני הראש' },
  { key: 'intuition', no: '04', label: 'אינטואיציה בפעולה', hint: 'הרגע שבו זה קורה מעצמו' },
]

const MECHANISM: { key: 'friction' | 'transplant' | 'definition' | 'recognize'; no: string; label: string }[] = [
  { key: 'friction', no: 'א', label: 'החיכוך' },
  { key: 'transplant', no: 'ב', label: 'ההשתלה' },
  { key: 'definition', no: 'ג', label: 'הגדרה' },
  { key: 'recognize', no: 'ד', label: 'איך מזהים אותה' },
]

/** Adds `is-in` to every `.reveal-up` child once it scrolls into view. */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const els = Array.from(root.querySelectorAll<HTMLElement>('.reveal-up'))
    if (typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  })
  return ref
}

function CopyButton({ text, label, done }: { text: string; label: string; done: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      className="tool-btn"
      onClick={() => {
        void navigator.clipboard.writeText(text).catch(() => undefined)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1800)
      }}
    >
      {copied ? done : label}
    </button>
  )
}

export function FusionView({ fusion, itemId, compact = false, showArticleLink = true }: Props) {
  const ref = useReveal()
  const intels = fusion.ids.map((id) => BY_ID[id])
  const hues = intels.map((i) => i.hue)
  const rail =
    hues.length === 1
      ? `hsl(${hues[0]})`
      : `linear-gradient(180deg, ${hues.map((h) => `hsl(${h})`).join(', ')})`
  const band = `linear-gradient(90deg, ${hues.map((h) => `hsla(${h}, 0.85)`).join(', ')})`
  const selected = sortIds(fusion.ids).join(',')

  return (
    <div ref={ref} className="fusion" dir="rtl" style={{ ['--fusion-rail' as string]: rail, ['--fusion-band' as string]: band }}>
      {!compact && (
        <header className="fusion-hero reveal-up">
          <div className="fusion-sources">
            {intels.map((i) => (
              <span
                key={i.id}
                className="fusion-chip"
                style={{ color: `hsl(${i.hue.replace(/(\d+)%\)?$/, '32%')})`, background: `hsla(${i.hue}, 0.1)`, borderColor: `hsla(${i.hue}, 0.35)` }}
              >
                <span className="fusion-chip-no">{i.number}</span>
                {i.name}
              </span>
            ))}
          </div>
          <p className="fusion-kicker">אינטליגנציה חדשה</p>
          <h2 className="fusion-name">{fusion.name}</h2>
          <p className="fusion-type">{fusion.type}</p>
          <p className="fusion-distill">{fusion.distillation}</p>
        </header>
      )}

      <section className="fusion-mechanism reveal-up" aria-label="איך נוצר המיזוג">
        <h3 className="fusion-label">איך נוצר המיזוג</h3>
        <p className="fusion-mechanism-lead">
          כל אינטליגנציה רואה משהו ועיוורת למשהו אחר. המיזוג מתחיל במקום שבו השתיים מתנגשות, ממשיך בהשתלת הפעולה של אחת על החומר של השנייה, ונגמר ביכולת חדשה שאפשר לזהות באדם.
        </p>
        <dl className="fusion-mechanism-grid">
          {MECHANISM.map((m) => (
            <div key={m.key} className={`fusion-mech fusion-mech--${m.key}`}>
              <dt>
                <span className="fusion-step-no">{m.no}</span> {m.label}
              </dt>
              <dd>{fusion[m.key]}</dd>
            </div>
          ))}
        </dl>
      </section>

      <ol className="fusion-arc" aria-label="מהשכל אל הפעולה">
        {ARC.map((step, idx) => (
          <li key={step.key} className={`fusion-step fusion-step--${idx + 1} reveal-up`} style={{ transitionDelay: `${idx * 90}ms` }}>
            <div className="fusion-step-head">
              <span className="fusion-step-no">{step.no}</span>
              <span className="fusion-step-label">{step.label}</span>
              <span className="fusion-step-hint">{step.hint}</span>
            </div>
            <p className="fusion-step-text">{fusion[step.key]}</p>
          </li>
        ))}
      </ol>

      {fusion.layers.length > 0 && (
        <section className="fusion-layers reveal-up">
          <h3 className="fusion-label">שכבות נוספות על הזוג המרכזי</h3>
          {fusion.layers.map((l) => (
            <p key={l.id} className="fusion-layer">
              <strong>{l.name}.</strong> {l.mind}
            </p>
          ))}
        </section>
      )}

      <section className="fusion-practice reveal-up">
        <h3 className="fusion-label fusion-label--inverse">תרגול להיום</h3>
        <p>{fusion.practice}</p>
      </section>

      <section className="fusion-novelty reveal-up">
        <h3 className="fusion-label">מבחן חדשנות</h3>
        <p>{fusion.novelty}</p>
      </section>

      <section className="fusion-visual reveal-up">
        <h3 className="fusion-label">המחשה</h3>
        <div className="fusion-visual-grid">
          <figure className="fusion-frame">
            <div className="fusion-frame-image">
              <CoverUploader id={coverImageId(itemId)} variant="card" gradient={band} />
            </div>
            <figcaption className="fusion-frame-caption">
              <span className="fusion-frame-name">{fusion.name}</span>
              <span className="fusion-frame-insight">{fusion.insight}</span>
            </figcaption>
          </figure>

          <div className="fusion-prompt">
            <p className="fusion-prompt-visual">{fusion.visual}</p>
            <p className="fusion-prompt-text" dir="auto">{fusion.imagePrompt}</p>
            <div className="fusion-actions">
              <CopyButton text={fusion.imagePrompt} label="העתקת הפרומפט" done="הפרומפט הועתק" />
            </div>
            <p className="fusion-hint">
              מדביקים את הפרומפט במידג'רני, ומעלים את התמונה שנוצרה למסגרת. היא נשמרת עם השם ומשפט התובנה, ומופיעה גם בפלייר.
            </p>
          </div>
        </div>
      </section>

      {(fusion.roles.length > 0 || fusion.innerPairs.length > 0) && (
        <section className="fusion-meta reveal-up">
          {fusion.roles.length > 0 && (
            <div>
              <h3 className="fusion-label">מי ישגשג עם היכולת הזאת</h3>
              <div className="fusion-tags">
                {fusion.roles.map((r) => (
                  <span key={r} className="fusion-tag">{r}</span>
                ))}
              </div>
            </div>
          )}
          {fusion.innerPairs.length > 0 && (
            <div>
              <h3 className="fusion-label">זוגות נוספים בתוך הצירוף</h3>
              <div className="fusion-tags">
                {fusion.innerPairs.map((p) => (
                  <Link key={p.key} to={`/composer?selected=${p.ids.join(',')}`} className="fusion-tag fusion-tag--link">
                    {p.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      <div className="fusion-actions fusion-actions--end no-print">
        <Link to={`/flyer?selected=${selected}`} className="tool-btn tool-btn--primary">
          פלייר להדפסה ולשיתוף
        </Link>
        <CopyButton text={fusionPlainText(fusion)} label="העתקת הטקסט" done="הטקסט הועתק" />
        {showArticleLink && (
          <Link to={`/intelligence/${itemId}`} className="tool-btn">
            פתיחת מאמר
          </Link>
        )}
      </div>
    </div>
  )
}

export default FusionView
