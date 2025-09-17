import { cn } from "@/lib/utils";

interface SliderIndicatorsProps {
  length: number;
  selectedIndex: number;
  handleClick?: (id: number) => void;
}

const SliderIndicators = ({
  length,
  handleClick,
  selectedIndex,
}: SliderIndicatorsProps) => {
  return (
    <div className="absolute md:bottom-[50%] bottom-[90px] max-md:rotate-90 md:-translate-y-[-50%] md:right-[5vw] -right-[10px] w-fit flex flex-wrap md:justify-end justify-center items-center gap-[4px] z-10 bg-blurred backdrop-blur-lg rounded-full px-3 py-1.5 border-bronze/20 border pointer-events-none">
      {[...Array(length).keys()].map((_, index) => {
        const isSelected = index === selectedIndex;

        const isAdjacent =
          (selectedIndex > 0 && index === selectedIndex - 1) ||
          (selectedIndex < length - 1 && index === selectedIndex + 1);
        return (
          <SliderIndicator
            key={index}
            selected={isSelected}
            adjacent={isAdjacent}
            // onClick={() => handleClick(index)}
          />
        );
      })}
    </div>
  );
};

export default SliderIndicators;

interface SliderIndicator {
  selected: boolean;
  adjacent: boolean;
  onClick?: () => void;
}

const SliderIndicator = ({ selected, adjacent, onClick }: SliderIndicator) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Go to slide"
      className="flex items-center justify-center rounded-full"
    >
      <div
        className={cn(
          "w-[3px] h-[15px] opacity-70 bg-bronze rounded-[5px] transition-all duration-[600ms] ease-in-out",
          selected &&
            "opacity-100 h-[20px] shadow-[0_0_12px_rgba(244,234,143,0.5)]",
          adjacent && "scale-80 rounded-[5px]",
          !adjacent && !selected && "scale-60"
        )}
      />
    </button>
  );
};
