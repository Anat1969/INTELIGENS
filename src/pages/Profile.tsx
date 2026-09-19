import { useEffect, useMemo, useRef, useState } from "react";
import { AppNav } from "@/components/AppNav";
import { PROFILE_QUESTIONS } from "@/data/profileQuestions";
import { QuestionBlock } from "@/components/profile/QuestionBlock";
import { ProgressBar } from "@/components/profile/ProgressBar";
import { ProfileResult } from "@/components/profile/ProfileResult";
import { SaveProfileBlock } from "@/components/profile/SaveProfileBlock";
import { ProfilesLibrary } from "@/components/profile/ProfilesLibrary";

const STORAGE_KEY = "intelligenceProfile";
const TOTAL = PROFILE_QUESTIONS.length;

interface SavedState {
  currentQuestion: number;
  answers: (number | null)[];
  showResult?: boolean;
}

const loadInitial = (): SavedState => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SavedState;
      if (
        typeof parsed.currentQuestion === "number" &&
        Array.isArray(parsed.answers) &&
        parsed.answers.length === TOTAL
      ) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return {
    currentQuestion: 0,
    answers: Array(TOTAL).fill(null),
    showResult: false,
  };
};

const Profile = () => {
  const [state, setState] = useState<SavedState>(loadInitial);
  const resultRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (state.showResult && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [state.showResult]);

  const handleAnswer = (answerIdx: number) => {
    setState((prev) => {
      const answers = [...prev.answers];
      answers[prev.currentQuestion] = answerIdx;
      const isLast = prev.currentQuestion === TOTAL - 1;
      return {
        ...prev,
        answers,
        // auto-advance unless on last question
        currentQuestion: isLast ? prev.currentQuestion : prev.currentQuestion,
      };
    });
    // auto-advance after 300ms
    if (state.currentQuestion < TOTAL - 1) {
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          currentQuestion: Math.min(prev.currentQuestion + 1, TOTAL - 1),
        }));
      }, 300);
    }
  };

  const handleBack = () => {
    setState((prev) => ({
      ...prev,
      currentQuestion: Math.max(0, prev.currentQuestion - 1),
      showResult: false,
    }));
  };

  const handleShowProfile = () => {
    setState((prev) => ({ ...prev, showResult: true }));
  };

  const handleRestart = () => {
    const fresh: SavedState = {
      currentQuestion: 0,
      answers: Array(TOTAL).fill(null),
      showResult: false,
    };
    setState(fresh);
  };

  const question = PROFILE_QUESTIONS[state.currentQuestion];

  const answeredHues = useMemo(
    () =>
      state.answers
        .map((a, i) => (a !== null ? PROFILE_QUESTIONS[i].intelligence : null))
        .filter((x): x is (typeof PROFILE_QUESTIONS)[number]["intelligence"] => x !== null),
    [state.answers],
  );

  const isLast = state.currentQuestion === TOTAL - 1;
  const currentAnswer = state.answers[state.currentQuestion];

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      <AppNav />

      <main className="mx-auto max-w-[1400px] px-6 py-12">
        <header className="mx-auto max-w-[680px] mb-10">
          <h1 className="font-serif-display text-[36px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-foreground">
            הפרופיל שלך
          </h1>
          <p
            className="mt-3 font-mono-dm text-[11px] tracking-[0.25em] uppercase"
            style={{ color: "hsl(var(--text-dim))" }}
          >
            ענה על 16 שאלות · גלה את הפרופיל האמיתי שלך
          </p>
        </header>

        <div className="mx-auto max-w-[680px]">
          <ProgressBar
            current={state.currentQuestion}
            total={TOTAL}
            answeredHues={answeredHues}
          />

          <div className="mt-10">
            <QuestionBlock
              question={question}
              index={state.currentQuestion}
              total={TOTAL}
              current={currentAnswer}
              onAnswer={handleAnswer}
              isLast={isLast}
              onShowProfile={handleShowProfile}
            />
          </div>

          <div className="mt-10 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={state.currentQuestion === 0}
              className="font-mono-dm text-[11px] tracking-[0.25em] uppercase disabled:opacity-30 hover:opacity-80 transition-opacity"
              style={{ color: "hsl(var(--text-dim))" }}
            >
              ← חזור
            </button>
            <button
              type="button"
              onClick={handleRestart}
              className="font-mono-dm text-[10px] tracking-[0.25em] uppercase opacity-60 hover:opacity-100 transition-opacity"
              style={{ color: "hsl(var(--text-dim))" }}
            >
              התחל מחדש
            </button>
          </div>
        </div>

        <div ref={resultRef}>
          {state.showResult && (
            <>
              <ProfileResult answers={state.answers} />
              <SaveProfileBlock
                answers={state.answers}
                onSaved={() => setLibraryKey((k) => k + 1)}
              />
            </>
          )}
        </div>

        <ProfilesLibrary refreshKey={libraryKey} />
      </main>
    </div>
  );
};

export default Profile;
