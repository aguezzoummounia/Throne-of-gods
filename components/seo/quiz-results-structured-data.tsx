import { SEOGenerator } from "@/lib/seo/generator";
import {
  generateQuizResultsSchema,
  generateQuizResultsBreadcrumbs,
  QuizResultsSEOData,
} from "@/lib/seo/quiz-results";

interface QuizResultsStructuredDataProps {
  data: QuizResultsSEOData;
}

/**
 * Quiz Results Structured Data Component
 * Renders JSON-LD schema for quiz result pages including Article schema and breadcrumbs
 */
export default function QuizResultsStructuredData({
  data,
}: QuizResultsStructuredDataProps) {
  const articleSchema = generateQuizResultsSchema(data);
  const breadcrumbSchema = generateQuizResultsBreadcrumbs(data);

  return (
    <>
      {/* Article Schema for Quiz Result */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: SEOGenerator.generateJSONLDScript(articleSchema),
        }}
      />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: SEOGenerator.generateJSONLDScript(breadcrumbSchema),
        }}
      />
    </>
  );
}
