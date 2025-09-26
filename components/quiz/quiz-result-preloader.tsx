"use client";
import { gsap } from "gsap";
import Text from "../ui/text";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import Button from "../ui/button-or-link";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";

gsap.registerPlugin(useGSAP, SplitText);

interface QuizResultsProps {
  open: boolean;
  goBack: () => void;
  onFinish: () => void;
}

const MESSAGES = [
  "Summoning your fate…",
  "Your villain awaits…",
  "Peering into the abyss…",
  "Sharpening your crown of thorns…",
] as const;

const MESSAGE_INTERVAL = 3500;

// Memoized animated text component to prevent unnecessary re-renders
const AnimatedText = ({ message }: { message: string }) => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const splitRef = useRef<SplitText | null>(null);

  useGSAP(
    () => {
      if (!textRef.current) return;

      // Clean up previous split if it exists
      if (splitRef.current) {
        splitRef.current.revert();
      }

      splitRef.current = new SplitText(textRef.current, {
        type: "chars",
      });

      const tween = gsap.from(splitRef.current.chars, {
        duration: 2,
        autoAlpha: 0,
        stagger: { amount: 0.5, from: "random" },
        ease: "power2.out",
      });

      return () => {
        tween.kill();
        if (splitRef.current) {
          splitRef.current.revert();
          splitRef.current = null;
        }
      };
    },
    { dependencies: [message] }
  );

  return (
    <div
      className="max-md:h-14 flex items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <Text
        as="p"
        ref={textRef}
        className="text-center font-cinzeldecorative"
        aria-label={`Loading message: ${message}`}
      >
        {message}
      </Text>
    </div>
  );
};

const QuizResultPreloader: React.FC<QuizResultsProps> = ({
  open,
  goBack,
  onFinish,
}) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize current message to prevent unnecessary re-renders
  const currentMessage = useMemo(() => MESSAGES[messageIndex], [messageIndex]);

  // Optimized message rotation with proper cleanup
  useEffect(() => {
    if (!open) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, MESSAGE_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [open]);

  // Memoized handlers to prevent unnecessary re-renders
  const handleGoBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleFinish = useCallback(() => {
    onFinish();
  }, [onFinish]);

  // Single GSAP animation hook with proper cleanup
  useGSAP(
    () => {
      if (!open || !containerRef.current || !contentRef.current) return;

      const circleCenter = "50% -50%";
      const finalClipPath = `circle(200vmax at ${circleCenter})`;

      // Set initial states
      gsap.set(containerRef.current, {
        clipPath: `circle(0% at ${circleCenter})`,
      });
      gsap.set(contentRef.current, { opacity: 0 });

      const tl = gsap.timeline();

      tl.to(containerRef.current, {
        clipPath: finalClipPath,
        duration: 2.5,
        ease: "power3.inOut",
      })
        .to(
          contentRef.current,
          {
            opacity: 1,
            duration: 0.5,
          },
          "-=1.2"
        )
        .from(
          gsap.utils.toArray(contentRef.current.children),
          {
            y: 20,
            opacity: 0,
            stagger: 0.15,
            ease: "power2.out",
          },
          "<"
        );

      return () => {
        tl.kill();
      };
    },
    { scope: containerRef, dependencies: [open] }
  );

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      ref={containerRef}
      aria-labelledby="quiz-result-title"
      aria-describedby="quiz-result-description"
      className="bg-[rgba(0,0,0,.05)] w-full h-full fixed inset-0 z-30 backdrop-blur-xl flex flex-col items-center justify-center gap-10 pt-[80px] px-8 pb-6"
    >
      <div
        ref={contentRef}
        className="w-full flex flex-col md:gap-14 gap-10 items-center xl:justify-center xl:max-w-[55%] lg:max-w-[70%] mx-auto text-center"
      >
        <Text as="h2" variant="title" id="quiz-result-title">
          Your true self lurks beyond this veil.
        </Text>

        <AnimatedText message={currentMessage} />

        <div
          className="flex flex-wrap [&>button]:w-[120px] [&>button]:uppercase gap-4 gap-y-6 items-center justify-center"
          role="group"
          aria-label="Quiz result actions"
        >
          <Button animated onClick={handleGoBack} aria-label="Go back to quiz">
            GO BACK
          </Button>
          <Button
            animated
            onClick={handleFinish}
            aria-label="View quiz results"
          >
            Face it
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizResultPreloader;
