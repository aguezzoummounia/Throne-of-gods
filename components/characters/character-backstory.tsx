"use client";
import gsap from "gsap";
import Text from "../ui/text";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import Container from "../global/container";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

const CharacterBackstory: React.FC<{ data: string }> = ({ data }) => {
  const containerRef = useRef<HTMLElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // useGSAP(
  //   () => {
  //     const h2Split = new SplitText(h2Ref.current, {
  //       type: "chars",
  //       smartWrap: true,

  //     });

  //     // animate main header
  //     gsap.from(h2Split.chars, {
  //       autoAlpha: 0,
  //       stagger: {
  //         amount: 0.8,
  //         from: "random",
  //       },
  //       scrollTrigger: {
  //         trigger: containerRef.current,
  //         start: "top 80%",
  //       },
  //     });

  //     const contentDivs = contentRef.current?.querySelectorAll("p") || [];
  //     const lineSplits: SplitText[] = [];

  //     contentDivs.forEach((p) => {
  //       const split = new SplitText(p, {
  //         type: "lines",
  //         linesClass: "overflow-hidden",
  //       });
  //       lineSplits.push(split);

  //       // Animate each <p> independently
  //       gsap.from(split.lines, {
  //         yPercent: 100,
  //         duration: 1,
  //         stagger: 0.1,
  //         autoAlpha: 0,
  //         ease: "power4.out",
  //         scrollTrigger: {
  //           trigger: p,
  //           start: "top 80%",
  //         },
  //       });
  //     });

  //     return () => {
  //       h2Split.revert();
  //       lineSplits.forEach((split) => split.revert());
  //     };
  //   },
  //   { scope: containerRef }
  // );

  useGSAP(
    () => {
      // === H2 split ===
      const h2Split = new SplitText(h2Ref.current, {
        type: "chars",
        smartWrap: true,
        autoSplit: true,
        onSplit: (self) => {
          const h2Tween = gsap.from(self.chars, {
            autoAlpha: 0,
            stagger: {
              amount: 0.8,
              from: "random",
            },
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 70%",
            },
          });
          return h2Tween; // required for resplitting
        },
      });

      // === Paragraphs split ===
      const contentDivs = contentRef.current?.querySelectorAll("p") || [];
      const lineSplits: SplitText[] = [];

      contentDivs.forEach((p) => {
        const split = new SplitText(p, {
          type: "lines",
          linesClass: "overflow-hidden",
          autoSplit: true,
          onSplit: (self) => {
            const pTween = gsap.from(self.lines, {
              yPercent: 100,
              duration: 1,
              stagger: 0.1,
              autoAlpha: 0,
              ease: "power4.out",
              scrollTrigger: {
                trigger: p,
                start: "top 70%",
              },
            });
            return pTween;
          },
        });
        lineSplits.push(split);
      });

      // cleanup
      return () => {
        h2Split.revert();
        lineSplits.forEach((split) => split.revert());
      };
    },
    { scope: containerRef }
  );

  return (
    <Container
      as="section"
      ref={containerRef}
      className="lg:w-[58.33%] xs:w-[83.33%] w-full mx-auto flex md:gap-12 gap-8 flex-col items-center justify-center min-h-fit"
    >
      <Text as="h2" ref={h2Ref} variant="title">
        Chronicle of Sin
      </Text>

      <div
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: data }}
        className="grid gap-10 font-alegreya lg:text-dynamic-lg md:text-dynamic-base max-md:text-[4vw] font-semibold leading-[1.1] text-center"
      />
    </Container>
  );
};

export default CharacterBackstory;
