import { useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { AppNav } from "@/components/AppNav";
import { INTELLIGENCES } from "@/data/intelligences";
import { Sparkles, Brain, Compass, ArrowDown } from "lucide-react";

const PARTICLE_COUNT = 24;

function HeroParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const intel = INTELLIGENCES[i % INTELLIGENCES.length];
        return {
          id: i,
          hue: intel.hue,
          size: 2 + Math.random() * 4,
          left: Math.random() * 100,
          duration: 8 + Math.random() * 12,
          delay: Math.random() * 10,
        };
      }),
    [],
  );

  return (
    <div className="hero-particles">
      {particles.map((p) => (
        <div
          key={p.id}
          className="hero-particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            background: `hsl(${p.hue})`,
            boxShadow: `0 0 ${p.size * 3}px hsla(${p.hue}, 0.4)`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

const features = [
  {
    icon: Brain,
    title: "12 אינטליגנציות",
    description: "מבוסס על תיאוריית האינטליגנציות המרובות של גארדנר, עם הרחבות מודרניות",
    hue: "260, 70%, 60%",
  },
  {
    icon: Sparkles,
    title: "סינתזה עם AI",
    description: "בינה מלאכותית מזהה את האינטליגנציה החדשה שנולדת מהשילוב שבחרת",
    hue: "200, 85%, 55%",
  },
  {
    icon: Compass,
    title: "פרופיל אישי",
    description: "גלה את הפרופיל האינטליגנטי שלך דרך שאלון ייחודי ומעמיק",
    hue: "340, 70%, 58%",
  },
];

export default function Landing() {
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 },
    );

    const sections = document.querySelectorAll(".section-fade-in");
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      <AppNav />

      {/* ─── Hero ─── */}
      <section className="hero-section">
        <div className="hero-bg-mesh" />
        <div className="hero-grid-lines" />
        <HeroParticles />

        <div className="hero-content px-6">
          <h1 className="hero-title font-serif-display">
            Intelligence Composer
          </h1>

          <p
            className="hero-subtitle font-mono-dm mt-6 uppercase"
            style={{ color: "hsl(var(--text-dim))" }}
          >
            בחר · שלב · גלה את מה שנוצר
          </p>

          <p
            className="mt-8 max-w-[560px] mx-auto text-[16px] md:text-[18px] leading-[1.8]"
            style={{
              color: "hsl(var(--text-dim))",
              animation: "heroSubIn 900ms cubic-bezier(0.16, 1, 0.3, 1) 450ms both",
            }}
          >
            כלי חשיבה שמגלה את הכישרון הנסתר שנוצר כשאינטליגנציות שונות
            פועלות יחד — לא סכום, אלא ישות חדשה שלא קיימת בנפרד
          </p>

          <div className="hero-cta-group mt-12">
            <Link to="/composer" className="hero-cta-primary font-sans-he">
              התחל לגלות
            </Link>
            <Link to="/profile" className="hero-cta-secondary font-sans-he">
              הפרופיל שלי
            </Link>
          </div>
        </div>

        <div className="hero-scroll-indicator">
          <ArrowDown size={20} style={{ color: "hsl(var(--text-dim))" }} />
        </div>
      </section>

      {/* ─── Features ─── */}
      <section ref={featuresRef} className="py-24 md:py-32 px-6">
        <div className="mx-auto max-w-[1200px]">
          <div className="section-fade-in text-center mb-16">
            <h2
              className="font-serif-display text-[32px] md:text-[44px] leading-tight"
              style={{ color: "hsl(var(--foreground))" }}
            >
              איך זה עובד
            </h2>
            <p
              className="mt-4 font-mono-dm text-[12px] tracking-[0.3em] uppercase"
              style={{ color: "hsl(var(--text-dim))" }}
            >
              שלושה שלבים לגילוי
            </p>
          </div>

          <div className="section-fade-in grid gap-6 md:grid-cols-3">
            {features.map((f, idx) => (
              <div key={idx} className="feature-card group">
                <div
                  className="mb-6 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: `hsla(${f.hue}, 0.12)`,
                    boxShadow: `0 0 24px hsla(${f.hue}, 0.15)`,
                  }}
                >
                  <f.icon size={22} style={{ color: `hsl(${f.hue})` }} />
                </div>

                <h3
                  className="font-serif-display text-[22px] mb-3"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  {f.title}
                </h3>

                <p
                  className="text-[14px] leading-[1.8]"
                  style={{ color: "hsl(var(--text-dim))" }}
                >
                  {f.description}
                </p>

                <div
                  className="mt-6 h-px w-12 transition-all duration-500 group-hover:w-full"
                  style={{ background: `hsl(${f.hue})`, opacity: 0.4 }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Intelligence Preview ─── */}
      <section className="py-24 md:py-32 px-6">
        <div className="mx-auto max-w-[1200px]">
          <div className="section-fade-in text-center mb-16">
            <h2
              className="font-serif-display text-[32px] md:text-[44px] leading-tight"
              style={{ color: "hsl(var(--foreground))" }}
            >
              12 אינטליגנציות. אינסוף צירופים.
            </h2>
            <p
              className="mt-4 max-w-[500px] mx-auto text-[15px] leading-[1.8]"
              style={{ color: "hsl(var(--text-dim))" }}
            >
              כל אינטליגנציה היא עולם שלם. כשמשלבים שניים או יותר — נוצר משהו חדש שלא היה קיים קודם.
            </p>
          </div>

          <div className="section-fade-in grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {INTELLIGENCES.map((intel) => (
              <Link
                key={intel.id}
                to={`/composer?selected=${intel.id}`}
                className="group rounded-2xl p-5 text-center transition-all duration-300 hover:scale-[1.04]"
                style={{
                  background: `hsla(${intel.hue}, 0.06)`,
                  border: `1px solid hsla(${intel.hue}, 0.12)`,
                }}
              >
                <div
                  className="w-10 h-10 mx-auto mb-3 rounded-full flex items-center justify-center font-mono-dm text-[11px] tracking-wider"
                  style={{
                    background: `hsla(${intel.hue}, 0.15)`,
                    color: `hsl(${intel.hue})`,
                    boxShadow: `0 0 20px hsla(${intel.hue}, 0.1)`,
                  }}
                >
                  {intel.number}
                </div>
                <div
                  className="font-serif-display text-[15px] mb-1"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  {intel.name}
                </div>
                <div
                  className="font-mono-dm text-[9px] tracking-[0.2em] uppercase"
                  style={{ color: `hsl(${intel.hue})` }}
                >
                  {intel.domain}
                </div>
              </Link>
            ))}
          </div>

          <div className="section-fade-in mt-16 text-center">
            <Link
              to="/composer"
              className="hero-cta-primary font-sans-he inline-block"
            >
              בחר צירוף וגלה
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="py-24 md:py-32 px-6" style={{ background: "hsla(var(--surface), 0.5)" }}>
        <div className="section-fade-in mx-auto max-w-[1000px] grid gap-8 md:grid-cols-3 text-center">
          {[
            { num: "12", label: "אינטליגנציות בסיס" },
            { num: "4,096", label: "צירופים אפשריים" },
            { num: "∞", label: "אינטליגנציות חדשות" },
          ].map((s, i) => (
            <div key={i}>
              <div className="stat-number font-serif-display">{s.num}</div>
              <div
                className="mt-2 font-mono-dm text-[11px] tracking-[0.25em] uppercase"
                style={{ color: "hsl(var(--text-dim))" }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-16 px-6 text-center border-t" style={{ borderColor: "hsl(var(--border))" }}>
        <p
          className="font-serif-display text-[18px] mb-2"
          style={{ color: "hsl(var(--text-dim))" }}
        >
          Intelligence Composer
        </p>
        <p
          className="font-mono-dm text-[10px] tracking-[0.2em]"
          style={{ color: "hsl(var(--text-dim))", opacity: 0.5 }}
        >
          כלי חשיבה מבוסס תיאוריית האינטליגנציות המרובות
        </p>
      </footer>
    </div>
  );
}
