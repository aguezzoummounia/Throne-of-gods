import { quizData } from "@/lib/data";
import { notFound } from "next/navigation";
import { Metadata, Viewport } from "next";
import CharacterHero from "@/components/characters/character-hero";
import CharacterTrivia from "@/components/characters/character-trivia";
import CharacterPowers from "@/components/characters/powers/character-powers";
import CharacterOverview from "@/components/characters/character-overview";
import CharacterRelation from "@/components/characters/character-relations";
import CharacterBackstory from "@/components/characters/character-backstory";
import Footer from "@/components/global/footer";
import QuizResultsStructuredData from "@/components/seo/quiz-results-structured-data";
import {
  generateQuizResultsMetadata,
  generateQuizResultsViewport,
  extractQuizResultsSEOData,
} from "@/lib/seo/quiz-results";

/**
 * Generate metadata for quiz results pages
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const seoData = extractQuizResultsSEOData(slug);

  if (!seoData) {
    return {
      title: "Quiz Result Not Found",
      description: "The requested quiz result could not be found.",
    };
  }

  return generateQuizResultsMetadata(seoData);
}

/**
 * Generate viewport for quiz results pages
 */
export async function generateViewport({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Viewport> {
  const slug = (await params).slug;
  const seoData = extractQuizResultsSEOData(slug);

  if (!seoData) {
    // Return default viewport for fallback
    return {
      width: "device-width",
      initialScale: 1,
      maximumScale: 1,
      userScalable: false,
    };
  }

  return generateQuizResultsViewport(seoData);
}

export default async function QuizResultPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const villain = quizData.villains[slug as keyof typeof quizData.villains];

  if (!villain) return notFound();

  // Extract SEO data for structured data
  const seoData = extractQuizResultsSEOData(slug);

  return (
    <>
      {/* SEO Structured Data */}
      {seoData && <QuizResultsStructuredData data={seoData} />}

      <CharacterHero
        name={villain.name}
        image={villain.image}
        nickname={villain.nickname}
      />
      <CharacterOverview
        stats={villain.stats}
        quote={villain.quote}
        overview={villain.overview}
      />
      <CharacterRelation data={villain.relations} />
      <CharacterPowers data={[...villain.powers]} />
      <CharacterBackstory data={villain.backstory} />
      {villain.trivia && villain.trivia.length > 0 && (
        <CharacterTrivia data={villain.trivia} />
      )}
      <Footer />
    </>
  );
}
