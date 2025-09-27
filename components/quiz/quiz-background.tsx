import { cn } from "@/lib/utils";
import BackgroundSvg from "./quiz-question-background-svg";

interface QuizBackgroundProps {
  className?: string;
}

const QuizBackground = ({ className }: QuizBackgroundProps) => {
  return (
    <div
      className={cn(
        "md:[&>svg]:w-[50%] [&>svg]:w-full absolute inset-0 flex items-center justify-center",
        className
      )}
    >
      <BackgroundSvg className="text-bronze aspect-square" />
    </div>
  );
};

export default QuizBackground;
