"use client";
import gsap from "gsap";
import Text from "../ui/text";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import Button from "../ui/button-or-link";
import Container from "../global/container";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

const Quiz: React.FC = () => {
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const h4Ref = useRef<HTMLHeadingElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      const h4Split = new SplitText(h4Ref.current, {
        type: "chars",
        smartWrap: true,
      });
      const h2Split = new SplitText(h2Ref.current, {
        type: "chars",
        smartWrap: true,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
      });

      tl.from(
        h4Split.chars,
        {
          autoAlpha: 0,
          stagger: {
            amount: 0.8,
            from: "random",
          },
        },
        0
      );

      // Animate H2 letters starting 0.1s after H4
      tl.from(
        h2Split.chars,
        {
          autoAlpha: 0,
          stagger: {
            amount: 0.8,
            from: "random",
          },
        },
        0.1
      );

      tl.from(
        buttonsRef.current,
        {
          y: 20,
          opacity: 0,
          ease: "power2.out",
          duration: 0.5,
        },
        0.3
      );
    },
    { scope: container }
  );

  return (
    <Container id="quiz" as="section" className="flex">
      <div ref={container} className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-10 lg:w-[58.33%] xs:w-[83.33%] w-full">
          <Text as="h2" ref={h2Ref} variant="title" className="text-center">
            What Darkness <br /> Dwells Within You?
          </Text>

          <Text
            as="h4"
            ref={h4Ref}
            variant="lead"
            className="text-center uppercase md:mt-2 mt-4"
          >
            Find the villain lurking in you.
          </Text>
          <Button href="/quiz" ref={buttonsRef} animated>
            Choose your path
          </Button>
        </div>
      </div>

      {/* <QuizResultPreloader onFinish={() => alert("hellooo...........")} /> */}
    </Container>
  );
};

export default Quiz;
