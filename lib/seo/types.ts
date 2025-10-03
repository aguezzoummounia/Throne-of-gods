export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: {
    url: string;
    width?: number;
    height?: number;
    alt: string;
  };
  // Mobile-specific image variants
  mobileImage?: {
    url: string;
    width?: number;
    height?: number;
    alt: string;
  };
  // Platform-specific social images
  socialImages?: {
    facebook?: {
      url: string;
      width?: number;
      height?: number;
      alt: string;
    };
    twitter?: {
      url: string;
      width?: number;
      height?: number;
      alt: string;
    };
    instagram?: {
      url: string;
      width?: number;
      height?: number;
      alt: string;
    };
  };
  url?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  siteName?: string;
  // Mobile optimization flags
  isMobileOptimized?: boolean;
  mobileViewport?: string;
}

export interface JSONLDSchema {
  "@context": string;
  "@type": string;
  [key: string]: any;
}

export interface WebsiteSchema extends JSONLDSchema {
  "@type": "WebSite";
  name: string;
  url: string;
  description: string;
  potentialAction?: {
    "@type": "SearchAction";
    target: string;
    "query-input": string;
  };
  publisher?: {
    "@type": "Organization";
    name: string;
    url: string;
    description?: string;
    logo?: {
      "@type": "ImageObject";
      url: string;
      width?: number;
      height?: number;
    };
  };
  mainEntity?: {
    "@type": string;
    name: string;
    description: string;
    url: string;
  };
  hasPart?: Array<{
    "@type": "WebPage";
    name: string;
    url: string;
    description: string;
  }>;
}

export interface PersonSchema extends JSONLDSchema {
  "@type": "Person";
  name: string;
  description: string;
  image?:
    | string
    | {
        "@type": "ImageObject";
        url: string;
        caption?: string;
      };
  url?: string;
  alternateName?: string;
  affiliation?:
    | string
    | {
        "@type": "Organization";
        name: string;
      };
  knowsAbout?: string[];
  hasOccupation?: {
    "@type": "Role";
    roleName: string;
  };
  homeLocation?: {
    "@type": "Place";
    name: string;
  };
  additionalProperty?: Array<{
    "@type": "PropertyValue";
    name: string;
    value: string;
  }>;
  subjectOf?: {
    "@type": "Article";
    name: string;
    description: string;
    url: string;
  };
  mainEntityOfPage?: {
    "@type": "WebPage";
    "@id": string;
    name: string;
    description: string;
  };
}

export interface QuizSchema extends JSONLDSchema {
  "@type": "Quiz";
  name: string;
  description: string;
  numberOfQuestions?: number;
  about?: string;
  educationalLevel?: string;
  timeRequired?: string;
  url?: string;
  image?: string;
  author?: {
    "@type": "Organization";
    name: string;
    url: string;
  };
  publisher?: {
    "@type": "Organization";
    name: string;
    url: string;
  };
  datePublished?: string;
  dateModified?: string;
  inLanguage?: string;
  isAccessibleForFree?: boolean;
  interactionStatistic?: {
    "@type": "InteractionCounter";
    interactionType: string;
    userInteractionCount: number;
  };
  hasPart?: Array<{
    "@type": "Question";
    name: string;
    text: string;
    position: number;
    acceptedAnswer?: Array<{
      "@type": "Answer";
      text: string;
    }>;
  }>;
  mainEntity?: {
    "@type": "WebPage";
    name: string;
    url: string;
    description: string;
  };
}

export interface ArticleSchema extends JSONLDSchema {
  "@type": "Article";
  headline: string;
  description: string;
  image?: string;
  author?: {
    "@type": "Person" | "Organization";
    name: string;
  };
  publisher?: {
    "@type": "Organization";
    name: string;
    url: string;
  };
  datePublished?: string;
  dateModified?: string;
  mainEntity?: {
    "@type": "Person";
    name: string;
    description: string;
    url: string;
  };
  isPartOf?: {
    "@type": "Quiz";
    name: string;
    url: string;
  };
}

export interface BreadcrumbSchema extends JSONLDSchema {
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
  }>;
}
