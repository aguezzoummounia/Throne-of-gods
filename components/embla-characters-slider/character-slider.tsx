"use client";
import Link from "next/link";
import SmartImage from "../ui/smart-image";
import { slideInOut } from "../global/header";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { charactersArray as images } from "@/lib/data";
import { useState, useEffect, useCallback } from "react";
import { useTransitionRouter } from "next-view-transitions";
import SliderTitles from "../characters-section/slider-titles";
import SliderControls from "../characters-section/slider-controls";
import SliderIndicators from "../characters-section/slider-indicators";
import { cn } from "@/lib/utils";

// Type definitions for better TypeScript support
interface Character {
  id: number;
  name: string;
  slug: string;
  src: string;
  overview: string;
}

interface EmblaCharacterSliderProps {
  className?: string;
}

const EmblaCharacterSlider: React.FC<EmblaCharacterSliderProps> = ({
  className = "",
}) => {
  // Validate images array
  if (!images || images.length === 0) {
    console.warn("CharacterSlider: No images provided");
    return (
      <div className="flex items-center justify-center p-8 text-white/70">
        No characters available
      </div>
    );
  }

  const OPTIONS: EmblaOptionsType = {
    loop: images.length > 1,
    align: "center",
    skipSnaps: false,
    dragFree: false,
  };

  const router = useTransitionRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Enhanced selection handler with accessibility updates
  const onSelect = useCallback(() => {
    if (!emblaApi) return;

    const newIndex = emblaApi.selectedScrollSnap();
    setSelectedIndex(newIndex);
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());

    // Announce slide change to screen readers with error handling
    try {
      const currentCharacter = images[newIndex];
      if (currentCharacter) {
        const announcement = `Slide ${newIndex + 1} of ${images.length}: ${
          currentCharacter.name
        }`;
        const ariaLiveRegion = document.getElementById("slider-announcements");
        if (ariaLiveRegion) {
          ariaLiveRegion.textContent = announcement;
        }
      }
    } catch (error) {
      console.warn("Error updating screen reader announcement:", error);
    }
  }, [emblaApi]);

  // Navigation handlers
  const handlePrev = useCallback(() => {
    if (!emblaApi || !canScrollPrev) return;
    emblaApi.scrollPrev();
  }, [emblaApi, canScrollPrev]);

  const handleNext = useCallback(() => {
    if (!emblaApi || !canScrollNext) return;
    emblaApi.scrollNext();
  }, [emblaApi, canScrollNext]);

  // Direct slide navigation
  const handleSlideClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  // Enhanced navigation with accessibility and error handling
  const handleNavigate = useCallback(() => {
    try {
      const currentCharacter = images[selectedIndex];
      if (!currentCharacter?.slug) {
        console.warn("No character found at index:", selectedIndex);
        return;
      }

      router.push(`/characters/${currentCharacter.slug}`, {
        onTransitionReady: slideInOut,
      });
    } catch (error) {
      console.error("Navigation error:", error);
    }
  }, [router, selectedIndex]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          handlePrev();
          break;
        case "ArrowRight":
          event.preventDefault();
          handleNext();
          break;
        case "Home":
          event.preventDefault();
          if (emblaApi) {
            emblaApi.scrollTo(0);
          }
          break;
        case "End":
          event.preventDefault();
          if (emblaApi) {
            emblaApi.scrollTo(images.length - 1);
          }
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          handleNavigate();
          break;
      }
    },
    [handlePrev, handleNext, handleNavigate, emblaApi]
  );

  // Setup effects
  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section
      role="region"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Character carousel"
      className={cn(
        "flex flex-col items-center relative max-md:px-1",
        className
      )}
    >
      {/* Screen reader announcements */}
      <div
        id="slider-announcements"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />

      <SliderTitles data={images} selectedIndex={selectedIndex} />
      <SliderControls
        handlePrev={handlePrev}
        handleNext={handleNext}
        handleNavigate={handleNavigate}
      />
      <SliderIndicators
        length={images.length}
        selectedIndex={selectedIndex}
        handleClick={handleSlideClick}
      />

      <div
        ref={emblaRef}
        className="w-full overflow-hidden"
        role="group"
        aria-label={`Character slides, ${selectedIndex + 1} of ${
          images.length
        }`}
      >
        <div className="flex -ml-4 items-stretch h-full">
          {images.map((character: Character, index: number) => (
            <div
              key={character.id}
              className="min-w-0 pl-4 md:w-[75vw] w-full"
              style={{
                flexGrow: 0,
                flexShrink: 0,
              }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${images.length}`}
            >
              <Link
                href={`/characters/${character.slug}`}
                className="relative flex cursor-grab active:cursor-grabbing w-full lg:aspect-[16/10] md:aspect-square aspect-[2/3] md:rounded-xl rounded-2xl overflow-clip"
                aria-label={`View details for ${character.name}: ${character.overview}`}
                tabIndex={index === selectedIndex ? 0 : -1}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate();
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-900/60 to-transparent z-9 md:hidden block rounded-2xl overflow-clip pointer-events-none" />
                <SmartImage
                  fill
                  src={character.src}
                  className="object-cover"
                  alt={`${character.name} character portrait`}
                />

                {/* Hidden content for screen readers */}
                <span className="sr-only">
                  {character.name}. {character.overview}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions for keyboard users */}
      <div className="sr-only">
        Use arrow keys to navigate slides, Enter or Space to view character
        details, Home to go to first slide, End to go to last slide.
      </div>
    </section>
  );
};

export default EmblaCharacterSlider;
