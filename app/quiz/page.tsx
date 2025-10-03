import { Metadata, Viewport } from "next";
import { quizData } from "@/lib/data";
import Footer from "@/components/global/footer";
import Container from "@/components/global/container";
import { QuizQuestions } from "@/components/quiz/quiz-questions";
import { QuizStructuredData } from "@/components/seo/quiz-structured-data";
import {
  generateQuizMetadata,
  generateQuizViewport,
  generateQuizMobileSEO,
} from "@/lib/seo/quiz";

// Helper function to safely convert mobile meta to Next.js compatible format
function sanitizeMobileMeta(
  mobileMeta: Record<string, any>
): Record<string, string> {
  const sanitized: Record<string, string> = {};

  for (const [key, value] of Object.entries(mobileMeta)) {
    if (value !== undefined && value !== null && value !== "") {
      sanitized[key] = String(value);
    }
  }

  return sanitized;
}

// Generate metadata with mobile enhancements
export async function generateMetadata(): Promise<Metadata> {
  const baseMetadata = generateQuizMetadata();
  const mobileEnhancements = generateQuizMobileSEO();

  // Safely convert mobile meta to Next.js compatible format
  const safePWAMeta = sanitizeMobileMeta(mobileEnhancements.pwaMeta);

  return {
    ...baseMetadata,
    other: {
      ...baseMetadata.other,
      ...safePWAMeta,
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
