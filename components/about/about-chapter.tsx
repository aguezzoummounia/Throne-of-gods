import Text from "../ui/text";
import { cn } from "@/lib/utils";
import AboutCard from "./about-card";

interface AboutChapterProps {
  title: string;
  brief: string;
  image: string;
  details: string;
  className?: string;
}

const AboutChapter = ({
  image,
  title,
  brief,
  details,
  className,
}: AboutChapterProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-20 items-center  border border-red-950 relative md:min-h-[650px] min-h-[550px]",
        className
      )}
    >
      <AboutCard image={image} title={title} />

      <div className="flex max-xl:flex-col items-center xl:justify-between justify-end md:gap-10 gap-6 absolute inset-0">
        <div className="flex items-center justify-center flex-col gap-6 xl:ml-[10vw]">
          <Text
            as="h2"
            variant="lead"
            className="tracking-tight font-semibold max-w-[1100px] uppercase"
          >
            {title}
          </Text>
          <Text as="p" variant="medium" className="max-w-[400px] text-center">
            {brief}
          </Text>
        </div>
        <Text
          as="p"
          variant="small"
          className="text-center max-w-[600px] xl:mt-auto max-lg:mx-auto xl:mr-[5vw]"
        >
          {details}
        </Text>
      </div>
    </div>
  );
};

export default AboutChapter;
