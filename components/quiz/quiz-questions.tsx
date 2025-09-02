"use client";
import gsap from "gsap";
import Text from "../ui/text";
import { cn } from "@/lib/utils";
import Portal from "../global/portal";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import LabelText from "../ui/label-text";
import { useRef, useState } from "react";
import Indicator from "./step-indicator";
import AnswerButton from "./answer-button";
import { useRouter } from "next/navigation";
import type { Question, VillainKey } from "@/lib/types";
import QuizResultPreloader from "./quiz-result-preloader";

gsap.registerPlugin(SplitText);

type TieBreaker = "earliest" | "random";
interface QuizClientProps {
  tieBreaker?: TieBreaker;
  questions: readonly Question[];
}

interface AnswerMeta {
  seq: number; // sequence number of when it was answered
  answerIndex: number;
}

export function QuizQuestions({
  questions,
  tieBreaker = "earliest",
}: QuizClientProps) {
  const router = useRouter();

  const seqRef = useRef<number>(0);
  const h4Ref = useRef<HTMLHeadingElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const indicatorsRef = useRef<HTMLDivElement>(null);

  const [isAnimating, setIsAnimating] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Partial<Record<number, AnswerMeta>>
  >({});
  const [result, setResult] = useState<{ open: boolean; href: string }>({
    open: false,
    href: "",
  });

  useGSAP(
    () => {
      if (isAnimating) return;
      const h4Split = new SplitText(h4Ref.current, {
        type: "chars",
        smartWrap: true,
      });
      const h2Split = new SplitText(h2Ref.current, {
        type: "chars",
        smartWrap: true,
      });
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

  const handleAnswer = (answerIndex: number) => {
    if (isAnimating) return;
    // set true immediately to avoid double clicks while we handle logic
    setIsAnimating(true);

    const seq = seqRef.current++;
    const lastQuestion = currentQuestionIndex === questions.length - 1;
    if (lastQuestion) {
      // Skip exit animations entirely for the final answer.
      // Use functional update so we compute result from the fresh object.
      setSelectedAnswers((prev) => {
        const newSelected = {
          ...prev,
          [currentQuestionIndex]: { answerIndex, seq },
        };
        return newSelected;
      });
      const newSelectedAnswers = {
        ...selectedAnswers,
        [currentQuestionIndex]: { answerIndex, seq },
      };
      const { scores, earliestSeqForVillain } =
        computeScores(newSelectedAnswers);
      const path = calculateResult(scores, earliestSeqForVillain);
      setResult({ open: true, href: path as string });
      // give path to the popup
      // still set false to keep state consistent in case push is replaced.
      setIsAnimating(false);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setSelectedAnswers((prev) => {
          const newSelected = {
            ...prev,
            [currentQuestionIndex]: { answerIndex, seq },
          };

          return newSelected;
        });
        // advance to next question
        setCurrentQuestionIndex((idx) => idx + 1);
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

    return `/quiz/results/${picked}`;
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
          className="flex items-stretch justify-center flex-wrap md:gap-6 gap-2 md:max-w-[55rem]"
        >
          {currentQuestion.answers.map((answer, index) => {
            const meta = selectedAnswers[currentQuestionIndex];
            const isSelected = !!meta && meta.answerIndex === index;

            return (
              <AnswerButton
                isActive={isSelected}
                animated={true}
                disabled={isAnimating}
                aria-pressed={isSelected}
                key={`response-button-${index}`}
                onClick={() => handleAnswer(index)}
                className={cn("md:w-52 w-full uppercase")}
              >
                {answer.text}
              </AnswerButton>
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
      {result.open && (
        <Portal>
          <QuizResultPreloader
            open={result.open}
            onFinish={() => router.push(result.href)}
            goBack={() => setResult({ open: false, href: "" })}
          />
        </Portal>
      )}
    </div>
  );
}
