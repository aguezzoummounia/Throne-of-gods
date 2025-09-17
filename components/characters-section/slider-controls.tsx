import { cn } from "@/lib/utils";

interface SliderControlsProps {
  handlePrev: (prev: any) => void;
  handleNext: (prev: any) => void;
  handleNavigate: (prev: any) => void;
}

const SliderControls = ({
  handlePrev,
  handleNext,
  handleNavigate,
}: SliderControlsProps) => {
  return (
    <div className="absolute md:bottom-10 bottom-0 z-10 md:-translate-x-1/2 md:left-1/2 left-[5vw] max-md:right-[5vw] flex items-center gap-4">
      <div className="md:w-[150px] w-[calc(100%_-_60px)] flex justify-between items-center gap-[4px] bg-blurred backdrop-blur-lg rounded-full p-[3px] border-bronze/20 border">
        <button
          onClick={handlePrev}
          className={`p-1 rounded-full flex focus:outline-none focus:ring-2 focus:ring-white/50 border-bronze/20 border cursor-pointer`}
          aria-label="Next slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={handleNext}
          className={`p-1 rounded-full flex focus:outline-none focus:ring-2 focus:ring-white/50 border-bronze/20 border cursor-pointer`}
          aria-label="Previous slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <button
        onClick={handleNavigate}
        className={cn(
          "focus:ring-2 focus:ring-white/50p-1 rounded-full flex items-center justify-center focus:outline-none border-bronze/20 border cursor-pointer bg-blurred backdrop-blur-lg w-[38px] h-[38px]"
        )}
        aria-label="See character"
      >
        <div className="border-white/30 border w-[46px] rounded-full aspect-square absolute -inset-[5px] button-pulse-animation" />
        <div className="border-white/30 border w-[42px] rounded-full aspect-square absolute -inset-[3px] delay-2000 button-pulse-animation" />
        <svg
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white w-5 h-5 -rotate-45"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

export default SliderControls;
