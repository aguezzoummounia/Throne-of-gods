import Text from "../ui/text";
import { cn } from "@/lib/utils";
import AboutCard from "./about-card";

interface AboutChapterProps {
  title: string;
  brief: string;
  image: string;
  details: string;
  className?: string;
  layout?: "default" | "reversed";
}

const AboutChapter = ({
  image,
  title,
  brief,
  details,
  className,
  layout = "default",
}: AboutChapterProps) => {
  return (
    <div
      className={cn(
        "gsap-panel md:w-screen w-[200vw] px-12 max-md:px-5 flex flex-col gap-20 justify-center",
        className
      )}
    >
      <div className="flex items-center justify-evenly gap-10">
        <div className="flex flex-col gap-4">
          <Text
            as="h2"
            variant="lead"
            className="gsap-zoom-in tracking-tight font-semibold max-w-[1100px] uppercase"
          >
            {title}
          </Text>
          <Text
            as="p"
            variant="medium"
            className="gsap-zoom-in max-w-[400px]" // And here
          >
            {brief}
          </Text>
        </div>
        <AboutCard image={image} title={title} />
      </div>
      <Text
        as="p"
        variant="small"
        className="gsap-zoom-in md:max-w-[600px] max-w-[85vw] mx-auto text-center" // And here
      >
        {details}
      </Text>
    </div>
  );
};

export default AboutChapter;
