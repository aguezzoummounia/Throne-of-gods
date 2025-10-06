import { cn } from "@/lib/utils";
import QuizSectionSVGs from "../svgs/quiz-section-svgs";

interface QuizBackgroundProps {
  className?: string;
}

const QuizBackground = ({ className }: QuizBackgroundProps) => {
  return (
    <div
      className={cn(
        "xl:[&>svg]:w-[50%] md:[&>svg]:w-[60%] [&>svg]:w-[100%] absolute inset-0 flex items-center justify-center",
        className
      )}
    >
      <QuizSectionSVGs className="text-bronze aspect-square" />
    </div>
  );
};

export default QuizBackground;
