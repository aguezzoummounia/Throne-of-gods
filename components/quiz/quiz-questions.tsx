"use client";
import gsap from "gsap";
import Text from "../ui/text";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useQuiz } from "./useQuiz";
import Portal from "../global/portal";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import LabelText from "../ui/label-text";
import Indicator from "./step-indicator";
import AnswerButton from "./answer-button";
import { useRouter } from "next/navigation";
import type { Question } from "@/lib/types";
import BackgroundSvg from "./background-svg";
import { slideInOut } from "../global/header";
import { useAudio } from "@/context/sound-context";
import QuizResultPreloader from "./quiz-result-preloader";
import { useTransitionRouter } from "next-view-transitions";

gsap.registerPlugin(useGSAP, SplitText);

type TieBreaker = "earliest" | "random";
interface QuizClientProps {
  tieBreaker?: TieBreaker;
  questions: readonly Question[];
}

export function QuizQuestions({
  questions,
  tieBreaker = "earliest",
}: QuizClientProps) {
  // const router = useRouter();
  const seqRef = useRef<number>(0);
  const { playSlideSound } = useAudio();
  const h4Ref = useRef<HTMLHeadingElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorsRef = useRef<HTMLDivElement>(null);

  const {
    result,
    isAnimating,
    isLastQuestion,
    currentQuestion,
    selectedAnswers,
    lastAnsweredIndex,
    currentQuestionIndex,
    goBack,
    setResult,
    goToQuestion,
    computeScores,
    setIsAnimating,
    calculateResult,
    setSelectedAnswers,
    setCurrentQuestionIndex,
  } = useQuiz(questions, tieBreaker);

  const router = useTransitionRouter();
  useGSAP(
    () => {
      if (isAnimating) return;
      const tl = gsap.timeline();

      const h4Split = new SplitText(h4Ref.current, {
        type: "chars",
        smartWrap: true,
        autoSplit: true,
        onSplit: (self) => {
          let splitTween = gsap.from(self.chars, {
            autoAlpha: 0,
            ease: "back.out",
            stagger: { amount: 0.5, from: "random" },
          });
          tl.add(splitTween);
          return splitTween;
        },
      });

      const h2Split = new SplitText(h2Ref.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) => {
          let splitTween = gsap.from(self.lines, {
            opacity: 0,
            stagger: 0.2,
            duration: 0.8,
            yPercent: 100,
          });
          tl.add(splitTween, "<");
          return splitTween;
        },
      });
      const buttons = gsap.utils.toArray<HTMLButtonElement>(
        buttonsRef.current?.children || []
      );

      tl.from(
        buttons,
        { y: 20, opacity: 0, duration: 0.8, stagger: 0.16 },
        "-=.6"
      );

      return () => {
        h4Split.revert();
        h2Split.revert();
      };
    },
    { scope: containerRef, dependencies: [isAnimating, currentQuestionIndex] }
  );

  // animating indicators
  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.from(indicatorsRef.current, {
        y: 20,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
      });
    },
    { scope: containerRef }
  );

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
    playSlideSound();
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

    tl.to(h2Ref.current, { opacity: 0, y: -20, duration: 0.5 }, "-=.1");
    tl.to(buttonsRef.current, { opacity: 0, y: -20, duration: 0.5 }, "-=.3");
  };

  return (
    <div
      ref={containerRef}
      className="h-full w-full relative flex items-center justify-center"
    >
      <div className="md:[&>svg]:w-[50%] [&>svg]:w-full absolute inset-0 flex items-center justify-center">
        <BackgroundSvg className="text-bronze/30 aspect-square" />
      </div>
      <div className="flex flex-col items-center justify-center gap-10 md:w-[65%] w-full">
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
          <LabelText>
            <h4
              ref={h4Ref}
              className="font-alegreya uppercase"
              key={`question-number-${currentQuestionIndex}`}
            >
              Question
              <span className="pl-2 text-4l">{currentQuestionIndex + 1}</span>
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
                className={cn("lg:w-60 md:w-52 w-full uppercase")}
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
            const isAnswered = index in selectedAnswers;
            const isAccessible =
              index <= lastAnsweredIndex || index === currentQuestionIndex;

            return (
              <Indicator
                number={index + 1}
                isAccessible={isAnswered}
                key={`indicator-${index}`}
                isLast={index + 1 === questions.length}
                isActive={currentQuestionIndex >= index}
                inLineActive={currentQuestionIndex > index}
                handleClick={() => goToQuestion(index)}
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
            onFinish={() => {
              router.push(result.href, {
                onTransitionReady: slideInOut,
              });
            }}
            goBack={() => goBack()}
          />
        </Portal>
      )}
    </div>
  );
}
