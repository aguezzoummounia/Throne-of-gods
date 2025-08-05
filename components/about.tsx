import Text from "./ui/text";
import Image from "next/image";
import { cn } from "@/lib/utils";
import AnimatedText from "./ui/animated-text";

const About: React.FC = () => {
  return (
    // md:pt-30 pt-16
    <section className="min-h-screen px-12 max-md:px-5 md:py-10 py-8 overflow-hidden relative">
      <Image
        width={1980}
        height={1024}
        src="/bg/bg-8.webp"
        alt="background dark blue image"
        className="absolute inset-0 object-cover w-full h-full z-0 object-center rotate-180"
      />
      <div className="relative z-10 flex flex-col gap-4 items-start justify-center">
        <div className="flex flex-col gap-4 items-start justify-center max-w-[768px]">
          <Text
            as="h2"
            variant="title"
            className="font-cinzeldecorative md:text-2xl text-xl"
          >
            When the gods fall, who rises?
          </Text>
          <Text as="h4" variant="lead">
            A god is not born.
            <br /> He is broken, burned, and reborn.
          </Text>
        </div>

        <Text>
          Throne of Gods is an epic fantasy saga set across centuries of
          forgotten wars, divine betrayals, and rising empires. It tells the
          intertwined fates of gods and mortals in the war-torn world of Erosea,
          where ancient powers slumber beneath ash and prophecy, waiting to
          awaken.
        </Text>
        <Text>
          The story begins in a forgotten era known as the Age of Divine Unity,
          where monstrous creatures from the deep rise against three corrupt
          emperors—only to be stopped by the last act of a dying goddess.
        </Text>
        <Text>
          Her sacrifice ends an age of magic and unity, leaving behind a fading
          prophecy: a true heir will return to wake the dawn. Centuries later,
          in a fractured world ruled by greed and deception, a murdered prince
          named Kaen is reborn in a stranger’s body, bearing the divine powers
          of lightning and fire. Once cast aside as illegitimate, Kaen now
          returns as something more—a god in exile, hunted by emperors, feared
          by queens, and drawn toward a destiny written in celestial blood.
        </Text>
        <Text>
          From secret military camps and cursed royal banquets to the halls of
          flame-worshipping orders and forgotten tombs, Throne of Gods weaves a
          sweeping narrative of power, identity, and redemption.
        </Text>

        <Text>
          At its core is Kaen—ruthless yet loyal, divine yet human—facing his
          past sins, forging unlikely alliances, and challenging the very order
          that sought to erase him. As ancient prophecies stir and reborn souls
          converge, the question is no longer who will rule? but who is worthy
          of godhood?
        </Text>
      </div>
    </section>
  );
};

export default About;

//         <svg aria-hidden="true" class="chapter-title-card__instructions__svg chapter-title-card__instructions__svg--c3">
//     <use xlink:href="#c3"></use>
// </svg>
{
  /* <AnimatedText>
  <p className="max-w-[768px] text-center font-alegreya">
    But no story shall live without the ones who walk it.
    <br />
    These are the cursed, the chosen, and the condemned
  </p>
</AnimatedText> */
}

const SVG = ({ className }: { className?: string }) => {
  return (
    <svg
      fill="none"
      viewBox="0 0 49 7"
      className={cn(className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_888_87)">
        <path
          d="M-1730.99 -4.38742L131.436 10.3682L134.846 -420.01L-1727.58 -434.765L-1730.99 -4.38742Z"
          fill="white"
        />
        <mask
          id="mask0_888_87"
          maskUnits="userSpaceOnUse"
          x="-44"
          y="2"
          width="94"
          height="2"
        >
          <path
            d="M-43.9773 2.87298C-28.3766 2.7847 -12.7782 2.96225 2.82149 2.99812C18.4198 3.20942 34.022 3.27907 49.6194 3.61453C34.0187 3.70008 18.4173 3.52655 2.81762 3.48664C-12.7807 3.27534 -28.38 3.20571 -43.9773 2.87298Z"
            fill="white"
          />
        </mask>
        <g mask="url(#mask0_888_87)">
          <path
            d="M-43.9773 2.87298C-28.3766 2.7847 -12.7782 2.96225 2.82149 2.99812C18.4198 3.20942 34.022 3.27907 49.6194 3.61453C34.0187 3.70008 18.4173 3.52655 2.81762 3.48664C-12.7807 3.27534 -28.38 3.20571 -43.9773 2.87298Z"
            fill="#D5A533"
          />
        </g>
      </g>
      <mask
        id="mask1_888_87"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="7"
        height="7"
      >
        <path
          d="M3.15556 6.44423L0.136439 3.2329L3.2142 0.0749403L6.23628 3.28906L3.15556 6.44423Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask1_888_87)">
        <path
          d="M3.15556 6.44423L0.136439 3.2329L3.2142 0.0749403L6.23628 3.28906L3.15556 6.44423Z"
          fill="#D5A533"
        />
      </g>
      <mask
        id="mask2_888_87"
        maskUnits="userSpaceOnUse"
        x="9"
        y="2"
        width="3"
        height="3"
      >
        <path
          d="M10.4761 4.31323L11.4248 3.33811L10.4941 2.34852L9.54273 3.32079L10.4761 4.31323Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask2_888_87)">
        <path
          d="M10.4761 4.31323L11.4248 3.33811L10.4941 2.34852L9.54273 3.32079L10.4761 4.31323Z"
          fill="#D5A533"
        />
      </g>
      <mask
        id="mask3_888_87"
        maskUnits="userSpaceOnUse"
        x="6"
        y="1"
        width="4"
        height="4"
      >
        <path
          d="M7.93422 4.68304L9.26734 3.31627L7.95961 1.92527L6.62378 3.29194L7.93422 4.68304Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask3_888_87)">
        <path
          d="M7.93422 4.68304L9.26734 3.31627L7.95961 1.92527L6.62378 3.29194L7.93422 4.68304Z"
          fill="#D5A533"
        />
      </g>
      <defs>
        <clipPath id="clip0_888_87">
          <rect
            width="45.4818"
            height="0.488526"
            fill="white"
            transform="translate(48.4805 3.84863) rotate(-179.546)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
