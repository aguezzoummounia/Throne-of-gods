// // TODO: this needs a new button styles
// // make questions and answers 5 words max for consistency

"use client";
import gsap from "gsap";
import Text from "../ui/text";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import LabelText from "../ui/label-text";
import { useRef, useState } from "react";
import Indicator from "./step-indicator";
import Button from "../ui/button-or-link";
import { useRouter } from "next/navigation";
import type { Question, VillainKey } from "@/lib/types";

gsap.registerPlugin(SplitText);

type TieBreaker = "earliest" | "random";
interface QuizClientProps {
  questions: readonly Question[];
  /**
   * Tie-breaker strategy:
   * - "earliest": prefer villain the user selected earliest
   * - "random": choose randomly among top-tied villains
   *
   * defaults to "earliest"
   */
  tieBreaker?: TieBreaker;
}

interface AnswerMeta {
  answerIndex: number;
  seq: number; // sequence number of when it was answered
}

export function QuizQuestions({
  questions,
  tieBreaker = "earliest",
}: QuizClientProps) {
  const seqRef = useRef<number>(0);
  const h4Ref = useRef<HTMLHeadingElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const indicatorsRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // store selected answer index per question: questionIndex -> answerIndex
  // const [selectedAnswers, setSelectedAnswers] = useState<
  //   Partial<Record<number, number>>
  // >({});
  const [selectedAnswers, setSelectedAnswers] = useState<
    Partial<Record<number, AnswerMeta>>
  >({});

  useGSAP(
    () => {
      if (isAnimating) return;
      const h4Split = new SplitText(h4Ref.current, { type: "chars" });
      const h2Split = new SplitText(h2Ref.current, { type: "chars" });
      const buttons = gsap.utils.toArray<HTMLButtonElement>(
        buttonsRef.current?.children || []
      );
      const tl = gsap.timeline();

      tl.from(
        h4Split.chars,
        {
          autoAlpha: 0,
          ease: "back.out",
          y: "random(-20, 20)",
          stagger: { amount: 0.5, from: "random" },
        },
        0
      );

      tl.from(h2Split.chars, { opacity: 0, duration: 0.5, stagger: 0.03 }, 0.1);

      tl.from(buttonsRef.current, { y: 20, opacity: 0, duration: 0.15 }, 0.15);

      tl.from(buttons, { y: 20, opacity: 0, duration: 0.5, stagger: 0.1 }, 0.2);

      tl.from(
        indicatorsRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 0.3,
        },
        0.3
      );

      return () => {
        h4Split.revert();
        h2Split.revert();
      };
    },
    { dependencies: [isAnimating, currentQuestionIndex] }
  );

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
  // const computeScores = (
  //   answersMap: Partial<Record<number, number>>
  // ): Partial<Record<VillainKey, number>> => {
  //   const result: Partial<Record<VillainKey, number>> = {};
  //   Object.entries(answersMap).forEach(([qIndexStr, ansIdx]) => {
  //     if (ansIdx === undefined || ansIdx === null) return;
  //     const qIndex = Number(qIndexStr);
  //     const q = questions[qIndex];
  //     if (!q) return;
  //     const answer = q.answers[ansIdx];
  //     if (!answer) return;

  //     // Backwards-compatibility: accept either `villain: string` or `villains: string[]`
  //     const villainsArray: VillainKey[] =
  //       // @ts-ignore
  //       Array.isArray(answer.villains)
  //         ? // @ts-ignore
  //           answer.villains
  //         : // @ts-ignore
  //         answer.villain
  //         ? // @ts-ignore
  //           [answer.villain]
  //         : [];

  //     villainsArray.forEach((v) => {
  //       if (!v) return;
  //       result[v] = (result[v] || 0) + 1;
  //     });
  //   });
  //   return result;
  // };
  const computeScores = (
    answersMap: Partial<Record<number, { answerIndex: number; seq: number }>>
  ): {
    scores: Partial<Record<VillainKey, number>>;
    earliestSeqForVillain: Partial<Record<VillainKey, number>>;
  } => {
    const scores: Partial<Record<VillainKey, number>> = {};
    const earliestSeqForVillain: Partial<Record<VillainKey, number>> = {};

    Object.entries(answersMap).forEach(([qIndexStr, meta]) => {
      if (!meta) return;
      const qIndex = Number(qIndexStr);
      const q = questions[qIndex];
      if (!q) return;
      const answer = q.answers[meta.answerIndex];
      if (!answer) return;

      // Support both `villains: string[]` or legacy `villain: string`
      // @ts-ignore - runtime guard
      const villainsArray: VillainKey[] = Array.isArray(answer.villains)
        ? // @ts-ignore
          answer.villains
        : // @ts-ignore
        answer.villain
        ? // @ts-ignore
          [answer.villain]
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
  };

  /**
   * handleAnswer: user selects an answer (answerIndex)
   * - increments seqRef to mark selection order
   * - stores answerIndex and seq for current question
   * - advances or finishes quiz
   */
  // const handleAnswer = (answerIndex: number) => {
  //   if (isAnimating) return;
  //   setIsAnimating(true);

  //   const tl = gsap.timeline({
  //     onComplete: () => {
  //       const newSelected = {
  //         ...selectedAnswers,
  //         [currentQuestionIndex]: answerIndex,
  //       };
  //       setSelectedAnswers(newSelected);

  //       if (currentQuestionIndex < questions.length - 1) {
  //         setCurrentQuestionIndex((idx) => idx + 1);
  //       } else {
  //         const finalScores = computeScores(newSelected);
  //         calculateResult(finalScores);
  //       }
  //       setIsAnimating(false);
  //     },
  //   });

  //   tl.to(h4Ref.current, { opacity: 0, y: -20, duration: 0.3 });
  //   tl.to(h2Ref.current, { opacity: 0, y: -20, duration: 0.3 }, 0);
  //   tl.to(buttonsRef.current, { opacity: 0, y: -20, duration: 0.3 }, 0);
  // };
  const handleAnswer = (answerIndex: number) => {
    if (isAnimating) return;
    setIsAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => {
        // assign a new sequence number (use post-increment so first seq is 0)
        const seq = seqRef.current++;
        const newSelected = {
          ...selectedAnswers,
          [currentQuestionIndex]: { answerIndex, seq },
        };
        setSelectedAnswers(newSelected);

        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((idx) => idx + 1);
        } else {
          // last question answered -> compute and decide
          const { scores, earliestSeqForVillain } = computeScores(newSelected);
          calculateResult(scores, earliestSeqForVillain);
        }
        setIsAnimating(false);
      },
    });

    tl.to(h4Ref.current, { opacity: 0, y: -20, duration: 0.3 });
    tl.to(h2Ref.current, { opacity: 0, y: -20, duration: 0.3 }, 0);
    tl.to(buttonsRef.current, { opacity: 0, y: -20, duration: 0.3 }, 0);
  };
  /**
   * calculateResult:
   * - Accepts computed scores and earliestSeq map
   * - Finds highest score(s)
   * - If tie:
   *    - if tieBreaker === "earliest" -> pick villain with smallest earliestSeq
   *    - if tieBreaker === "random"   -> pick random among tied
   */

  // const calculateResult = (
  //   finalScores: Partial<Record<VillainKey, number>>,
  //   tieBreaker: "earliest" | "latest" | "random" = "earliest"
  // ) => {
  //   const entries = Object.entries(finalScores) as [VillainKey, number][];

  //   if (entries.length === 0) return;

  //   // find max score
  //   const maxScore = Math.max(...entries.map(([,score]) => score));

  //   // collect all villains with that max score
  //   const topCandidates = entries
  //     .filter(([,score]) => score === maxScore)
  //     .map(([v]) => v);

  //   let chosen: VillainKey;

  //   if (topCandidates.length === 1) {
  //     chosen = topCandidates[0];
  //   } else {
  //     if (tieBreaker === "random") {
  //       const i = Math.floor(Math.random() * topCandidates.length);
  //       chosen = topCandidates[i];
  //     } else if (tieBreaker === "earliest") {
  //       // choose the villain with the smallest firstSelectedAt timestamp
  //       chosen = topCandidates.reduce((best, v) => {
  //         const bestTime = villainFirstSelectedAt[best] ?? Infinity;
  //         const vTime = villainFirstSelectedAt[v] ?? Infinity;
  //         return vTime < bestTime ? v : best;
  //       }, topCandidates[0]);
  //     } else {
  //       // 'latest' - choose the one with largest lastSelectedAt
  //       chosen = topCandidates.reduce((best, v) => {
  //         const bestTime = villainLastSelectedAt[best] ?? -Infinity;
  //         const vTime = villainLastSelectedAt[v] ?? -Infinity;
  //         return vTime > bestTime ? v : best;
  //       }, topCandidates[0]);
  //     }
  //   }

  //   router.push(`/quiz/results/${chosen}`);
  // };
  const calculateResult = (
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

    router.push(`/quiz/results/${picked}`);
  };

  const currentQuestion = questions[currentQuestionIndex];

  // determine how far user has answered to allow navigation
  const answeredIndices = Object.keys(selectedAnswers).length
    ? Object.keys(selectedAnswers).map((k) => Number(k))
    : [];
  const lastAnsweredIndex =
    answeredIndices.length > 0 ? Math.max(...answeredIndices) : -1;

  return (
    <div className="flex items-center justify-center flex-1 relative">
      <div className="flex flex-col items-center justify-center gap-10 md:w-[65%] w-full">
        <div className="flex flex-col items-center justify-center gap-2">
          <LabelText>
            <h4 ref={h4Ref} key={`question-number-${currentQuestionIndex}`}>
              Question {currentQuestionIndex + 1}
            </h4>
          </LabelText>

          <Text
            ref={h2Ref}
            as="h2"
            variant="title"
            className="text-center"
            key={`question-text-${currentQuestionIndex}`}
          >
            {currentQuestion.text}
          </Text>
        </div>

        <div
          ref={buttonsRef}
          key={`buttons-container-${currentQuestionIndex}`}
          className="flex items-center justify-center flex-wrap md:gap-6 gap-10 md:max-w-[55rem]"
        >
          {currentQuestion.answers.map((answer, index) => {
            const meta = selectedAnswers[currentQuestionIndex];
            const isSelected = !!meta && meta.answerIndex === index;
            // const isSelected = selectedAnswers[currentQuestionIndex] === index;
            return (
              <Button
                animated
                size="loose"
                disabled={isAnimating}
                key={`response-button-${index}`}
                onClick={() => handleAnswer(index)}
                className={`text-xs md:w-52 w-[80%] md:h-14 h-14 uppercase ${
                  isSelected ? "ring-2 ring-offset-2" : ""
                }`}
                aria-pressed={isSelected}
              >
                {answer.text}
              </Button>
            );
          })}
        </div>
      </div>

      {/* navigation indicators */}
      <div className="absolute md:inset-[auto_0%_1rem] inset-[auto_0%_0%] lg:w-[65%] md:w-[80%] w-full mx-auto">
        <div
          ref={indicatorsRef}
          className="grid grid-rows-1 grid-cols-[repeat(5,1fr)_auto] w-full"
        >
          {questions.map((_, index) => {
            const isAccessible =
              index <= lastAnsweredIndex || index === currentQuestionIndex;

            return (
              <Indicator
                number={index + 1}
                key={`indicator-${index}`}
                isLast={index + 1 === questions.length}
                isActive={currentQuestionIndex >= index}
                inLineActive={currentQuestionIndex > index}
                handleClick={() => {
                  if (!isAccessible || isAnimating) return;
                  setCurrentQuestionIndex(index);
                }}
                disabled={!isAccessible || isAnimating}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
