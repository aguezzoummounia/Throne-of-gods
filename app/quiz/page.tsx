import { quizData } from "@/lib/data";
import Footer from "@/components/global/footer";
import Container from "@/components/global/container";
import { QuizQuestions } from "@/components/quiz/quiz-questions";

const QuizPage: React.FC = () => {
  return (
    <>
      <Container as="section" className="h-svh">
        <QuizQuestions questions={quizData.questions} />
      </Container>
      <Footer />
    </>
  );
};

export default QuizPage;
