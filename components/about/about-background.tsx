import { cn } from "@/lib/utils";
import {
  AboutSectionSVG,
  DecorativeSVG1,
  DecorativeSVG2,
} from "../svgs/about-svgs";

interface AboutBackgroundProp {
  className?: string;
  children: React.ReactNode;
}

const AboutBackground = ({ children, className }: AboutBackgroundProp) => {
  return (
    <div
      className={cn(
        "absolute inset-0 flex items-start justify-center",
        className
      )}
    >
      {/*  className="text-bronze aspect-square max-lg:-mt-[60%]" */}
      <AboutSectionSVG />
      <div className="absolute md:left-10 left-5 md:bottom-5 bottom-7 flex md:gap-8 gap-4">
        <DecorativeSVG1 className="w-[40px]" />
        <DecorativeSVG2 className="w-[40px]" />
      </div>
      {children}
    </div>
  );
};

export default AboutBackground;
