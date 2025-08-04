"use client";
import { gsap } from "gsap";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import Button from "../ui/button-or-link";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const site_name = process.env.NEXT_PUBLIC_SITE_NAME;

const Footer: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);
  const topGroup = useRef<(HTMLElement | null)[]>([]);
  const bottomGroup = useRef<(HTMLElement | null)[]>([]);

  // animations
  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
      });

      tl.from(topGroup.current, {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        ease: "power3.out",
        duration: 1,
      });

      tl.from(
        bottomGroup.current,
        {
          y: 10,
          opacity: 0,
          stagger: 0.1,
          ease: "power2.out",
          duration: 0.8,
        },
        "-=0.3" // overlaps slightly with the end of topGroup
      );
    },
    { scope: container }
  );

  return (
    <footer
      ref={container}
      className="px-12 max-md:px-6 md:py-10 py-8 md:pt-30 pt-16 overflow-hidden bg-orange-950 relative"
    >
      <Image
        width={1980}
        height={1024}
        src="/bg/bg-2.webp"
        alt="background dark blue image"
        className="absolute inset-0 object-cover w-full h-full z-0 object-center"
      />

      <div className="block z-10 relative">
        <div className="w-full flex flex-col gap-10 items-center xl:justify-center xl:max-w-[55%] lg:max-w-[70%] mx-auto">
          <h2
            ref={(el) => {
              topGroup.current[0] = el;
            }}
            className="font-cinzeldecorative lg:text-6xl md:text-4xl text-2xl text-center"
          >
            Where Memory Burns Brighter Than Flame
          </h2>
          <p
            ref={(el) => {
              topGroup.current[1] = el;
            }}
            className="text-center"
          >
            Immerse yourself in a dark epic of shattered truths, buried empires,
            and the fire-forged rise of those who remember. In a land reborn by
            curse and prophecy, power is not inherited, it is claimed through
            betrayal, defiance, and impossible rebirth.
          </p>
          <div
            ref={(el) => {
              topGroup.current[2] = el;
            }}
            className="flex flex-wrap [&>a]:w-[120px] gap-4"
          >
            <Button
              animated
              target="_blank"
              href="https://youtu.be/ctfNQvJssVo?si=Mtqscdb6Ajjkm1YY"
            >
              See trailer
            </Button>
            <Button animated href="mailto:throneofgods@gmail.com">
              Reach out
            </Button>
          </div>
        </div>

        <div className="md:h-96 h-80 relative flex items-center justify-center xl:mt-10">
          <Image
            width={1080}
            height={1080}
            src="/footer-bg-2.avif"
            alt="footer background compass image"
            className="md:absolute md:bottom-[0%] md:translate-y-[50%] md:left-[50%] md:-translate-x-[50%]  max-md:h-[70%] max-md:aspect-square max-md:w-auto xl:w-[45%] lg:w-[60%] md:w-[60%]"
          />
          <div className="flex items-center justify-between absolute inset-[auto_0%_0%]">
            <span
              ref={(el) => {
                bottomGroup.current[0] = el;
              }}
              className="text-xs md:text-sm text-[rgba(255,255,255,0.6)] col-span-1 row-start-2 col-start-1"
            >
              &#169; {new Date().getFullYear()} {site_name} | All rights
              reserved
            </span>
            <div
              ref={(el) => {
                bottomGroup.current[1] = el;
              }}
              className="text-xs md:text-sm text-[rgba(255,255,255,0.6)] col-span-1 row-start-2 col-start-2 flex justify-end"
            >
              <span>Site by</span>
              <Link
                target="_blank"
                className="underline pl-1"
                href="https://www.fiverr.com/users/younesbnlmoudn"
              >
                DEV
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
