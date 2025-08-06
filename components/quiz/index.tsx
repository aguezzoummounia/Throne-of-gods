"use client";
import Text from "../ui/text";
import { useState } from "react";
import { quizData } from "@/lib/data";
import Button from "../ui/button-or-link";
import Container from "../global/container";
import { QuizQuestions } from "./quiz-questions";

const Quiz: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <Container id="quiz" as="section" className="flex">
      {open ? (
        <QuizQuestions questions={quizData.questions} />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-10 lg:w-[58.33%] xs:w-[83.33%] w-full">
            <Text as="h2" variant="title" className="text-center">
              What Darkness <br /> Dwells Within You?
            </Text>

            <Text
              as="h4"
              variant="lead"
              className="text-center uppercase md:mt-2 mt-4"
            >
              Find the villain lurking in you.
            </Text>
            <Button animated onClick={() => setOpen(true)}>
              Choose your path
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Quiz;
