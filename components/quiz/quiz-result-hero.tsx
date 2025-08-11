import Text from "../ui/text";
import Image from "next/image";
import { VillainProfile } from "@/lib/types";

interface QuizResultHeroProps {
  slug: string;
  villain: VillainProfile;
}

const QuizResultHero: React.FC<QuizResultHeroProps> = ({ slug, villain }) => {
  // TODO: add gsap animation and image shader loader
  return (
    <div className="w-full h-svh relative">
      <Image
        width={1920}
        height={1080}
        src={villain.image}
        alt={`villain ${slug} image`}
        className="w-full h-full object-cover"
      />
      <header className="absolute bottom-0 left-0 w-full pt-20 md:pb-20 pb-10 px-12 max-md:px-5 bg-gradient-to-t from-black via-zinc-900/70 to-transparent">
        <div className="flex gap-4 flex-col md:items-center justify-center lg:w-[58.33%] xs:w-[83.33%] w-full mx-auto text-center">
          <Text as="h2" variant="title">
            {villain.name}
          </Text>

          <Text as="p" className="font-alegreya">
            {villain.quote}
          </Text>
        </div>
      </header>
    </div>
  );
};

export default QuizResultHero;
