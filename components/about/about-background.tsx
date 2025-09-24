import { cn } from "@/lib/utils";
import BackgroundSvg from "../quiz/background-svg";
import { DecorativeSVG1, DecorativeSVG2 } from "../svgs/about-svgs";

interface AboutBackgroundProp {
  className?: string;
  children: React.ReactNode;
}

const AboutBackground = ({ children, className }: AboutBackgroundProp) => {
  return (
    <div
      className={cn(
        "md:[&>svg]:w-[50%] [&>svg]:w-full absolute inset-0 flex items-start justify-center",
        className
      )}
    >
      <BackgroundSvg className="text-bronze aspect-square max-lg:-mt-[60%]" />
      <div className="absolute md:left-10 left-5 md:bottom-5 bottom-7 flex md:gap-8 gap-4">
        <DecorativeSVG1 />
        <DecorativeSVG2 />
      </div>
      {children}
    </div>
  );
};

export default AboutBackground;
