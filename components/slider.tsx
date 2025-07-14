"use client";
import useEmblaCarousel from "embla-carousel-react";
import { useState, useEffect, useCallback } from "react";

interface WavyImageProps {
  name: string;
  mainImage: string;
  portraitImage: string;
}

const characters: WavyImageProps[] = [
  {
    name: "THE WITCH-KING",
    mainImage: "https://i.imgur.com/j44bAMl.jpeg",
    portraitImage: "https://i.imgur.com/5h28n2K.png",
  },
  {
    name: "ÉOWYN",
    mainImage: "https://i.imgur.com/gS2Yn3h.jpeg",
    portraitImage: "https://i.imgur.com/e5knaaR.png",
  },
  {
    name: "ARAGORN",
    mainImage: "https://i.imgur.com/Bw2b1N4.jpeg",
    portraitImage: "https://i.imgur.com/y3aKIBj.png",
  },
  {
    name: "GANDALF",
    mainImage: "https://i.imgur.com/Jz2a4aG.jpeg",
    portraitImage: "https://i.imgur.com/iCjzjJ4.png",
  },
  {
    name: "GIMLI",
    mainImage: "https://i.imgur.com/u1S9x2c.jpeg",
    portraitImage: "https://i.imgur.com/7g9a1A1.png",
  },
];

const Slider: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, []);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );
  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect(); // Set initial state
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="relative w-full overflow-hidden bg-black text-white px-12 max-md:px-6 min-h-screen">
      {/* Main Carousel Viewport */}
      <div className="w-full h-full" ref={emblaRef}>
        <div className="embla__container h-full">
          {characters.map((char, index) => (
            <div className="embla__slide relative h-full" key={index}>
              <img
                src={char.mainImage}
                className="absolute inset-0 w-full h-full object-cover"
                alt={char.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>
          ))}
        </div>
      </div>

      {/* UI Overlay */}
      <div className="absolute z-10 inset-0 flex flex-col justify-end items-center p-8 pointer-events-none">
        <div className="text-center mb-4">
          <h1
            className="font-cinzel text-5xl md:text-7xl tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-amber-600"
            style={{ textShadow: "0 0 15px rgba(251, 191, 36, 0.4)" }}
          >
            {characters[selectedIndex]?.name}
          </h1>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center p-4 pointer-events-auto">
          {characters.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`w-3 h-3 rounded-full mx-2 transition-transform duration-300 ${
                index === selectedIndex
                  ? "bg-yellow-400 scale-125"
                  : "bg-white/50 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Arrow Buttons */}
      <button
        onClick={scrollPrev}
        aria-label="Previous slide"
        className="absolute z-10 top-1/2 left-4 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
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
        onClick={scrollNext}
        aria-label="Next slide"
        className="absolute z-10 top-1/2 right-4 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
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
  );
  //   <div className="">Slider</div>
};

export default Slider;
