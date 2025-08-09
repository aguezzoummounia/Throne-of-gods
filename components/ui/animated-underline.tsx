import { cn } from "@/lib/utils";

const AnimatedUnderline: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        "overflow-hidden flex w-full absolute -bottom-2 transition-transform ease-[cubic-bezier(.16,1,.3,1)] duration-1000 text-[#796f65]",
        className
      )}
    >
      <span className="flex shrink-0 overflow-hidden w-full transition-transform ease-[cubic-bezier(.16,1,.3,1)] duration-1000">
        <svg
          fill="none"
          viewBox="0 0 184 6"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full shrink-0 h-[10px] wave-animation"
        >
          <path
            d="M0 3.06906C16.1729 3.06906 18.301 4.17184 40.304 4.1656C49.4923 4.163 58.6307 1.49475 70.5145 2.08534C78.2991 2.47221 81.8711 3.99374 89.5789 4.56971C107.898 5.93858 115.879 4.50029 134.167 3.06906C153.333 1.56906 157.744 3.06906 184 3.06906"
            stroke="currentColor"
          ></path>
        </svg>
        <svg
          fill="none"
          viewBox="0 0 184 6"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full shrink-0 h-[10px] wave-animation"
        >
          <path
            d="M0 3.06906C16.1729 3.06906 18.301 4.17184 40.304 4.1656C49.4923 4.163 58.6307 1.49475 70.5145 2.08534C78.2991 2.47221 81.8711 3.99374 89.5789 4.56971C107.898 5.93858 115.879 4.50029 134.167 3.06906C153.333 1.56906 157.744 3.06906 184 3.06906"
            stroke="currentColor"
          ></path>
        </svg>
      </span>
      <span className="flex shrink-0 overflow-hidden w-full transition-transform ease-[cubic-bezier(.16,1,.3,1)] duration-1000 absolute">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-full shrink-0 h-[10px] wave-animation-reversed"
          viewBox="0 0 184 6"
          fill="none"
        >
          <path
            opacity=".6"
            d="M0 3.05204C16.1729 3.05204 18.301 1.94926 40.304 1.95549C49.4923 1.95809 58.6307 4.62635 70.5145 4.03576C78.2991 3.64888 81.8711 2.12735 89.5789 1.55139C107.898 0.182513 115.879 1.6208 134.167 3.05204C153.333 4.55204 157.744 3.05204 184 3.05204"
            stroke="currentColor"
          ></path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-full shrink-0 h-[10px] wave-animation-reversed"
          viewBox="0 0 184 6"
          fill="none"
        >
          <path
            opacity=".6"
            d="M0 3.05204C16.1729 3.05204 18.301 1.94926 40.304 1.95549C49.4923 1.95809 58.6307 4.62635 70.5145 4.03576C78.2991 3.64888 81.8711 2.12735 89.5789 1.55139C107.898 0.182513 115.879 1.6208 134.167 3.05204C153.333 4.55204 157.744 3.05204 184 3.05204"
            stroke="currentColor"
          ></path>
        </svg>
      </span>
    </div>
  );
};

export default AnimatedUnderline;
