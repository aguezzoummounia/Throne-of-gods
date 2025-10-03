import { notFound } from "next/navigation";
import { Metadata, Viewport } from "next";
import { charactersData } from "@/lib/data";
import { CharacterSEO } from "@/lib/seo/character";
import CharacterStructuredData from "@/components/seo/character-structured-data";
import Footer from "@/components/global/footer";
import NextCharacter from "@/components/characters/next-character";
import CharacterHero from "@/components/characters/character-hero";
import CharacterTrivia from "@/components/characters/character-trivia";
import CharacterOverview from "@/components/characters/character-overview";
import CharacterRelation from "@/components/characters/character-relations";
import CharacterBackstory from "@/components/characters/character-backstory";
import CharacterPowers from "@/components/characters/powers/character-powers";

// Generate metadata for character pages
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const character = charactersData[slug as keyof typeof charactersData];

  if (!character) {
    return CharacterSEO.generateFallbackMetadata(slug);
  }

  return CharacterSEO.generateCharacterMetadata(character);
}

// Generate viewport for character pages
export async function generateViewport({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Viewport> {
  const slug = (await params).slug;
  const character = charactersData[slug as keyof typeof charactersData];

  if (!character) {
    // Return default viewport for fallback
    return {
      width: "device-width",
      initialScale: 1,
      maximumScale: 1,
      userScalable: false,
    };
  }

  return CharacterSEO.generateCharacterViewport(character);
}

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const character = charactersData[slug as keyof typeof charactersData];

  if (!character) return notFound();

  const otherSlugs = Object.keys(charactersData).filter(
    (s) => s !== slug
  ) as (keyof typeof charactersData)[];

  // Pick a random slug from the remaining ones
  const randomIndex = Math.floor(Math.random() * otherSlugs.length);
  const randomSlug = otherSlugs[randomIndex];
  const randomCharacter = charactersData[randomSlug];

  return (
    <>
      <CharacterStructuredData character={character} />
      <CharacterHero
        name={character.name}
        image={character.image}
        nickname={character.nickname}
      />
      <CharacterOverview
        stats={character.stats}
        quote={character.quote}
        overview={character.overview}
      />
      <CharacterRelation data={character.relations} />
      <CharacterPowers data={character.powers} />
      <CharacterBackstory data={character.backstory} />

      {character.trivia && character.trivia.length > 0 && (
        <CharacterTrivia data={character.trivia} />
      )}
      <NextCharacter
        slug={randomSlug}
        name={randomCharacter.name}
        image={randomCharacter.image}
      />
      <Footer />
    </>
  );
}
