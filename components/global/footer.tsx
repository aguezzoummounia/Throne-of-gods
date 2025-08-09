"use client";
import { gsap } from "gsap";
import Link from "next/link";
import Text from "../ui/text";
import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import Button from "../ui/button-or-link";
import ScrollTrigger from "gsap/ScrollTrigger";
import { dev_url, site_name, email_address, trailer_url } from "@/lib/consts";

gsap.registerPlugin(SplitText, ScrollTrigger);

const Footer: React.FC = () => {
  const pRef = useRef<HTMLHeadingElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const linksGroup = useRef<HTMLDivElement>(null);
  const buttonsGroup = useRef<HTMLDivElement>(null);

  // animations
  useGSAP(
    () => {
      const pSplit = new SplitText(pRef.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
      });
      const h2Split = new SplitText(h2Ref.current, {
        type: "chars",
        smartWrap: true,
      });
      const buttons = gsap.utils.toArray<HTMLButtonElement>(
        buttonsGroup.current?.children || []
      );
      const links = gsap.utils.toArray<HTMLButtonElement>(
        linksGroup.current?.children || []
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
      });

      // h2 character animation
      tl.from(
        h2Split.chars,
        {
          autoAlpha: 0,
          stagger: {
            amount: 0.5,
            from: "random",
          },
        },
        0
      );
      // P lines mask animation
      tl.from(
        pSplit.lines,
        {
          stagger: 0.1,
          autoAlpha: 0,
          yPercent: 100,
          ease: "expo.out",
        },
        0.2
      );

      // BUTTONS animation
      tl.from(
        buttons,
        {
          y: 30,
          opacity: 0,
          stagger: 0.2,
          ease: "power3.inOut",
          duration: 0.7,
        },
        0.4
      );

      // BOTTOM LINKS animations
      tl.from(
        links,
        {
          y: 10,
          opacity: 0,
          stagger: 0.2,
          ease: "power3.inOut",
          duration: 0.7,
        },
        0.6
      );
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
          Where Memory Burns Brighter Than Flame
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

      <div className="2xl:h-96 md:h-[350px] h-80 relative flex items-center justify-center 2xl:mt-10">
        <Image
          width={1080}
          height={1080}
          src="/footer-bg-2.avif"
          alt="footer background compass image"
          className="md:absolute md:bottom-[0%] md:translate-y-[50%] md:left-[50%] md:-translate-x-[50%] max-md:h-[70%] max-md:aspect-square max-md:w-auto xl:w-[45%] lg:w-[60%] md:w-[60%]"
        />
        <div
          ref={linksGroup}
          className="flex items-center justify-between absolute inset-[auto_0%_0%]"
        >
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
