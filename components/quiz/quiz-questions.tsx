"use client";
import Text from "../ui/text";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Button from "../ui/button-or-link";
import { useRouter } from "next/navigation";
import type { Question, VillainKey } from "@/lib/types";

// TODO: this needs a new button styles
// make questions and answers 5 words max for consistency
// handle the case where a question reflects more than just one character
// add is answered state to indicators
// change indicator line svg

interface QuizClientProps {
  questions: readonly Question[];
}

export function QuizQuestions({ questions }: QuizClientProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [scores, setScores] = useState<Partial<Record<VillainKey, number>>>({});

  const router = useRouter();

  const handleAnswer = (villainKey: VillainKey) => {
    const newScores = { ...scores };
    newScores[villainKey] = (newScores[villainKey] || 0) + 1;
    setScores(newScores);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResult(newScores);
    }
  };

  const calculateResult = (
    finalScores: Partial<Record<VillainKey, number>>
  ) => {
    if (Object.keys(finalScores).length === 0) return;

    // The type for topVillainSlug will be correctly inferred as VillainKey
    const topVillainSlug = Object.entries(finalScores).sort(
      (a, b) => b[1] - a[1]
    )[0][0] as VillainKey;

    router.push(`/quiz/results/${topVillainSlug}`);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex items-center justify-center flex-1 relative">
      <div className="flex flex-col items-center justify-center gap-10 md:w-[65%] w-full">
        <div className="flex flex-col items-center justify-center gap-2">
          <Text as="h4" variant="xs" className="text-center uppercase">
            Question {currentQuestionIndex + 1}
          </Text>
          <Text as="h2" variant="title" className="text-center">
            {currentQuestion.text}
          </Text>
        </div>
        <div className="flex items-center justify-center flex-wrap md:gap-6 gap-10 md:max-w-[55rem]">
          {currentQuestion.answers.map((answer, index) => (
            <Button
              animated
              size="loose"
              key={`response-button-${index}`}
              onClick={() => handleAnswer(answer.villain)}
              className="text-xs md:w-52 w-[80%] md:h-14 h-14 uppercase"
            >
              {answer.text}
            </Button>
          ))}
        </div>
      </div>
      {/* navigation indicators */}
      <div className="absolute inset-[auto_0%_1rem] flex items-center justify-center">
        {questions.map((_, index) => {
          return (
            <Indicator
              number={index + 1}
              isLast={index + 1 === questions.length}
              isActive={currentQuestionIndex === index}
              handleClick={() => setCurrentQuestionIndex(index)}
            />
          );
        })}
      </div>
    </div>
  );
}

const Indicator: React.FC<{
  number: number;
  isLast?: boolean;
  isActive: boolean;
  handleClick: () => void;
}> = ({ number, isLast, isActive, handleClick }) => {
  return (
    <>
      <button
        role="button"
        onClick={handleClick}
        title={`skip to question ${number}`}
        className={cn(
          "cursor-pointer relative block md:w-14 md:h-14 w-10 h-10 transition-opacity opacity-70",
          isActive && "opacity-100"
        )}
      >
        <span className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] flex items-center justify-center p-1.5 text-[#8F7E77] font-cinzeldecorative md:text-sm text-xs">
          {number}
        </span>
        <svg
          fill="none"
          viewBox="0 0 88 89"
          xmlns="http://www.w3.org/2000/svg"
          className={cn(
            "transition-transform ease-[cubic-bezier(.25,1,.5,1)] hover:scale-110 duration-[.6s] w-full h-full absolute inset-0",
            `delay-[${number * 0.1}]`
          )}
        >
          <g filter="url(#filter0_f_6587_3779)">
            <path
              fill="none"
              d="M79.2772 39.8839C85.1004 61.603 71.2873 75.883 45.8134 82.7045C26.5499 87.8629 13.5523 68.9115 8.57604 50.3515C3.11311 26.843 21.1028 12.7143 40.3664 7.55583C59.6299 2.3974 72.3952 14.2159 79.2772 39.8839Z"
              stroke="#8F7E77"
              className="rotate-svg-animation-reverse"
            ></path>
          </g>
          <path
            fill="none"
            className="rotate-svg-animation-reverse"
            d="M79.6823 40.689C85.4941 62.6302 71.6766 77.0648 46.2038 83.9693C26.9412 89.1905 13.955 70.0491 8.98853 51.2993C3.53783 27.5499 21.5312 13.2661 40.7938 8.04493C60.0564 2.82373 72.8138 14.7584 79.6823 40.689Z"
            stroke="#8F7E77"
          ></path>
          <path
            fill="none"
            opacity="0.4"
            className="rotate-svg-animation"
            d="M62.4666 15.6093C84.6472 25.7798 87.7796 45.5223 77.024 68.9216C68.8907 86.6163 44.3981 83.6003 25.4438 74.9092C1.98109 63.2791 1.68789 40.5466 9.82126 22.8519C17.9546 5.1572 36.2532 3.58968 62.4666 15.6093Z"
            stroke="#8F7E77"
          ></path>
          <defs>
            <filter
              id="filter0_f_6587_3779"
              x="3.08325"
              y="1.86932"
              width="82.0162"
              height="86.196"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              ></feBlend>
              <feGaussianBlur
                stdDeviation="2"
                result="effect1_foregroundBlur_6587_3779"
              ></feGaussianBlur>
            </filter>
          </defs>
        </svg>
      </button>
      {!isLast && (
        <div className="h-[5px] max-md:w-[30px] flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            viewBox="0 0 165 9"
            fill="none"
            class="quiz-line is-inactive"
          >
            <path
              d="M10.6765 4.64002H6.67651V4.13195H10.6765V4.64002Z"
              fill="currentColor"
            ></path>
            <path
              d="M15.6765 4.64002H18.6765V4.13195H15.6765V4.64002Z"
              fill="currentColor"
            ></path>
            <path
              d="M27.6765 4.64002H21.6765V4.13195H27.6765V4.64002Z"
              fill="currentColor"
            ></path>
            <path
              d="M35.6765 4.64002H44.6765V4.13195H35.6765V4.64002Z"
              fill="currentColor"
            ></path>
            <path
              d="M53.6765 4.64002H47.6765V4.13195H53.6765V4.64002Z"
              fill="currentColor"
            ></path>
            <path
              d="M56.6765 4.64002H62.6765V4.13195H56.6765V4.64002Z"
              fill="currentColor"
            ></path>
            <path
              d="M76.6765 4.64002H69.6765V4.13195H76.6765V4.64002Z"
              fill="currentColor"
            ></path>
            <path
              d="M79.6765 4.64002H82.6765V4.13195H79.6765V4.64002Z"
              fill="currentColor"
            ></path>
            <path
              d="M86.6765 4.64002H83.6765V4.13195H86.6765V4.64002Z"
              fill="currentColor"
            ></path>
            <path
              d="M87.6765 4.64002H91.6765V4.13195H87.6765V4.64002Z"
              fill="currentColor"
            ></path>
            <path
              d="M102.677 4.64002H97.6765V4.13195H102.677V4.64002Z"
              fill="currentColor"
            ></path>
            <path
              d="M104.677 4.64002H109.677V4.13195H104.677V4.64002Z"
              fill="currentColor"
            ></path>
            <path
              d="M119.677 4.64002H114.677V4.13196H119.677V4.64002Z"
              fill="currentColor"
            ></path>
            <path
              d="M122.677 4.64002H128.677V4.13196H122.677V4.64002Z"
              fill="currentColor"
            ></path>
            <path
              d="M135.677 4.64002H131.677V4.13196H135.677V4.64002Z"
              fill="currentColor"
            ></path>
            <path
              d="M141.677 4.64002H146.677V4.13196H141.677V4.64002Z"
              fill="currentColor"
            ></path>
            <path
              d="M156.677 4.64002H149.677V4.13196H156.677V4.64002Z"
              fill="currentColor"
            ></path>
            <path
              d="M160.677 4.64002H164.422V9.00024H164.931V0.000244141H164.422V4.13196H160.677V4.64002Z"
              fill="currentColor"
            ></path>
            <path
              d="M4.67651 4.13195V4.64002H0.676514V4.13195H4.67651Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      )}
    </>
  );
};
