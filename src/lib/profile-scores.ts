import { BY_ID, type Combo, type IntelligenceId } from "@/data/intelligences";
import { lookupProfileCombo, PROFILE_COMBOS } from "@/data/profileCombos";
import { INTEL_ORDER } from "@/data/profileQuestions";

export interface ProfileScore {
  intelligence: IntelligenceId;
  score: number;
  percent: number;
  hue: string;
}

export const computeScores = (answers: (number | null)[]): ProfileScore[] =>
  INTEL_ORDER.map((id, idx) => {
    const a1 = answers[idx * 2];
    const a2 = answers[idx * 2 + 1];
    const s1 = a1 === null || a1 === undefined ? 0 : 4 - a1;
    const s2 = a2 === null || a2 === undefined ? 0 : 4 - a2;
    const score = s1 + s2;
    return {
      intelligence: id,
      score,
      percent: Math.round((score / 8) * 100),
      hue: BY_ID[id].hue,
    };
  }).sort((a, b) => b.percent - a.percent);

export const getProfileCombos = (
  sorted: ProfileScore[],
): { combo: Combo; ids: IntelligenceId[] }[] => {
  const ids2 = [sorted[0].intelligence, sorted[1].intelligence];
  const k2 = [...ids2].sort().join("+");
  const c2 = PROFILE_COMBOS[k2] ?? lookupProfileCombo(ids2);
  const out: { combo: Combo; ids: IntelligenceId[] }[] = [{ combo: c2, ids: ids2 }];
  if (sorted[2] && sorted[2].percent >= 70) {
    const ids3 = [
      sorted[0].intelligence,
      sorted[1].intelligence,
      sorted[2].intelligence,
    ];
    out.push({ combo: lookupProfileCombo(ids3), ids: ids3 });
  }
  return out;
};

export const readManualSelection = (): IntelligenceId[] => {
  try {
    const raw = sessionStorage.getItem("manualSelection");
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr)
      ? (arr.filter((x) => x in BY_ID) as IntelligenceId[])
      : [];
  } catch {
    return [];
  }
};
