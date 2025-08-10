import { quizData } from "@/lib/data";
import Container from "@/components/global/container";
import { QuizQuestions } from "@/components/quiz/quiz-questions";

const QuizPage: React.FC = () => {
  return (
    <Container as="section" className="flex">
      <QuizQuestions questions={quizData.questions} />
    </Container>
  );
};

export default QuizPage;
