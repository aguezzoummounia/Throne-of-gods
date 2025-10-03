import {
  generateQuizSchema,
  generateQuizBreadcrumbSchema,
} from "@/lib/seo/quiz";
import type { QuizData } from "@/lib/seo/quiz";

interface QuizStructuredDataProps {
  quizData: QuizData;
}

/**
 * Quiz Structured Data Component
 * Renders JSON-LD structured data for quiz pages to enhance SEO and search result appearance
 */
export function QuizStructuredData({ quizData }: QuizStructuredDataProps) {
  const quizSchema = generateQuizSchema(quizData);
  const breadcrumbSchema = generateQuizBreadcrumbSchema();

  return (
    <>
      {/* Quiz Schema */}
      <script
        id="quiz-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(quizSchema),
        }}
      />

      {/* Breadcrumb Schema */}
      <script
        id="quiz-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  );
}

export default QuizStructuredData;
