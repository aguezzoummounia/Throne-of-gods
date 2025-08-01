"use client";
import { useSound } from "@/context/sound-context";

const SoundToggle: React.FC = () => {
  const { isSoundEnabled, toggleSound } = useSound();
  return (
    <button
      type="button"
      title="toggle sound"
      onClick={toggleSound}
      className="py-0.5 px-1.5 cursor-pointer bg-green-300"
    >
      {isSoundEnabled ? (
        <svg
          fill="none"
          className="w-6 h-6"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 11V13M6 8V16M9 10V14M12 7V17M15 4V20M18 9V15M21 11V13"
            stroke="#8F7E77"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        "OFF"
      )}
    </button>
  );
};

export default SoundToggle;
