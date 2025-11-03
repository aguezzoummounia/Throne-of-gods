import {
  generateHomepageSchemas,
  generateHomepageMetadata,
  generateHomepageMobileSEO,
} from "@/lib/seo/homepage";
import Map from "@/components/map";
import type { Metadata } from "next";
import Quiz from "@/components/quiz";
import Hero from "@/components/hero/hero";
import About from "@/components/about/about";
import Footer from "@/components/global/footer";
import CharactersSection from "@/components/characters-section";
import JSONLDScript from "@/components/seo/json-ld-script";
import RadialAnimatedStrips from "@/components/radial-animated-strips";

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

// Generate dynamic metadata for homepage
export async function generateMetadata(): Promise<Metadata> {
  const baseMetadata = generateHomepageMetadata();

  // Add mobile PWA enhancements
  const mobileEnhancements = generateHomepageMobileSEO();

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

export default function Home() {
  // Generate JSON-LD schemas for homepage
  const schemas = generateHomepageSchemas();

  return (
    <>
      {/* JSON-LD structured data for homepage */}
      <JSONLDScript schemas={schemas} />

      <Hero />
      <About />
      <CharactersSection />
      <Map />
      <Quiz />
      <Footer />
    </>
  );
}
