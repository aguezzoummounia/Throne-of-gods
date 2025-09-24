import { gsap } from "gsap";
import Text from "../ui/text";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import AboutCard from "./about-card";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

interface AboutChapterProps {
  title: string;
  brief: string;
  image: string;
  details: string;
  className?: string;
  activeIndex: number;
}

const AboutChapter = ({
  image,
  title,
  brief,
  details,
  className,
  activeIndex,
}: AboutChapterProps) => {
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const h2Split = new SplitText(h2Ref.current, {
        type: "chars",
      });
      const pSplit = new SplitText(pRef.current, {
        type: "lines",
      });
      const detailsSplit = new SplitText(detailsRef.current, {
        type: "lines",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });

      tl.from(h2Split.chars, {
        autoAlpha: 0,
        stagger: { amount: 0.6, from: "random" },
        ease: "power2.inOut",
      })
        .from(
          pSplit.lines,
          {
            autoAlpha: 0,
            yPercent: 100,
            duration: 0.8,
            stagger: 0.08,
            ease: "power4.out",
          },
          "-=0.5"
        ) // Overlap animations for a smoother effect
        .from(
          detailsSplit.lines,
          {
            autoAlpha: 0,
            yPercent: 100,
            duration: 0.8,
            stagger: 0.08,
            ease: "power4.out",
          },
          "<"
        ); // Start at the same time as the previous animation

      // Bonus: Animate the card as well for a more complete entrance
      gsap.from(".about-card-container", {
        autoAlpha: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
      });

      // 3. CLEANUP: This is crucial. Revert the splits to remove the extra <div>s
      // that SplitText creates. This prevents memory leaks and issues on re-renders.
      return () => {
        h2Split.revert();
        pSplit.revert();
        detailsSplit.revert();
      };
    },
    // The scope ensures these GSAP animations only target elements inside containerRef.
    // The dependencies array correctly re-runs the entire animation when the active slide changes.
    { scope: containerRef, dependencies: [activeIndex] }
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col gap-20 items-center relative md:min-h-[650px] min-h-[550px]",
        className
      )}
    >
      <AboutCard image={image} title={title} className="about-card-container" />

      <div className="flex max-xl:flex-col items-center xl:justify-between justify-end md:gap-10 gap-6 absolute inset-0">
        <div className="flex items-center justify-center flex-col gap-6 xl:ml-[10vw]">
          <Text
            as="h2"
            ref={h2Ref}
            variant="lead"
            className="tracking-tight font-semibold max-w-[1100px] uppercase"
          >
            {title}
          </Text>
          <Text
            as="p"
            ref={pRef}
            variant="medium"
            className="max-w-[400px] text-center"
          >
            {brief}
          </Text>
        </div>
        <Text
          as="p"
          ref={detailsRef}
          variant="small"
          className="text-center max-w-[600px] xl:mt-auto max-lg:mx-auto xl:mr-[5vw]"
        >
          {details}
        </Text>
      </div>
    </div>
  );
};

export default AboutChapter;
