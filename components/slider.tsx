"use client";
import { cn } from "@/lib/utils";
import WavyImage from "./ui/wavy-image";
import useEmblaCarousel from "embla-carousel-react";
import { useState, useEffect, useCallback } from "react";
import { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";

interface Slide {
  id: number;
  image: string;
  title: string;
}

type DotButtonProps = {
  selected: boolean;
  adjacent: boolean;
  onClick: () => void;
};

type CarouselProps = {
  slides: Slide[];
};

const DotButton: React.FC<DotButtonProps> = ({
  selected,
  adjacent,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Go to slide"
      className="p-1 flex items-center justify-center rounded-full cursor-pointer"
    >
      <div
        className={cn(
          "w-2.5 h-2.5 rounded-[3px] transition-all duration-[600ms] ease-in-out",
          selected &&
            "bg-[rgba(251,191,36,1)] opacity-100 w-4 h-4 rounded-[5px] shadow-[0_0_12px_rgba(244,234,143,0.5)]",
          adjacent && "bg-[#c0c0c0] scale-85 rounded-[5px]",
          !adjacent && !selected && "bg-[#313131] scale-55"
        )}
      />
    </button>
  );
};

const Carousel: React.FC<CarouselProps> = ({ slides }) => {
  const OPTIONS: EmblaOptionsType = {
    loop: true,
    align: "center",
  };

  const [isDragging, setIsDragging] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  const applyEffects = useCallback((api: EmblaCarouselType) => {
    const TWEEN_FACTOR = 2.8;

    const applyScale = () => {
      const engine = api.internalEngine();
      const scrollProgress = api.scrollProgress();

      api.slideNodes().forEach((slideNode, index) => {
        let M = api.scrollSnapList().length - 1;
        let diffToTarget = api.scrollSnapList()[index] - scrollProgress;

        if (engine.options.loop) {
          if (diffToTarget > M / 2) diffToTarget = diffToTarget - M - 1;
          if (diffToTarget < -M / 2) diffToTarget = diffToTarget + M + 1;
        }

        const tween = 1 - Math.abs(diffToTarget * TWEEN_FACTOR);
        const scale = Math.max(0.7, Math.min(tween, 1));

        slideNode.style.transform = `scale(${scale})`;
      });
    };

    api.on("scroll", applyScale);
    api.on("reInit", applyScale);
    applyScale(); // Initial setup
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const handlePointerDown = () => setIsDragging(true);
    const handlePointerUp = () => setIsDragging(false);

    emblaApi.on("select", onSelect);
    emblaApi.on("pointerDown", handlePointerDown);
    emblaApi.on("pointerUp", handlePointerUp);

    // applyEffects(emblaApi);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("pointerDown", handlePointerDown);
      emblaApi.off("pointerUp", handlePointerUp);
    };
    // applyEffects
  }, [emblaApi, onSelect, applyEffects]);

  return (
    <div
      // className={`px-12 max-md:px-6 py-30 overflow-hidden min-h-screen bg-red-300 ${
      //   isDragging ? "scale-95" : "scale-100"
      // }`}
      className="py-30  min-h-screen flex items-center relative"
    >
      <div className="absolute top-[50%] left-[5vw] translate-y-[-50%] z-10 pointer-events-none mix-blend-difference">
        <div className="flex overflow-hidden  gap-x-1 max-md:text-xl max-md:font-normal max-md:flex-col max-md:items-start h-16">
          <div
            className="transition-transform duration-500 ease-in-out"
            style={{ transform: `translateY(-${selectedIndex * 64}px)` }}
          >
            {slides.map((slide) => (
              <h2
                key={slide.id}
                className="text-white md:text-4xl lowercase text-2xl font-medium py-2 leading-tight h-16 [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]"
              >
                {slide.title}
              </h2>
            ))}
          </div>
        </div>
      </div>

      <div ref={emblaRef} className="w-full overflow-hidden">
        <div
          className={`flex -ml-4 items-stretch h-full`}
          // transition-transform duration-300 ease-out ${isDragging ? "scale-95" : "scale-100"}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              // className={`min-w-0 pl-4 max-w-[80vw] transition-transform duration-300 ease-out ${
              //   isDragging ? "scale-95" : "scale-100"
              // }`}
              className="min-w-0 pl-4 w-[80vw]"
              style={{
                flexGrow: 0,
                flexShrink: 0,
              }}
              // className="flex-none w-3/5 min-w-0 relative px-4 origin-center"
            >
              <div className="relative cursor-grab active:cursor-grabbing shadow-lg w-full md:aspect-video aspect-[2/3.5] p-4">
                <WavyImage imageUrl={slide.image} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute md:top-[50%] top-[90%] md:translate-y-[-50%] md:right-8 right-0 md:w-fit w-full flex flex-wrap md:justify-end justify-center items-center gap-1.5 z-10 ">
        {/* mix-blend-difference */}
        {slides.map((_, index) => {
          const isSelected = index === selectedIndex;

          const isAdjacent =
            (selectedIndex > 0 && index === selectedIndex - 1) ||
            (selectedIndex < slides.length - 1 && index === selectedIndex + 1);
          return (
            <DotButton
              key={index}
              selected={isSelected}
              adjacent={isAdjacent}
              onClick={() => onDotButtonClick(index)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Carousel;
