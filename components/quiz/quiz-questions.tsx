"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Question, VillainKey } from "@/lib/types";
import Text from "../ui/text";
import Button from "../ui/button-or-link";

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
      <div className="flex flex-col items-center justify-center gap-10 lg:w-[58.33%] xs:w-[83.33%] w-full">
        <div className="flex flex-col items-center justify-center gap-2">
          <Text as="h4" variant="xs" className="text-center uppercase">
            Question {currentQuestionIndex + 1}
          </Text>
          <Text as="h2" variant="title" className="text-center">
            {currentQuestion.text}
          </Text>
        </div>
        <div className="flex items-center justify-center flex-wrap md:gap-6 gap-10">
          {currentQuestion.answers.map((answer, index) => (
            <Button
              animated
              size="loose"
              onClick={() => handleAnswer(answer.villain)}
              className="text-xs md:w-44 w-[80%] md:h-14 h-14 uppercase"
            >
              {answer.text}
            </Button>
          ))}
        </div>
      </div>
      {/* navigation indicators */}
      <div className="bg-orange-950 absolute inset-[auto_0%_1rem] flex items-center justify-center">
        ..........
      </div>
    </div>
  );
}

// <form>
//   <fieldset>
//     <legend>{currentQuestion.text}</legend>
//     {currentQuestion.answers.map((answer, index) => (
//       <div key={index}>
//         <input
//           type="radio"
//           id={`q${currentQuestion.id}-a${index}`}
//           name={`question-${currentQuestion.id}`}
//           value={answer.villain}
//           onChange={() => handleAnswerChange(answer.villain)}
//         />
//         <label htmlFor={`q${currentQuestion.id}-a${index}`}>
//           {answer.text}
//         </label>
//       </div>
//     ))}
//   </fieldset>
// </form>
