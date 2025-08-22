"use client";
import gsap from "gsap";
import Text from "../ui/text";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import { useRef, useState, useEffect } from "react";

gsap.registerPlugin(SplitText);

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

  useEffect(() => {
    if (data.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => getRandomIndex(prevIndex, data));
    }, 5000);

    return () => clearInterval(interval);
  }, [data]);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      const pSplit = new SplitText(pRef.current, {
        type: "chars",
        smartWrap: true,
      });

      // P lines mask animation
      tl.from(
        pSplit.chars,
        {
          opacity: 0,
          stagger: {
            amount: 0.5,
            from: "random",
          },
        },
        0
      );
      return () => {
        pSplit.revert(); // cleanup SplitText wrappers
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
