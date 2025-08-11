import { quizData } from "@/lib/data";
import Text from "@/components/ui/text";
import { notFound } from "next/navigation";
import Stat from "@/components/quiz/villain-stats";
import Container from "@/components/global/container";
import QuizResultHero from "@/components/quiz/quiz-result-hero";

export default async function QuizResultPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const villain = quizData.villains[slug as keyof typeof quizData.villains];

  if (!villain) return notFound();

  return (
    <section className="min-h-svh">
      {/* TODO: fix this typescript error */}
      <QuizResultHero villain={villain} slug={slug} />
      <Container className="md:pt-30 pt-16">
        <div className="flex flex-col md:gap-20 gap-10">
          <div className="grid md:grid-cols-2 grid-cols-1 md:gap-12 gap-6">
            <div className="flex flex-col gap-y-4">
              <Text as="p">{villain.nickname}</Text>
              <Text as="p">{villain.overview}</Text>
            </div>
            <div className="grid gap-2.5">
              <Stat title="Age" value={villain.stats.age} />
              <Stat title="Location" value={villain.stats.location} />
              <Stat title="Status" value={villain.stats.status} />
              <Stat title="Race" value={villain.stats.race} />
              <Stat title="Role" value={villain.stats.role} />
              <Stat title="Faction" value={villain.stats.faction} />
              <Stat title="Alignment" value={villain.stats.alignment} />
            </div>
          </div>
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {villain.relations.map((stat, i) => (
              <div
                key={i}
                className="bg-black/40 border border-red-700 p-3 rounded-lg text-center"
              >
                <h3 className="text-yellow-300 font-bold">{stat}</h3>
                {/* <p className="text-lg">{stat.value}</p> */}
              </div>
            ))}
          </section>

          {/* Relics of Power */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold mb-4 text-yellow-400 border-b border-red-700">
              Relics of Power
            </h2>
            <ul className="space-y-4">
              {villain.powers.map((power, i) => (
                <li
                  key={i}
                  className="bg-black/50 border border-yellow-700 p-4 rounded-lg shadow-lg hover:shadow-red-900/50 transition"
                >
                  <h3 className="text-xl text-red-400 font-semibold">
                    {power}
                  </h3>
                  {/* <p className="text-gray-200">{power.description}</p> */}
                </li>
              ))}
            </ul>
          </section>
          {/* <div className="grid grid-cols-2  md:gap-12 gap-6">
            <div className="">
              // === ABILITIES === // • Whispers of Madness // • Crown of Thorns
            </div>
            <div className="">
              // === RELATIONS === // Allies: Kael // Enemies: The Oracle
            </div>
          </div> */}
          <div className="lg:w-[58.33%] xs:w-[83.33%] w-full mx-auto text-center text-2xl">
            <h2 className="text-3xl font-bold mb-4 text-yellow-400 border-b border-red-700">
              Chronicle of Sin
            </h2>
            <div
              dangerouslySetInnerHTML={{ __html: villain.backstory }}
              className="grid gap-8"
            />
          </div>
          {villain.trivia && villain.trivia.length > 0 && (
            <section className="mb-8">
              <h2 className="text-3xl font-bold mb-4 text-yellow-400 border-b border-red-700">
                Whispered Truths
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 italic">
                {villain.trivia.map((fact, i) => (
                  <li key={i} className="hover:text-red-300 transition">
                    {fact}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </Container>
    </section>
  );
}
