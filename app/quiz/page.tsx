import { Metadata, Viewport } from "next";
import { quizData } from "@/lib/data";
import Footer from "@/components/global/footer";
import Container from "@/components/global/container";
import { QuizQuestions } from "@/components/quiz/quiz-questions";
import { QuizStructuredData } from "@/components/seo/quiz-structured-data";
import { generateQuizMetadata, generateQuizViewport } from "@/lib/seo/quiz";

// Generate metadata with mobile enhancements
export async function generateMetadata(): Promise<Metadata> {
  const baseMetadata = generateQuizMetadata();

  return {
    ...baseMetadata,
    other: {
      ...baseMetadata.other,
    },
  };
}

export const viewport: Viewport = generateQuizViewport();

const QuizPage: React.FC = () => {
  return (
    <>
      <QuizStructuredData quizData={quizData} />
      <Container as="section" className="h-svh">
        <QuizQuestions questions={quizData.questions} />
      </Container>
      <Footer />
    </>
  );
};

export default QuizPage;
