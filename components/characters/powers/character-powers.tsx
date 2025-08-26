"use client";
import gsap from "gsap";
import Text from "../../ui/text";
import { cn } from "@/lib/utils";
import { Power } from "@/lib/types";
import PowerCard from "./power-card";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import Container from "../../global/container";
import ScrollTrigger from "gsap/ScrollTrigger";
import { power_item_positions } from "@/lib/consts";
import { useRef, useState, useEffect, useCallback } from "react";

// TODO: fix animation that triggers before element is in screen,
// account for layout for characters with 1 or 2 or 3 powers
// add svg lines that link between powers and animate them
gsap.registerPlugin(SplitText, ScrollTrigger);

const CharacterPowers: React.FC<{ data: readonly Power[] }> = ({ data }) => {
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // // State for which item is being hovered by a mouse
  // const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  // // State for which item has been explicitly clicked/tapped ("pinned")
  // const [pinnedIndex, setPinnedIndex] = useState<number | null>(null);

  // // --- DERIVED STATE ---
  // // The truly active item is the one that's pinned, otherwise it's the one being hovered.
  // // This is the magic that solves the flicker. A click will set pinnedIndex, and this
  // // value will take precedence over any hover changes.
  // const activeIndex = pinnedIndex ?? hoverIndex;

  // // --- EVENT HANDLERS ---
  // // Memoize this handler to pass a stable function to children
  // const handleTogglePin = useCallback((index: number) => {
  //   // If the user clicks the already pinned item, unpin it.
  //   // Otherwise, pin the new item.
  //   setPinnedIndex((currentPinnedIndex) =>
  //     currentPinnedIndex === index ? null : index
  //   );
  // }, []);

  // // Effect for handling "click outside" to close the pinned card.
  // useEffect(() => {
  //   // This effect only cares about the pinned state.
  //   if (pinnedIndex === null) {
  //     return;
  //   }

  //   const handleClickOutside = () => {
  //     setPinnedIndex(null);
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [pinnedIndex]);

  useGSAP(
    () => {
      const split = new SplitText(titleRef.current, {
        type: "chars",
        smartWrap: true,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });

      tl.from(split.chars, {
        autoAlpha: 0,
        stagger: {
          amount: 0.8,
          from: "random",
        },
      });

      return () => {
        split.revert();
      };
    },
    { scope: containerRef }
  );

  return (
    <Container
      as="section"
      ref={containerRef}
      className="flex flex-col md:gap-20 gap-10"
    >
      <Text ref={titleRef} as="h2" variant="title" className="mx-auto">
        Relics of Power
      </Text>
      <div className="md:min-h-[120vh] min-h-[1500px] grid-container flex-1 w-full h-full relative">
        {data.map((power, index) => {
          const position = power_item_positions[index] || {
            item: "",
          };
          return (
            <PowerCard
              name={power.name}
              image={power.image}
              overview={power.overview}
              key={`power-card-${index}`}
              className={cn(position.item)}
            />
          );
        })}
      </div>
    </Container>
  );
};

export default CharacterPowers;
