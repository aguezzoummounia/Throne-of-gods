import { cn } from "@/lib/utils";
import AnimatedText from "./ui/animated-text";

const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col gap-8 items-center justify-center text-4xl p-10">
      <div className="">
        <h2 className="font-cinzeldecorative md:text-2xl text-xl">
          When the gods fall, who rises?
        </h2>
        <SVG className="w-[300px] " />
      </div>
      <AnimatedText>
        <p className="uppercase  md:text-4xl text-2xl text-center font-montserrat">
          Before time bore names and kings carved crowns from stardust, the
          world trembled beneath the Weeping Sky.
          <br />
          Centuries ago, three emperors ruled Erosea, each corrupting divine
          power in their own way
          <br />
          Their clashing ambitions fractured the world and unleashed grotesque,
          shadow-born monsters from the deep.
          <br />
          In desperation, they united and called down Goddess Law, who sealed
          the boundary between realms.
          <br />
          Her death marked the end of the Age of Divine Unity, and began the
          long wait for the prophecy's heir.
        </p>
      </AnimatedText>
      {/* <AnimatedText>
        <p className="">
          ⚔️ A Prince Reborn Eight centuries later, the empires have crumbled.
          But blood remembers. Kaen, Crown Prince of Galeeria, is born with the
          gods’ mark — and branded a curse. Framed for the murder of his father
          and betrayed by his stepmother and half-brother, he is executed and
          displayed for all to see. But death is not the end. Kaen awakens five
          years later in a stranger’s body, stripped of his name but wielding
          terrifying power: lightning, strength, and a healing flame that burns
          like prophecy. Driven by vengeance, he discovers that Valeon’s ancient
          curse still lives — and it’s waking.
        </p>
      </AnimatedText>
      <AnimatedText>
        <p className="">
          🕊 Threads of Power As kingdoms rot and queens twist prophecy to their
          will, Kaen finds himself in a deeper game orchestrated by Princess
          Lucindra Thalakar, a reborn seer claiming the Weaver of Fates sent
          her. In a land where power devours and the past refuses silence, Kaen
          must face the storm of his destiny. Will he command it — or be
          consumed by it?
        </p>
      </AnimatedText>
*/}
      <AnimatedText>
        <p className="max-w-[768px] text-center font-alegreya">
          But no story shall live without the ones who walk it.
          <br />
          These are the cursed, the chosen, and the condemned
        </p>
      </AnimatedText>
      {/* <h2 className="font-alegreya">This is test only</h2>
      <h2 className="font-cardo">This is test only</h2>
      <h2 className="font-cinzel">This is test only</h2>
      <h2 className="font-medievalsharp">This is test only</h2>
      <h2 className="font-montserrat">This is test only</h2>
      <h2 className="font-imfellenglish">This is test only</h2>
      <h2 className="font-alegreya">This is test only</h2>
      <h2 className="font-cinzeldecorative">This is test only</h2> */}
    </div>
  );
};

export default About;

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
