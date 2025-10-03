import { Metadata, Viewport } from "next";
import { SEOGenerator } from "./generator";
import { SEOConfig, ArticleSchema, BreadcrumbSchema } from "./types";
import { SEO_CONFIG } from "./config";
import { quizData } from "../data";

export interface QuizResultsSEOData {
  characterSlug: string;
  characterName: string;
  characterNickname: string;
  characterImage: string;
  characterQuote: string;
  characterOverview: string;
  characterFaction: string;
  characterAlignment: string;
}

/**
 * Generate personalized metadata for quiz results pages
 */
export function generateQuizResultsMetadata(
  data: QuizResultsSEOData
): Metadata {
  const { characterName, characterNickname, characterImage, characterQuote } =
    data;

  const title = `You Are ${characterName} - ${characterNickname} | ${SEO_CONFIG.siteName}`;
  const description = `Discover your inner villain! Your quiz result reveals you are ${characterName}, ${characterNickname}. ${characterQuote} Share your result and challenge your friends to take the Throne of Gods villain quiz!`;

  const config: SEOConfig = {
    title,
    description,
    keywords: [
      ...SEO_CONFIG.defaultKeywords,
      characterName.toLowerCase(),
      characterNickname.toLowerCase().replace(/^the\s+/, ""),
      "quiz result",
      "personality quiz",
      "villain quiz result",
      "fantasy character quiz",
      "share result",
      "character match",
    ],
    image: {
      url: characterImage,
      width: 1200,
      height: 630,
      alt: `${characterName} - ${characterNickname} quiz result`,
    },
    url: `/quiz/results/${data.characterSlug}`,
    type: "article",
    publishedTime: new Date().toISOString(),
    modifiedTime: new Date().toISOString(),
    author: SEO_CONFIG.author,
    siteName: SEO_CONFIG.siteName,
  };

  return SEOGenerator.generateMetadata(config);
}

/**
 * Generate viewport configuration for quiz results pages
 */
export function generateQuizResultsViewport(
  data: QuizResultsSEOData
): Viewport {
  const config: SEOConfig = {
    title: `${data.characterName} - ${data.characterNickname} | ${SEO_CONFIG.siteName}`,
    description: `Discover your inner villain! Your quiz result reveals you are ${data.characterName}, ${data.characterNickname}.`,
    url: `/quiz/results/${data.characterSlug}`,
    isMobileOptimized: true,
  };

  return SEOGenerator.generateViewport(config);
}

/**
 * Generate Article JSON-LD schema for quiz results
 */
export function generateQuizResultsSchema(
  data: QuizResultsSEOData
): ArticleSchema {
  const {
    characterSlug,
    characterName,
    characterNickname,
    characterImage,
    characterQuote,
    characterOverview,
    characterFaction,
    characterAlignment,
  } = data;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Quiz Result: You Are ${characterName} - ${characterNickname}`,
    description: `Your Throne of Gods villain quiz result reveals your inner ${characterName}. ${characterQuote}`,
    image: characterImage,
    author: {
      "@type": "Organization",
      name: SEO_CONFIG.siteName,
    },
    publisher: {
      "@type": "Organization",
      name: SEO_CONFIG.siteName,
      url: SEO_CONFIG.siteUrl,
    },
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    mainEntity: {
      "@type": "Person",
      name: characterName,
      description: characterOverview,
      url: `${SEO_CONFIG.siteUrl}/characters/${characterSlug}`,
    },
    isPartOf: {
      "@type": "Quiz",
      name: "Throne of Gods Villain Quiz",
      url: `${SEO_CONFIG.siteUrl}/quiz`,
    },
    about: [
      {
        "@type": "Thing",
        name: "Fantasy Character Quiz",
      },
      {
        "@type": "Thing",
        name: "Personality Assessment",
      },
      {
        "@type": "Thing",
        name: characterFaction,
      },
    ],
    keywords: [
      characterName,
      characterNickname,
      "quiz result",
      "villain quiz",
      "fantasy character",
      characterFaction,
      characterAlignment,
    ].join(", "),
  };
}

/**
 * Generate breadcrumb schema for quiz results pages
 */
export function generateQuizResultsBreadcrumbs(
  data: QuizResultsSEOData
): BreadcrumbSchema {
  return SEOGenerator.createBreadcrumbs([
    { name: "Home", url: "/" },
    { name: "Quiz", url: "/quiz" },
    { name: "Results", url: "/quiz/results" },
    { name: `${data.characterName} Result` },
  ]) as BreadcrumbSchema;
}

/**
 * Extract quiz results SEO data from character data
 */
export function extractQuizResultsSEOData(
  characterSlug: string
): QuizResultsSEOData | null {
  const character =
    quizData.villains[characterSlug as keyof typeof quizData.villains];

  if (!character) {
    return null;
  }

  return {
    characterSlug: character.slug,
    characterName: character.name,
    characterNickname: character.nickname,
    characterImage: character.image,
    characterQuote: character.quote,
    characterOverview: character.overview,
    characterFaction: character.stats.faction,
    characterAlignment: character.stats.alignment,
  };
}

/**
 * Generate social sharing optimized metadata for quiz results
 */
export function generateQuizResultsSocialMetadata(
  data: QuizResultsSEOData
): Record<string, string> {
  const { characterName, characterNickname, characterImage } = data;

  return {
    // Twitter specific optimizations
    "twitter:card": "summary_large_image",
    "twitter:title": `I got ${characterName} - ${characterNickname}!`,
    "twitter:description": `I just discovered my inner villain in the Throne of Gods quiz! Take the quiz and find out which villain you are. #ThroneOfGods #VillainQuiz #${characterName.replace(
      /\s+/g,
      ""
    )}`,
    "twitter:image": characterImage,
    "twitter:image:alt": `${characterName} - ${characterNickname} quiz result`,

    // Facebook/Open Graph optimizations
    "og:title": `Quiz Result: ${characterName} - ${characterNickname}`,
    "og:description": `Discover your inner villain! This quiz result reveals the ${characterNickname} within. Share your result and challenge friends to take the Throne of Gods villain quiz!`,
    "og:image": characterImage,
    "og:image:alt": `${characterName} - ${characterNickname} character portrait`,
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:type": "article",

    // Additional sharing optimization
    "article:author": SEO_CONFIG.siteName,
    "article:section": "Quiz Results",
    "article:tag": [
      characterName,
      characterNickname,
      "villain quiz",
      "fantasy quiz",
    ].join(","),
  };
}
