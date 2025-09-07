"use client";
import { gsap } from "gsap";
import Text from "../ui/text";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import Button from "../ui/button-or-link";
import { useRef, useState, useEffect } from "react";

gsap.registerPlugin(useGSAP, SplitText);

interface QuizResultsProps {
  open: boolean;
  goBack: () => void;
  onFinish: () => void;
}

const messages = [
  "Summoning your fate…",
  "Your villain awaits…",
  "Peering into the abyss…",
  "Sharpening your crown of thorns…",
];

const QuizResultPreloader: React.FC<QuizResultsProps> = ({
  open,
  goBack,
  onFinish,
}) => {
  const [index, setIndex] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
      // (% messages.length) loops back to 0 after last index
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useGSAP(
    () => {
      if (!open) return;

      const circleCenter = "50% -50%";
      const finalClipPath = `circle(150vmax at ${circleCenter})`;

      // Set initial states
      gsap.set(containerRef.current, {
        clipPath: `circle(0% at ${circleCenter})`,
      });
      // ✨ OPTIMIZATION: Target the content wrapper directly.
      gsap.set(contentRef.current, { opacity: 0 });

      const tl = gsap.timeline();

      tl.to(containerRef.current, {
        clipPath: finalClipPath,
        duration: 2.5,
        ease: "power3.inOut",
      })
        .to(
          // ✨ OPTIMIZATION: Animate the wrapper and let GSAP handle children with stagger.
          // We select the direct children of the content wrapper to animate.
          contentRef.current,
          {
            opacity: 1,
            duration: 0.5,
          },
          "-=1.2"
        )
        .from(
          // We can create a second, more granular animation for the inner elements.
          gsap.utils.toArray(contentRef.current?.children ?? []),
          {
            y: 20,
            opacity: 0,
            stagger: 0.15,
          },
          "<" // Start at the same time as the wrapper fade-in
        );
    },
    { scope: containerRef, dependencies: [open] }
  );

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      ref={containerRef}
      aria-labelledby="side-menu-title"
      className="bg-[rgba(0,0,0,.05)] w-full h-full fixed inset-0 z-30 backdrop-blur-xl flex flex-col items-center justify-center gap-10 pt-[80px] px-8 pb-6"
    >
      <div
        ref={contentRef}
        className="w-full flex flex-col md:gap-14 gap-10 items-center xl:justify-center xl:max-w-[55%] lg:max-w-[70%] mx-auto text-center"
      >
        <Text as="h2" variant="title">
          Your true self lurks beyond this veil.
        </Text>
        <AnimatedText
          key={`random-quotes-${index}`}
          message={messages[index]}
        />
        <div className="flex flex-wrap [&>button]:w-[120px] [&>button]:uppercase gap-4 gap-y-6 items-center justify-center">
          <Button animated onClick={goBack}>
            GO BACK
          </Button>
          <Button animated onClick={onFinish}>
            Face it
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizResultPreloader;

interface AnimatedTextProps {
  message: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ message }) => {
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const split = new SplitText(textRef.current, { type: "chars" });
      gsap.from(split.chars, {
        duration: 2,
        autoAlpha: 0,
        stagger: { amount: 0.5, from: "random" },
        ease: "power2.out",
      });
      return () => {
        split.revert();
      };
    },
    { scope: textRef }
  );

  // Note: The custom <Text> component must be able to forward a ref.
  return (
    <div className="max-md:h-14 flex items-center justify-center">
      <Text as="p" ref={textRef} className="text-center font-cinzeldecorative">
        {message}
      </Text>
    </div>
  );
};
