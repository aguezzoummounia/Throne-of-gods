import Image from "next/image";
import { quizData } from "@/lib/data";
import Text from "@/components/ui/text";
import { notFound } from "next/navigation";
import Stat from "@/components/quiz/villain-stats";
import Container from "@/components/global/container";

export default async function QuizResultPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const villain = quizData.villains[slug as keyof typeof quizData.villains];

  if (!villain) return notFound();

  return (
    <div className="min-h-svh">
      <div className="w-full h-svh relative">
        <Image
          width={1920}
          height={1080}
          src={villain.image}
          alt={`villain ${slug} image`}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full pt-20 md:pb-20 pb-10 px-12 max-md:px-5 bg-gradient-to-t from-black via-zinc-900/70 to-transparent">
          <div className="flex gap-4 flex-col md:items-center justify-center lg:w-[58.33%] xs:w-[83.33%] w-full mx-auto md:text-center">
            <Text as="h2" variant="title">
              {villain.name}
            </Text>
            {/* <Text as="p">{villain.quote}</Text> */}
          </div>
        </div>
      </div>
      <Container className="md:pt-30 pt-16">
        <div className="flex flex-col md:gap-20 gap-10">
          <div className="grid md:grid-cols-2 grid-cols-1 md:gap-12 gap-6">
            <div className="flex flex-col gap-y-4">
              <Text as="p">{villain.quote}</Text>
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
          <div className="grid grid-cols-2  md:gap-12 gap-6">
            <div className="">
              // === ABILITIES === // • Whispers of Madness // • Crown of Thorns
            </div>
            <div className="">
              // === RELATIONS === // Allies: Kael // Enemies: The Oracle
            </div>
          </div>
          <div className="lg:w-[58.33%] xs:w-[83.33%] w-full mx-auto text-center">
            <Text as="p">{villain.backstory}</Text>
          </div>
        </div>
      </Container>
    </div>
  );
}
