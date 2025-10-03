export const SEO_CONFIG = {
  siteName: "Throne Of Gods",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://throneofgods.com",
  defaultTitle: "Throne Of Gods - Discover Your Inner Villain",
  defaultDescription:
    "Embark on a fantasy journey in Erosea. Take our quiz to find out which Throne of Gods villain matches your dark ambitions.",
  defaultKeywords: [
    "fantasy quiz",
    "personality test",
    "villain quiz",
    "fantasy characters",
    "throne of gods",
    "erosea",
    "interactive fiction",
    "character matching",
    "fantasy world",
    "dark fantasy",
  ],
  defaultImage: {
    url: "/images/og-homepage.jpg",
    width: 1200,
    height: 630,
    alt: "Throne of Gods - Fantasy Character Quiz",
  },
  // Mobile-optimized image variants
  mobileImage: {
    url: "/images/og-homepage-mobile.jpg",
    width: 800,
    height: 600,
    alt: "Throne of Gods - Fantasy Character Quiz",
  },
  // Social media platform specific images
  socialImages: {
    facebook: {
      url: "/images/og-facebook.jpg",
      width: 1200,
      height: 630,
      alt: "Throne of Gods - Fantasy Character Quiz",
    },
    twitter: {
      url: "/images/og-twitter.jpg",
      width: 1200,
      height: 675,
      alt: "Throne of Gods - Fantasy Character Quiz",
    },
    instagram: {
      url: "/images/og-instagram.jpg",
      width: 1080,
      height: 1080,
      alt: "Throne of Gods - Fantasy Character Quiz",
    },
  },
  twitterHandle: "@throneofgods",
  author: "Throne of Gods",
  locale: "en_US",
  themeColor: "#1a1a1a",
  // Mobile-specific configurations
  mobile: {
    themeColor: "#1a1a1a",
    backgroundColor: "#000000",
    statusBarStyle: "black-translucent",
    viewportFit: "cover",
    touchIcon: "/images/apple-touch-icon.png",
    maskIcon: "/images/safari-pinned-tab.svg",
    maskIconColor: "#1a1a1a",
  },
} as const;

export const SCHEMA_CONTEXT = "https://schema.org";

export const DEFAULT_FALLBACKS = {
  characterImage: "/images/characters/default-character.jpg",
  characterDescription:
    "A mysterious figure from the world of Erosea with hidden depths and dark ambitions.",
  quizImage: "/images/quiz-default.jpg",
  resultImage: "/images/results-default.jpg",
} as const;
