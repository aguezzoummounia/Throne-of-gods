"use client";
import gsap from "gsap";
import Text from "../ui/text";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import Button from "../ui/button-or-link";
import Container from "../global/container";
import { slideInOut } from "../global/header";
import ScrollTrigger from "gsap/ScrollTrigger";
import QuizBackground from "./quiz-background";
import { useTransitionRouter } from "next-view-transitions";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

const Quiz: React.FC = () => {
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const h4Ref = useRef<HTMLHeadingElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLButtonElement>(null);

  const router = useTransitionRouter();

  useGSAP(
    () => {
      const h2Split = new SplitText(h2Ref.current, {
        type: "chars",
        smartWrap: true,
        autoSplit: true,
        onSplit: (self) => {
          let splitTween = gsap.from(self.chars, {
            autoAlpha: 0,
            stagger: {
              amount: 0.6,
              from: "random",
            },
            scrollTrigger: {
              trigger: container.current,
              start: "top 70%",
            },
          });
          return splitTween;
        },
      });
      const h4Split = new SplitText(h4Ref.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) => {
          let splitTween = gsap.from(self.lines, {
            autoAlpha: 0,
            yPercent: 100,
            stagger: {
              amount: 0.8,
              from: "random",
            },
            scrollTrigger: {
              trigger: h4Ref.current,
              start: "top 80%",
            },
          });
          return splitTween;
        },
      });

      gsap.from(buttonsRef.current, {
        yPercent: 100,
        autoAlpha: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: buttonsRef.current,
          start: "top 80%",
        },
      });

      return () => {
        h2Split.revert();
        h4Split.revert();
      };
    },
    { scope: container }
  );

  return (
    <Container
      id="quiz"
      as="section"
      className="flex relative lg:h-screen min-h-[70vh]"
    >
      <QuizBackground />
      <div ref={container} className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-10 lg:w-[58.33%] xs:w-[83.33%] w-full">
          <Text as="h2" ref={h2Ref} variant="title" className="text-center">
            What Darkness <br /> Dwells Within You?
          </Text>

          <Text
            as="h4"
            ref={h4Ref}
            variant="lead"
            className="text-center uppercase md:mt-2 mt-4 font-alegreya"
          >
            Find the villain lurking in you.
          </Text>

          <Button
            href="/quiz"
            onClick={() => {
              router.push(`/quiz`, {
                onTransitionReady: slideInOut,
              });
            }}
            ref={buttonsRef}
            animated
          >
            Choose your path
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default Quiz;
