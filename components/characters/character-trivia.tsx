"use client";
import gsap from "gsap";
import Text from "../ui/text";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
// 1. Import ScrollTrigger
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState, useEffect } from "react";

// 2. Register the ScrollTrigger plugin
gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

const getRandomIndex = (prevIndex: number, data: readonly string[]): number => {
  if (data.length === 1) return 0;
  let newIndex: number;
  do {
    newIndex = Math.floor(Math.random() * data.length);
  } while (newIndex === prevIndex);
  return newIndex;
};

const CharacterTrivia: React.FC<{ data: readonly string[] }> = ({ data }) => {
  const pRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // We no longer need the isInView state or the IntersectionObserver useEffect.

  // 3. Use an effect to control the interval with ScrollTrigger
  useEffect(() => {
    // A ref to hold the interval ID so we can clear it from different scopes
    let interval: NodeJS.Timeout;

    const startInterval = () => {
      // Don't start if it's already running
      if (interval) return;
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => getRandomIndex(prevIndex, data));
      }, 5000);
    };

    const stopInterval = () => {
      clearInterval(interval);
      // @ts-ignore
      interval = null; // Reset the interval ID
    };

    // Create the ScrollTrigger instance
    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      // When the top of the trigger enters the bottom of the viewport
      onEnter: () => startInterval(),
      // When the bottom of the trigger leaves the top of the viewport
      onLeave: () => stopInterval(),
      // When the top of the trigger re-enters the bottom of the viewport (scrolling up)
      onEnterBack: () => startInterval(),
      // When the bottom of the trigger re-enters the top of the viewport (scrolling up)
      onLeaveBack: () => stopInterval(),
    });

    // Cleanup on component unmount
    return () => {
      stopInterval(); // Ensure interval is cleared
      st.kill(); // Kill the ScrollTrigger instance to prevent memory leaks
    };
  }, [data]); // Dependency array includes data

  // This GSAP animation hook remains the same.
  // It's driven by `currentIndex`, which is now controlled by our ScrollTrigger.
  useGSAP(
    () => {
      if (!pRef.current) return;

      const pSplit = new SplitText(pRef.current, {
        type: "chars",
        autoSplit: true,
        onSplit: (self) => {
          let splitTween = gsap.from(self.chars, {
            opacity: 0,
            stagger: {
              amount: 0.5,
              from: "random",
            },
          });
          return splitTween;
        },
      });

      return () => {
        pSplit.revert();
      };
    },
    { scope: containerRef, dependencies: [currentIndex] }
  );

  return (
    <div
      ref={containerRef}
      className="min-h-fit lg:w-[58.33%] xs:w-[83.33%] w-full mx-auto flex md:gap-3 gap-2 flex-col px-12 max-md:px-5 md:pb-10 pb-8 justify-center items-center text-center"
    >
      <Text as="h6" variant="xs">
        Whispers & Legends
      </Text>
      <Text
        as="p"
        ref={pRef}
        variant="xs"
        key={currentIndex}
        aria-live="polite"
        className="max-md:min-h-[40px]"
      >
        “{data[currentIndex]}”
      </Text>
    </div>
  );
};

export default CharacterTrivia;
