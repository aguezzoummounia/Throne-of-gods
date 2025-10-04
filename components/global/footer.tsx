"use client";
import { gsap } from "gsap";
import Link from "next/link";
import Text from "../ui/text";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import Button from "../ui/button-or-link";
import ScrollTrigger from "gsap/ScrollTrigger";
import AdaptiveRippleImage from "../adaptive-ripple-image";
import { dev_url, site_name, email_address, trailer_url } from "@/lib/consts";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

const Footer: React.FC = () => {
  const pRef = useRef<HTMLHeadingElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const buttonsGroup = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Main headline split
      const h2Split = new SplitText(h2Ref.current, {
        type: "chars",
        autoSplit: true,
        smartWrap: true,
        onSplit: (self) => {
          // Animate chars inside timeline (with scrollTrigger)
          const h2Tween = gsap.from(self.chars, {
            autoAlpha: 0,
            stagger: {
              amount: 0.6,
              from: "random",
            },
            scrollTrigger: {
              trigger: h2Ref.current,
              start: "top 70%",
            },
          });
          return h2Tween;
        },
      });

      // Paragraph split
      const pSplit = new SplitText(pRef.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) => {
          // Animate lines with their own ScrollTrigger
          const pTween = gsap.from(self.lines, {
            stagger: 0.1,
            autoAlpha: 0,
            yPercent: 100,
            duration: 1.5,
            ease: "power4.out",
            scrollTrigger: {
              trigger: pRef.current,
              start: "top 70%",
            },
          });
          return pTween;
        },
      });

      const buttons = gsap.utils.toArray<HTMLButtonElement>(
        buttonsGroup.current?.children || []
      );
      // Buttons animation (own ScrollTrigger)
      gsap.from(buttons, {
        yPercent: 15,
        autoAlpha: 0,
        stagger: 0.3,
        ease: "power2.inOut",
        duration: 1.2,
        scrollTrigger: {
          trigger: buttons,
          start: "top 80%",
        },
      });

      return () => {
        h2Split.revert();
        pSplit.revert();
      };
    },
    { scope: container }
  );

  return (
    <footer
      ref={container}
      className="px-12 max-md:px-5 md:py-10 py-8 md:pt-30 pt-16 overflow-hidden"
    >
      <div className="w-full flex flex-col gap-10 items-center xl:justify-center xl:max-w-[55%] lg:max-w-[70%] mx-auto">
        <Text as="h2" ref={h2Ref} variant="title" className="text-center">
          Memory Burns Brighter Than Flame
        </Text>

        <Text as="p" ref={pRef} className="text-center">
          Immerse yourself in a dark epic of shattered truths, buried empires,
          and the fire-forged rise of those who remember. In a land reborn by
          curse and prophecy, power is not inherited, it is claimed through
          betrayal, defiance, and impossible rebirth.
        </Text>

        <div
          ref={buttonsGroup}
          className="flex flex-wrap [&>a]:w-[120px] gap-4"
        >
          <Button animated target="_blank" href={trailer_url}>
            See trailer
          </Button>
          <Button animated href={`mailto:${email_address}`}>
            Reach out
          </Button>
        </div>
      </div>

      <div className="footer-bottom-section 2xl:h-96 md:h-[350px] h-80 relative flex items-center justify-center 2xl:mt-10">
        <AdaptiveRippleImage />
        <div className="flex items-center justify-between absolute inset-[auto_0%_0%]">
          <Text
            variant="xs"
            color="lightDark"
            className="col-span-1 row-start-2 col-start-1"
          >
            &#169; {new Date().getFullYear()} {site_name} | All rights reserved
          </Text>
          <Text
            variant="xs"
            color="lightDark"
            className="col-span-1 row-start-2 col-start-2 flex justify-end"
          >
            <span>Site by</span>
            <Link target="_blank" href={dev_url} className="underline pl-1">
              DEV
            </Link>
          </Text>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
