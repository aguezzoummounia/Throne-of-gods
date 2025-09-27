import { memo, useMemo } from "react";
import { useMobile } from "../hooks/use-mobile";

interface DigitReelProps {
  digit: number;
}

// Memoized digit reel to prevent unnecessary re-renders
const DigitReel = memo<DigitReelProps>(({ digit }) => {
  const isMobile = useMobile();
  const DIGIT_HEIGHT = useMemo(() => (isMobile ? 50 : 80), [isMobile]);
  const transformStyle = useMemo(
    () => ({
      transform: `translateY(-${digit * DIGIT_HEIGHT}px)`,
    }),
    [digit, DIGIT_HEIGHT]
  );

  // Pre-generate digit elements to avoid recreation on each render
  const digitElements = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          className="flex md:text-8xl text-6xl items-end justify-center font-alegreya"
          style={{ height: `${DIGIT_HEIGHT}px` }}
          aria-hidden={i !== digit}
        >
          {i}
        </div>
      )),
    [DIGIT_HEIGHT, digit]
  );

  return (
    <div
      className="overflow-hidden font-normal"
      style={{ height: `${DIGIT_HEIGHT}px` }}
      role="img"
      aria-label={`Digit ${digit}`}
    >
      <div
        className="transition-transform duration-700 ease-in-out"
        style={transformStyle}
      >
        {digitElements}
      </div>
    </div>
  );
});

DigitReel.displayName = "DigitReel";

interface VerticalCounterProps {
  progress: number;
}

const VerticalCounter: React.FC<VerticalCounterProps> = ({ progress }) => {
  // Memoize calculations to prevent unnecessary recalculations
  const digits = useMemo(() => {
    const clampedProgress = Math.max(0, Math.min(100, progress));
    const formattedProgress = Math.floor(clampedProgress)
      .toString()
      .padStart(3, "0");

    return formattedProgress.split("").map(Number);
  }, [progress]);

  return (
    <div
      className="flex md:absolute md:right-10"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Loading progress: ${Math.floor(progress)}%`}
    >
      <DigitReel digit={digits[0]} />
      <DigitReel digit={digits[1]} />
      <DigitReel digit={digits[2]} />
      <div
        className="flex md:text-3xl text-lg items-end justify-center font-alegreya md:h-[80px] h-[50px] pl-1.5 md:pb-3.5 pb-1.5 mt-auto"
        aria-hidden="true"
      >
        %
      </div>
    </div>
  );
};

export default VerticalCounter;
