"use client";
import { useRef, memo } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Text from "../ui/text";

interface Character {
  id: number;
  name: string;
  slug: string;
  src: string;
  overview: string;
}

interface SliderTitlesProps {
  data: Character[];
  selectedIndex: number;
}

const SliderTitles = memo<SliderTitlesProps>(({ data, selectedIndex }) => {
  const containerRef = useRef<HTMLElement>(null);
  const overviewRef = useRef<HTMLParagraphElement>(null);
  const previousIndexRef = useRef(selectedIndex);

  useGSAP(
    () => {
      if (
        !overviewRef.current ||
        previousIndexRef.current === selectedIndex ||
        !data[selectedIndex]
      ) {
        return;
      }

      const element = overviewRef.current;
      const newContent = data[selectedIndex].overview;

      // Create timeline for smooth text transition
      const tl = gsap.timeline();

      // Animate out the current text (fade down)
      tl.to(element, {
        y: 15,
        opacity: 0,
        duration: 0.15,
        ease: "power2.in",
      })
        // Update content and animate in new text (fade up)
        .call(() => {
          if (element) {
            element.textContent = newContent;
          }
        })
        .fromTo(
          element,
          { y: -15, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.25,
            ease: "power2.out",
          }
        );

      previousIndexRef.current = selectedIndex;
    },
    {
      dependencies: [selectedIndex, data],
      scope: containerRef,
      revertOnUpdate: true,
    }
  );

  if (!data[selectedIndex]) {
    return null;
  }

  return (
    <header
      ref={containerRef}
      className="absolute md:top-[50%] max-md:bottom-[70px] inset-x-[5vw] z-10 pointer-events-none mix-blend-difference grid md:gap-4"
    >
      <div className="flex overflow-hidden gap-x-1 max-md:text-xl max-md:font-normal max-md:flex-col max-md:items-start h-10">
        <div
          className="transition-transform duration-500 ease-out will-change-transform"
          style={{ transform: `translateY(-${selectedIndex * 40}px)` }}
        >
          {data.map((character) => (
            <Text
              as="h2"
              variant="lead"
              key={character.id}
              className="[text-shadow:0_2px_10px_rgba(0,0,0,0.5)] max-md:py-2 h-10 uppercase md:leading-[100%] will-change-transform"
            >
              {character.name}
            </Text>
          ))}
        </div>
      </div>
      <Text
        as="p"
        ref={overviewRef}
        className="[text-shadow:0_2px_10px_rgba(0,0,0,0.5)] capitalize md:leading-tight max-w-[600px] w-[80%] max-md:text-sm will-change-transform"
      >
        {data[selectedIndex].overview}
      </Text>
    </header>
  );
});

SliderTitles.displayName = "SliderTitles";

export default SliderTitles;
