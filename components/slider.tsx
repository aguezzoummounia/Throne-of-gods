"use client";
// import useEmblaCarousel from "embla-carousel-react";
// import { useState, useEffect, useCallback } from "react";

// interface WavyImageProps {
//   name: string;
//   mainImage: string;
//   portraitImage: string;
// }

// const characters: WavyImageProps[] = [
//   {
//     name: "THE WITCH-KING",
//     mainImage: "https://i.imgur.com/j44bAMl.jpeg",
//     portraitImage: "https://i.imgur.com/5h28n2K.png",
//   },
//   {
//     name: "ÉOWYN",
//     mainImage: "https://i.imgur.com/gS2Yn3h.jpeg",
//     portraitImage: "https://i.imgur.com/e5knaaR.png",
//   },
//   {
//     name: "ARAGORN",
//     mainImage: "https://i.imgur.com/Bw2b1N4.jpeg",
//     portraitImage: "https://i.imgur.com/y3aKIBj.png",
//   },
//   {
//     name: "GANDALF",
//     mainImage: "https://i.imgur.com/Jz2a4aG.jpeg",
//     portraitImage: "https://i.imgur.com/iCjzjJ4.png",
//   },
//   {
//     name: "GIMLI",
//     mainImage: "https://i.imgur.com/u1S9x2c.jpeg",
//     portraitImage: "https://i.imgur.com/7g9a1A1.png",
//   },
// ];

// const Slider: React.FC = () => {
//   const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, []);
//   const [selectedIndex, setSelectedIndex] = useState(0);

//   const scrollPrev = useCallback(
//     () => emblaApi && emblaApi.scrollPrev(),
//     [emblaApi]
//   );
//   const scrollNext = useCallback(
//     () => emblaApi && emblaApi.scrollNext(),
//     [emblaApi]
//   );
//   const scrollTo = useCallback(
//     (index: number) => emblaApi && emblaApi.scrollTo(index),
//     [emblaApi]
//   );

//   useEffect(() => {
//     if (!emblaApi) return;
//     const onSelect = () => {
//       setSelectedIndex(emblaApi.selectedScrollSnap());
//     };
//     emblaApi.on("select", onSelect);
//     emblaApi.on("reInit", onSelect);
//     onSelect(); // Set initial state
//     return () => {
//       emblaApi.off("select", onSelect);
//       emblaApi.off("reInit", onSelect);
//     };
//   }, [emblaApi]);

//   return (
//     <div className="relative w-full overflow-hidden bg-black text-white px-12 max-md:px-6 min-h-screen">
//       {/* Main Carousel Viewport */}
//       <div className="w-full h-full" ref={emblaRef}>
//         <div className="embla__container h-full">
//           {characters.map((char, index) => (
//             <div className="embla__slide relative h-full" key={index}>
//               <img
//                 src={char.mainImage}
//                 className="absolute inset-0 w-full h-full object-cover"
//                 alt={char.name}
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* UI Overlay */}
//       <div className="absolute z-10 inset-0 flex flex-col justify-end items-center p-8 pointer-events-none bg-red-500">
//         <div className="text-center mb-4">
//           <h1
//             className="font-cinzel text-5xl md:text-7xl tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-amber-600"
//             style={{ textShadow: "0 0 15px rgba(251, 191, 36, 0.4)" }}
//           >
//             {characters[selectedIndex]?.name}
//           </h1>
//         </div>

//         {/* Dots */}
//         <div className="flex items-center justify-center p-4 pointer-events-auto">
//           {characters.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => scrollTo(index)}
//               aria-label={`Go to slide ${index + 1}`}
//               className={`w-3 h-3 rounded-full mx-2 transition-transform duration-300 ${
//                 index === selectedIndex
//                   ? "bg-yellow-400 scale-125"
//                   : "bg-white/50 hover:bg-white"
//               }`}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Arrow Buttons */}
//       <button
//         onClick={scrollPrev}
//         aria-label="Previous slide"
//         className="absolute z-10 top-1/2 left-4 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-10 w-10"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M15 19l-7-7 7-7"
//           />
//         </svg>
//       </button>
//       <button
//         onClick={scrollNext}
//         aria-label="Next slide"
//         className="absolute z-10 top-1/2 right-4 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-10 w-10"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M9 5l7 7-7 7"
//           />
//         </svg>
//       </button>
//     </div>
//   );
//   //   <div className="">Slider</div>
// };

// export default Slider;

import useEmblaCarousel from "embla-carousel-react";
import { useState, useEffect, useCallback } from "react";
import { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";

interface Slide {
  id: number;
  image: string;
  title: string;
}
// Thumbnail Button Component
type ThumbProps = {
  selected: boolean;
  onClick: () => void;
  imgSrc: string;
  title: string;
};

const Thumb: React.FC<ThumbProps> = ({ selected, onClick, imgSrc, title }) => (
  <div className="flex-none">
    <button
      onClick={onClick}
      className={`w-[60px] h-[40px] rounded overflow-hidden transition-all duration-200 border-2 ${
        selected ? "border-white opacity-100" : "border-transparent opacity-50"
      }`}
      type="button"
      aria-label={`Go to slide: ${title}`}
    >
      <img
        className="w-full h-full object-cover"
        src={imgSrc}
        alt={`Thumbnail for ${title}`}
      />
    </button>
  </div>
);

// Dot Button Component
type DotButtonProps = {
  selected: boolean;
  onClick: () => void;
};

const DotButton: React.FC<DotButtonProps> = ({ selected, onClick }) => (
  <button
    className="w-4 h-4 flex items-center justify-center rounded-full"
    type="button"
    onClick={onClick}
    aria-label="Go to slide"
  >
    <div
      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
        selected ? "bg-neutral-100" : "bg-neutral-600"
      }`}
    />
  </button>
);

// Main Carousel Component
type CarouselProps = {
  slides: Slide[];
};

const Carousel: React.FC<CarouselProps> = ({ slides }) => {
  const OPTIONS: EmblaOptionsType = {
    loop: true,
    align: "center",
  };

  const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    console.log("inside onSelect: ", emblaApi);
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

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
  useEffect(() => {
    console.log(selectedIndex);
  }, [selectedIndex]);

  return (
    <div
      // className={`px-12 max-md:px-6 py-30 overflow-hidden min-h-screen bg-red-300 ${
      //   isDragging ? "scale-95" : "scale-100"
      // }`}
      className="py-30 overflow-hidden min-h-screen bg-red-300 flex items-center"
    >
      <div className="absolute top-[50%] left-[5vw] translate-y-[-50%] z-10 flex justify-center pointer-events-none bg-green-300 w-fit">
        {/* overflow-hidden */}
        <div className="flex items-center justify-center gap-x-1 max-md:text-xl max-md:font-normal max-md:flex-col max-md:items-start h-16">
          <div
            className="transition-transform duration-500 ease-in-out"
            style={{ transform: `translateY(-${selectedIndex * 64}px)` }}
          >
            {slides.map((slide) => (
              <h2
                key={slide.id}
                // mix-blend-difference
                className="text-white md:text-4xl text-2xl font-medium py-2 leading-tight h-16 [text-shadow:0_2px_10px_rgba(0,0,0,0.5)] "
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
              className="min-w-0 pl-4 max-w-[80vw] "
              style={{
                flexGrow: 0,
                flexShrink: 0,
              }}
              // className="flex-none w-3/5 min-w-0 relative px-4 origin-center"
            >
              <div className="relative cursor-grab active:cursor-grabbing shadow-lg">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full aspect-video object-cover"
                />
                {/* <h3 className="absolute bottom-4 left-4 text-white text-2xl font-bold [text-shadow:1px_1px_3px_rgba(0,0,0,0.7)]">
                {slide.title}
              </h3> */}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* <div className="absolute bottom-8 left-8 flex gap-2 z-10">
        {slides.map((slide, index) => (
          <Thumb
            key={slide.id}
            onClick={() => onThumbClick(index)}
            selected={index === selectedIndex}
            imgSrc={slide.image}
            title={slide.title}
          />
        ))}
      </div>

      <div className="absolute bottom-8 right-8 flex items-center gap-4 text-neutral-400 z-10">
        <div className="text-sm">
          <span className="font-bold">{selectedIndex + 1}</span> /{" "}
          {slides.length}
        </div>
        <div className="flex flex-wrap justify-end items-center gap-2">
          {slides.map((_, index) => (
            <DotButton
              key={index}
              selected={index === selectedIndex}
              onClick={() => onDotButtonClick(index)}
            />
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default Carousel;
