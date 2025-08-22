"use client";
import gsap from "gsap";
import Text from "../ui/text";
import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import Button from "../ui/button-or-link";
import Container from "../global/container";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ElementsSvgOutline from "../elements-svg-outline";

gsap.registerPlugin(ScrollTrigger);

interface NextCharacterProps {
  slug: string;
  name: string;
  image: string;
}

const NextCharacter: React.FC<NextCharacterProps> = ({ slug, name, image }) => {
  const containerRef = useRef<HTMLElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          start: "top 80%",
          trigger: containerRef.current,
        },
      });
      tl.from(pRef.current, {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power3.inOut",
      });

      tl.from(
        h2Ref.current,
        {
          y: 50,
          opacity: 0,
          duration: 1.2,
          ease: "power3.inOut",
        },
        0.25
      );

      tl.from(
        buttonRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: "power2.inOut",
        },
        0.5
      );
    },
    { scope: containerRef }
  );

  return (
    <Container ref={containerRef} as="section" className="min-h-auto">
      <div className="relative bg-[rgba(0,0,0,.05)] text-white min-h-[65vh] rounded-xl overflow-hidden shadow-md">
        <ElementsSvgOutline className="z-1 pointer-events-none" />
        <Image
          fill
          src={image}
          alt={`Portrait of ${name}`}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 flex md:flex-row flex-col md:items-end items-start justify-between md:py-8 py-6 md:px-8 px-4">
          <div className="flex gap-2 flex-col items-start justify-start">
            <Text ref={pRef} as="p">
              The Story Continues
            </Text>

            <Text
              as="h2"
              ref={h2Ref}
              variant="lead"
              className="tracking-tight font-semibold text-center max-w-[1100px] uppercase"
            >
              {name}
            </Text>
          </div>

          <Button
            animated
            ref={buttonRef}
            href={`/characters/${slug}`}
            className="max-md:mx-auto"
          >
            Another Awaits
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default NextCharacter;
