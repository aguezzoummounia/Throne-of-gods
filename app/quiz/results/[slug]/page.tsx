import { quizData } from "@/lib/data";
import { notFound } from "next/navigation";
import CharacterHero from "@/components/characters/character-hero";
import CharacterTrivia from "@/components/characters/character-trivia";
import CharacterPowers from "@/components/characters/powers/character-powers";
import CharacterOverview from "@/components/characters/character-overview";
import CharacterRelation from "@/components/characters/character-relations";
import CharacterBackstory from "@/components/characters/character-backstory";
import Footer from "@/components/global/footer";

export default async function QuizResultPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const villain = quizData.villains[slug as keyof typeof quizData.villains];

  if (!villain) return notFound();

  return (
    <>
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
