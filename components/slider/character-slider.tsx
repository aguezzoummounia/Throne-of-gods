"use client";
import gsap from "gsap";
import Text from "../ui/text";
import WavyImage from "./wavy-image";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import Container from "../global/container";
import { useRouter } from "next/navigation";
import { charactersArray } from "@/lib/data";
import SliderIndicator from "./slider-indicator";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useRef, useState, useEffect, useCallback } from "react";
import RadialInvertedTriangles from "../radial-inverted-triangles";
import Link from "next/link";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

const CharacterSlider: React.FC = () => {
  const OPTIONS: EmblaOptionsType = {
    loop: true,
    align: "center",
  };
  const router = useRouter();

  const h2Ref = useRef<HTMLHeadingElement>(null);
  const container = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top 70%",
        },
      });

      const h2Split = new SplitText(h2Ref.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) => {
          let splitTween = gsap.from(self.lines, {
            yPercent: 100,
            autoAlpha: 0,
            duration: 1,
            ease: "power2.out",
          });
          tl.add(splitTween);
          return splitTween;
        },
      });

      return () => {
        h2Split.revert();
      };
    },
    { scope: container }
  );

  return (
    <Container
      as="section"
      id="characters"
      ref={container}
      className="md:px-0 px-0 flex flex-col md:gap-20 gap-14 md:pt-24 pt-16 scroll-m-10"
    >
      <Text
        as="h2"
        ref={h2Ref}
        variant="lead"
        className="max-w-[768px] w-full max-md:mx-auto max-md:text-center px-12 max-md:px-5"
      >
        But no story shall live without the ones who walk it. These are the
        cursed, the chosen, and the condemned
      </Text>
      <div className="flex flex-col items-center relative">
        <div className="absolute top-[50%] left-[5vw] translate-y-[-50%] z-10 pointer-events-none mix-blend-difference">
          <div className="flex overflow-hidden  gap-x-1 max-md:text-xl max-md:font-normal max-md:flex-col max-md:items-start h-16">
            <div
              className="transition-transform duration-500 ease-in-out"
              style={{ transform: `translateY(-${selectedIndex * 64}px)` }}
            >
              {charactersArray.map((character) => (
                <Text
                  as="h2"
                  variant="lead"
                  key={character.id}
                  className="[text-shadow:0_2px_10px_rgba(0,0,0,0.5)] py-2 h-16 uppercase"
                >
                  {character.name}
                </Text>
              ))}
            </div>
          </div>
        </div>

        <div ref={emblaRef} className="w-full overflow-hidden">
          <div className={`flex -ml-4 items-stretch h-full`}>
            {charactersArray.map((character) => (
              <div
                key={character.id}
                className="min-w-0 pl-4 md:w-[95vw] w-full"
                style={{
                  flexGrow: 0,
                  flexShrink: 0,
                }}
              >
                <Link
                  href={`/characters/${character.slug}`}
                  className="relative flex cursor-grab active:cursor-grabbing w-full lg:aspect-[16/10] md:aspect-[3/3.5] aspect-[2/3.5]"
                >
                  <WavyImage imageUrl={character.image} />
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute md:top-[50%] top-[90%] md:translate-y-[-50%] md:right-[5vw] right-1/2 max-md:translate-x-1/2 w-fit flex flex-wrap md:justify-end justify-center items-center gap-[4px] z-10 bg-blurred backdrop-blur-lg rounded-full px-3 py-1.5 border-bronze/20 border">
          {charactersArray.map((_, index) => {
            const isSelected = index === selectedIndex;

            const isAdjacent =
              (selectedIndex > 0 && index === selectedIndex - 1) ||
              (selectedIndex < charactersArray.length - 1 &&
                index === selectedIndex + 1);
            return (
              <SliderIndicator
                key={index}
                selected={isSelected}
                adjacent={isAdjacent}
                onClick={() => onDotButtonClick(index)}
              />
            );
          })}
        </div>
        <RadialInvertedTriangles
          segments={5}
          className="absolute inset-0 -z-[1]"
        />
      </div>
    </Container>
  );
};

export default CharacterSlider;
