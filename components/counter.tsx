interface DigitReelProps {
  digit: number;
}

// Helper component for a single digit reel.
// Defined inside VerticalCounter as it's not used elsewhere.
const DigitReel: React.FC<DigitReelProps> = ({ digit }) => {
  const digitHeight = 100;
  const transformStyle = {
    transform: `translateY(-${digit * digitHeight}px)`,
  };

  return (
    <div
      className="overflow-hidden font-normal"
      style={{ height: `${digitHeight}px` }}
    >
      <div
        className="transition-transform duration-700 ease-in-out"
        style={transformStyle}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex md:text-9xl text-8xl items-end justify-center font-alegreya"
            style={{ height: `${digitHeight}px` }}
          >
            {i}
          </div>
        ))}
      </div>
    </div>
  );
};

interface VerticalCounterProps {
  progress: number;
}

const VerticalCounter: React.FC<VerticalCounterProps> = ({ progress }) => {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));

  const formattedProgress = Math.floor(clampedProgress)
    .toString()
    .padStart(3, "0");

  // Split the string into an array of numbers
  const digits = formattedProgress.split("").map(Number);

  return (
    <div className="flex max-md:mb-14">
      <DigitReel digit={digits[0]} />
      <DigitReel digit={digits[1]} />
      <DigitReel digit={digits[2]} />
      <div className="flex md:text-5xl text-4xl items-end justify-center font-alegreya h-[100px] pl-1.5 md:pb-4 pb-3">
        %
      </div>
    </div>
  );
};

export default VerticalCounter;
