import { Metadata, Viewport } from "next";
import { SEOConfig, QuizSchema, BreadcrumbSchema } from "./types";
import { SEOGenerator } from "./generator";
import { SchemaBuilder } from "./schema-builder";
import { MobileSEO } from "./mobile";
import { SEO_CONFIG } from "./config";

export interface QuizData {
  questions: ReadonlyArray<{
    readonly id: number;
    readonly text: string;
    readonly answers: ReadonlyArray<{
      readonly text: string;
      readonly villains: readonly string[];
    }>;
  }>;
}

const quizConfig: SEOConfig = {
  title: "Quiz | Discover Your Inner Villain",
  description:
    "Discover your inner villain with our immersive Throne of Gods character quiz. Answer 6 thought-provoking questions about power, betrayal, and legacy to find which of 7 legendary villains matches your dark ambitions. From the Godless Emperor to the Poison Serpent, uncover your villainous destiny.",
  keywords: [
    "fantasy character quiz",
    "villain personality test",
    "throne of gods quiz",
    "fantasy villain quiz",
    "character personality test",
    "epic fantasy quiz",
    "villain archetype quiz",
    "fantasy character matching",
    "dark fantasy quiz",
    "personality quiz fantasy",
  ],
  image: {
    url: `${SEO_CONFIG.siteUrl}/quiz-bg-svg.svg`,
    width: 1200,
    height: 630,
    alt: "Throne of Gods Villain Quiz - Discover Your Dark Destiny",
  },
  mobileImage: {
    url: `${SEO_CONFIG.siteUrl}/images/quiz-mobile.jpg`,
    width: 800,
    height: 600,
    alt: "Throne of Gods Villain Quiz - Mobile",
  },
  socialImages: {
    facebook: {
      url: `${SEO_CONFIG.siteUrl}/images/quiz-facebook.jpg`,
      width: 1200,
      height: 630,
      alt: "Throne of Gods Villain Quiz - Facebook",
    },
    twitter: {
      url: `${SEO_CONFIG.siteUrl}/images/quiz-twitter.jpg`,
      width: 1200,
      height: 675,
      alt: "Throne of Gods Villain Quiz - Twitter",
    },
    instagram: {
      url: `${SEO_CONFIG.siteUrl}/images/quiz-instagram.jpg`,
      width: 1080,
      height: 1080,
      alt: "Throne of Gods Villain Quiz - Instagram",
    },
  },
  url: `/quiz`,
  type: "website",
  author: SEO_CONFIG.author,
  siteName: SEO_CONFIG.siteName,
  isMobileOptimized: true,
};

/**
 * Generate comprehensive SEO metadata for the quiz page
 */
export function generateQuizMetadata(): Metadata {
  return SEOGenerator.generateMetadata(quizConfig);
}

/**
 * Generate viewport configuration for the quiz page
 */
export function generateQuizViewport(): Viewport {
  return SEOGenerator.generateViewport(quizConfig);
}

/**
 * Generate Quiz JSON-LD structured data
 */
export function generateQuizSchema(quizData: QuizData): QuizSchema {
  const schema: QuizSchema = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: "Which Throne of Gods Villain Are You?",
    description:
      "An immersive personality quiz that matches you with one of 7 legendary villains from the Throne of Gods universe based on your choices about power, betrayal, and ambition.",
    numberOfQuestions: quizData.questions.length,
    about:
      "Fantasy character personality assessment focusing on villainous archetypes and dark ambitions",
    educationalLevel: "General audience",
    timeRequired: "PT3M", // 3 minutes in ISO 8601 duration format
    url: `${SEO_CONFIG.siteUrl}/quiz`,
    image: `${SEO_CONFIG.siteUrl}/quiz-bg-svg.svg`,
    author: {
      "@type": "Organization",
      name: SEO_CONFIG.siteName,
      url: SEO_CONFIG.siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: SEO_CONFIG.siteName,
      url: SEO_CONFIG.siteUrl,
    },
    datePublished: "2024-01-01T00:00:00Z",
    dateModified: new Date().toISOString(),
    inLanguage: "en-US",
    isAccessibleForFree: true,
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/CommentAction",
      userInteractionCount: 1000, // Estimated engagement
    },
    hasPart: quizData.questions.map((question, index) => ({
      "@type": "Question",
      name: `Question ${question.id}`,
      text: question.text,
      position: index + 1,
      acceptedAnswer: question.answers.map((answer) => ({
        "@type": "Answer",
        text: answer.text,
      })),
    })),
    mainEntity: {
      "@type": "WebPage",
      name: "Throne of Gods Villain Quiz",
      url: `${SEO_CONFIG.siteUrl}/quiz`,
      description:
        "Interactive personality quiz to discover which Throne of Gods villain matches your dark ambitions",
    },
  };

  return schema;
}

/**
 * Generate breadcrumb schema for quiz page
 */
export function generateQuizBreadcrumbSchema(): BreadcrumbSchema {
  const schema: BreadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SEO_CONFIG.siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Quiz",
      },
    ],
  };

  return schema;
}

/**
 * Generate social sharing optimized metadata for quiz promotion
 */
export function generateQuizSocialMetadata(): Record<string, string> {
  return {
    // Twitter specific
    "twitter:card": "summary_large_image",
    "twitter:title": "🔥 Which Throne of Gods Villain Are You? Take the Quiz!",
    "twitter:description":
      "Discover your dark destiny! Answer 6 questions about power & betrayal to find your villainous match from 7 legendary characters. #ThroneOfGods #VillainQuiz",
    "twitter:image": `${SEO_CONFIG.siteUrl}/quiz-bg-svg.svg`,

    // Facebook/Open Graph specific
    "og:title": "Which Throne of Gods Villain Are You? | Epic Fantasy Quiz",
    "og:description":
      "Uncover your inner villain with our immersive character quiz. From the Godless Emperor to the Poison Serpent - which legendary villain matches your ambitions?",
    "og:image": `${SEO_CONFIG.siteUrl}/quiz-bg-svg.svg`,
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:type": "website",
    "og:url": `${SEO_CONFIG.siteUrl}/quiz`,

    // Additional engagement tags
    "article:tag":
      "fantasy quiz, villain quiz, personality test, character quiz",
    "theme-color": "#1a1a1a",
  };
}

/**
 * Get quiz-specific keywords for SEO optimization
 */
export function getQuizKeywords(): string[] {
  return [
    "fantasy character quiz",
    "villain personality test",
    "throne of gods quiz",
    "fantasy villain quiz",
    "character personality test",
    "epic fantasy quiz",
    "villain archetype quiz",
    "fantasy character matching",
    "dark fantasy quiz",
    "personality quiz fantasy",
    "which villain are you",
    "fantasy villain test",
    "character alignment quiz",
    "dark character quiz",
    "fantasy personality quiz",
  ];
}

/**
 * Generate mobile-specific quiz SEO enhancements
 */
export function generateQuizMobileSEO() {
  const mobileConfig: SEOConfig = {
    title: "Which Throne of Gods Villain Are You?",
    description:
      "Discover your inner villain with our immersive character quiz. Answer questions about power and betrayal to find your villainous match.",
    mobileImage: {
      url: `${SEO_CONFIG.siteUrl}/images/quiz-mobile.jpg`,
      width: 800,
      height: 600,
      alt: "Throne of Gods Villain Quiz - Mobile",
    },
    socialImages: {
      facebook: {
        url: `${SEO_CONFIG.siteUrl}/images/quiz-facebook.jpg`,
        width: 1200,
        height: 630,
        alt: "Throne of Gods Villain Quiz - Facebook",
      },
      twitter: {
        url: `${SEO_CONFIG.siteUrl}/images/quiz-twitter.jpg`,
        width: 1200,
        height: 675,
        alt: "Throne of Gods Villain Quiz - Twitter",
      },
      instagram: {
        url: `${SEO_CONFIG.siteUrl}/images/quiz-instagram.jpg`,
        width: 1080,
        height: 1080,
        alt: "Throne of Gods Villain Quiz - Instagram",
      },
    },
    url: `/quiz`,
    isMobileOptimized: true,
  };

  return {
    pwaMeta: MobileSEO.generateMobilePWAMeta(mobileConfig),
    socialSharing: MobileSEO.generateMobileSocialSharing(mobileConfig),
    validation: MobileSEO.validateMobileConfig(mobileConfig),
    previewUrls: MobileSEO.generateMobilePreviewUrls("/quiz"),
  };
}
