import { cn } from "@/lib/utils";

interface SliderIndicator {
  selected: boolean;
  adjacent: boolean;
  onClick: () => void;
}

const SliderIndicator = ({ selected, adjacent, onClick }: SliderIndicator) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Go to slide"
      className="flex items-center justify-center rounded-full cursor-pointer"
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

export default SliderIndicator;
