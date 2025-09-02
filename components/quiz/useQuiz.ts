import { useState, useCallback } from "react";
import { useAudio } from "@/context/sound-context";
import type { Question, VillainKey } from "@/lib/types";

type TieBreaker = "earliest" | "random";

interface AnswerMeta {
  seq: number; // sequence number of when it was answered
  answerIndex: number;
}

export const useQuiz = (
  questions: readonly Question[],
  tieBreaker: TieBreaker = "earliest"
) => {
  const { playSlideSound } = useAudio();
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Partial<Record<number, AnswerMeta>>
  >({});
  const [result, setResult] = useState<{ open: boolean; href: string }>({
    open: false,
    href: "",
  });
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  // determine how far user has answered to allow navigation
  const answeredIndices = Object.keys(selectedAnswers).length
    ? Object.keys(selectedAnswers).map((k) => Number(k))
    : [];
  const lastAnsweredIndex =
    answeredIndices.length > 0 ? Math.max(...answeredIndices) : -1;
  /**
   * computeScores:
   * - Walks selectedAnswers
   * - For each answered question, it reads the chosen answer and resolves
   *   an array of villains for that answer (supports both 'villains: string[]'
   *   and legacy 'villain: string').
   * - Builds:
   *    - scores: Record<VillainKey, number>
   *    - earliestSeqForVillain: Record<VillainKey, seqNumber> (lowest seq wins earliest)
   */

  const computeScores = useCallback(
    (
      answersMap: Partial<Record<number, { answerIndex: number; seq: number }>>
    ): {
      scores: Partial<Record<VillainKey, number>>;
      earliestSeqForVillain: Partial<Record<VillainKey, number>>;
    } => {
      const scores: Partial<Record<VillainKey, number>> = {};
      const earliestSeqForVillain: Partial<Record<VillainKey, number>> = {};

      Object.entries(answersMap).forEach(([qIndexStr, meta]) => {
        if (!meta) return;
        const q = questions[Number(qIndexStr)];
        if (!q) return;
        const answer = q.answers[meta.answerIndex];
        if (!answer) return;

        // Support both `villains: string[]` or legacy `villain: string`
        // @ts-ignore - runtime guard
        const villainsArray: VillainKey[] = Array.isArray(answer.villains)
          ? // @ts-ignore
            answer.villains
          : [];

        villainsArray.forEach((v) => {
          if (!v) return;
          scores[v] = (scores[v] || 0) + 1;

          const existingSeq = earliestSeqForVillain[v];
          if (existingSeq === undefined || meta.seq < existingSeq) {
            earliestSeqForVillain[v] = meta.seq;
          }
        });
      });

      return { scores, earliestSeqForVillain };
    },
    [questions]
  );

  /**
   * calculateResult:
   * - Accepts computed scores and earliestSeq map
   * - Finds highest score(s)
   * - If tie:
   *    - if tieBreaker === "earliest" -> pick villain with smallest earliestSeq
   *    - if tieBreaker === "random"   -> pick random among tied
   */

  const calculateResult = useCallback(
    (
      finalScores: Partial<Record<VillainKey, number>>,
      earliestSeqForVillain: Partial<Record<VillainKey, number>>
    ) => {
      const entries = Object.entries(finalScores);
      if (entries.length === 0) return;

      // find max score
      const maxScore = Math.max(...entries.map(([, v]) => v || 0));

      // collect all villains with maxScore
      const topVillains = entries
        .filter(([, score]) => (score || 0) === maxScore)
        .map(([villain]) => villain as VillainKey);

      let picked: VillainKey;

      if (topVillains.length === 1) {
        picked = topVillains[0];
      } else {
        if (tieBreaker === "earliest") {
          // choose villain with smallest earliest seq (earliest user selection)
          let bestVillain = topVillains[0];
          let bestSeq =
            earliestSeqForVillain[bestVillain] ?? Number.POSITIVE_INFINITY;
          for (let i = 1; i < topVillains.length; i++) {
            const v = topVillains[i];
            const seq = earliestSeqForVillain[v] ?? Number.POSITIVE_INFINITY;
            if (seq < bestSeq) {
              bestSeq = seq;
              bestVillain = v;
            }
          }
          picked = bestVillain;
        } else {
          // random tie-breaker
          const idx = Math.floor(Math.random() * topVillains.length);
          picked = topVillains[idx];
        }
      }

      return `/quiz/results/${picked}`;
    },
    [tieBreaker]
  );

  const goToQuestion = useCallback(
    (index: number) => {
      if (isAnimating) return;
      playSlideSound();
      setCurrentQuestionIndex(index);
    },
    [isAnimating]
  );
  const goBack = () => setResult({ open: false, href: "" });

  return {
    result,
    goBack,
    setResult,
    goToQuestion,
    computeScores,
    setIsAnimating,
    calculateResult,
    setSelectedAnswers,
    setCurrentQuestionIndex,
    isAnimating,
    isLastQuestion,
    selectedAnswers,
    currentQuestion,
    lastAnsweredIndex,
    currentQuestionIndex,
  };
};

// const handleAnswer = useCallback(
//   (answerIndex: number) => {
//     if (isAnimating) return;

//     const seq = seqRef.current++;
//     const updatedAnswers = {
//       ...selectedAnswers,
//       [currentQuestionIndex]: { answerIndex, seq },
//     };

//     setSelectedAnswers(updatedAnswers);

//     if (isLastQuestion) {
//       const { scores, earliestSeqForVillain } = computeScores(updatedAnswers);
//       const path = calculateResult(scores, earliestSeqForVillain);
//       setResultHref(path);
//     }
//   },
//   [
//     isAnimating,
//     selectedAnswers,
//     currentQuestionIndex,
//     isLastQuestion,
//     computeScores,
//     calculateResult,
//   ]
// );

// const goToQuestion = useCallback(
//   (index: number) => {
//     if (isAnimating) return;
//     setCurrentQuestionIndex(index);
//   },
//   [isAnimating]
// );

// const resetQuiz = useCallback(() => {
//   setCurrentQuestionIndex(0);
//   setSelectedAnswers({});
//   setResultHref(null);
//   seqRef.current = 0;
// }, []);

// const lastAnsweredIndex = useMemo(() => {
//   const answeredIndices = Object.keys(selectedAnswers).map(Number);
//   return answeredIndices.length > 0 ? Math.max(...answeredIndices) : -1;
// }, [selectedAnswers]);

// return {
//   isAnimating,
//   setIsAnimating,
//   currentQuestion,
//   currentQuestionIndex,
//   selectedAnswers,
//   resultHref,
//   handleAnswer,
//   goToQuestion,
//   resetQuiz,
//   lastAnsweredIndex,
//   isLastQuestion,
// };
