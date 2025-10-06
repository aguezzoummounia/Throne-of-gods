import { cn } from "@/lib/utils";

interface HeroSVGProp {
  className?: string;
}

const HeroSVGs = ({ className }: HeroSVGProp) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "w-[50%] md:text-bronze/50 text-bronze drop-shadow-[0_0_4px_rgba(244,234,143,0.5)] m-auto",
        className
      )}
      viewBox="0 0 500 500"
      fill="none"
    >
      <line
        x1="264"
        y1="6"
        x2="499"
        y2="6"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="494"
        y1="221"
        x2="494"
        y2="1"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="236"
        y1="494"
        x2="1"
        y2="494"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="6"
        y1="264"
        x2="6"
        y2="499"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M256.774 6L251 0.226497L245.226 6L251 11.7735L256.774 6ZM251 6V5L16 5V6V7L251 7V6Z"
        fill="currentColor"
      />
      <path
        d="M6 256.774L11.7735 251L6 245.226L0.226497 251L6 256.774ZM6 251H7L7 16H6H5L5 251H6Z"
        fill="currentColor"
      />
      <path
        d="M236.667 242C236.667 244.946 239.054 247.333 242 247.333C244.946 247.333 247.333 244.946 247.333 242C247.333 239.054 244.946 236.667 242 236.667C239.054 236.667 236.667 239.054 236.667 242ZM242 242V243L477 243V242V241L242 241V242Z"
        fill="currentColor"
      />
      <path
        d="M265.333 259C265.333 256.054 262.946 253.667 260 253.667C257.054 253.667 254.667 256.054 254.667 259C254.667 261.946 257.054 264.333 260 264.333C262.946 264.333 265.333 261.946 265.333 259ZM260 259V258H25V259V260H260V259Z"
        fill="currentColor"
      />
      <line
        x1="1"
        y1="242"
        x2="226"
        y2="242"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="260"
        y1="259"
        x2="260"
        y2="34"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="242"
        y1="467"
        x2="242"
        y2="242"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="274"
        y1="259"
        x2="499"
        y2="259"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="241"
        y1="226"
        x2="241"
        y2="1"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="259"
        y1="499"
        x2="259"
        y2="274"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="1"
        y="5.9502"
        width="7"
        height="7"
        transform="rotate(-45 1 5.9502)"
        fill="currentColor"
      />
      <path
        d="M243.226 494L249 499.774L254.774 494L249 488.226L243.226 494ZM249 494V495H484V494V493H249V494Z"
        fill="currentColor"
      />
      <path
        d="M494 243.226L488.226 249L494 254.774L499.774 249L494 243.226ZM494 249H493V484H494H495V249H494Z"
        fill="currentColor"
      />
      <rect
        x="498.899"
        y="493.941"
        width="7"
        height="7"
        transform="rotate(134.899 498.899 493.941)"
        fill="currentColor"
      />
    </svg>
  );
};

export default HeroSVGs;
