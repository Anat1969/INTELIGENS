import { useEffect, useState } from "react";
import type { ProfileQuestion } from "@/data/profileQuestions";
import { BY_ID } from "@/data/intelligences";
import { cn } from "@/lib/utils";

interface Props {
  question: ProfileQuestion;
  index: number; // 0-15
  total: number;
  current: number | null;
  onAnswer: (answerIdx: number) => void;
  isLast: boolean;
  onShowProfile: () => void;
}

export const QuestionBlock = ({
  question,
  index,
  current,
  onAnswer,
  isLast,
  onShowProfile,
}: Props) => {
  const [enterKey, setEnterKey] = useState(index);
  const hue = BY_ID[question.intelligence].hue;

  useEffect(() => {
    setEnterKey(index);
  }, [index]);

  return (
    <div key={enterKey} className="question-block enter">
      <div
        className="font-mono-dm text-[10px] tracking-[0.2em]"
        style={{ color: "hsl(var(--text-dim))" }}
      >
        שאלה {question.number}
      </div>

      <h2 className="mt-3 font-serif-display text-[24px] md:text-[28px] leading-[1.4] text-foreground">
        {question.text}
      </h2>

      <div className="mt-8 flex flex-col gap-2">
        {question.answers.map((ans, i) => {
          const selected = current === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onAnswer(i)}
              className={cn(
                "w-full text-right px-5 py-4 border rounded-sm transition-all duration-200",
                "font-sans-he text-[16px] leading-[1.75]",
                "hover:border-foreground/40",
              )}
              style={
                selected
                  ? {
                      borderColor: `hsl(${hue})`,
                      color: "hsl(var(--foreground))",
                      backgroundColor: `hsla(${hue}, 0.06)`,
                    }
                  : {
                      borderColor: "hsl(var(--border))",
                      color: "hsla(var(--foreground), 0.85)",
                      backgroundColor: "transparent",
                    }
              }
            >
              {ans}
            </button>
          );
        })}
      </div>

      {isLast && current !== null && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={onShowProfile}
            className="font-serif-display text-[24px] md:text-[28px] tracking-tight pb-2 border-b border-foreground transition-opacity hover:opacity-80"
            style={{ color: "hsl(var(--foreground))" }}
          >
            הצג את הפרופיל שלך
          </button>
        </div>
      )}
    </div>
  );
};
