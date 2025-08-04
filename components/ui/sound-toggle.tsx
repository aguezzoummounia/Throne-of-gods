"use client";
import { useSound } from "@/context/sound-context";

const SoundToggle: React.FC = () => {
  const { isSoundEnabled, toggleSound } = useSound();
  return (
    <button
      type="button"
      title="toggle sound"
      onClick={toggleSound}
      className="py-0.5 px-1 flex items-center justify-center cursor-pointer"
    >
      {isSoundEnabled ? (
        <div className="flex justify-between gap-[1.25px] w-5 h-5">
          <div className="rounded-[1px] h-full w-[1.5px] bg-[#8F7E77]  transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] audio-line-3" />
          <div className="rounded-[1px] h-full w-[1.5px] bg-[#8F7E77]  transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] audio-line-1" />
          <div className="rounded-[1px] h-full w-[1.5px] bg-[#8F7E77]  transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] audio-line-2" />
          <div className="rounded-[1px] h-full w-[1.5px] bg-[#8F7E77]  transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] audio-line-3" />
          <div className="rounded-[1px] h-full w-[1.5px] bg-[#8F7E77]  transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] audio-line-4" />
        </div>
      ) : (
        <div className="flex justify-between w-4.5 h-4">
          <div className="rounded-[2px] h-full w-[1.75px] bg-[#8F7E77]/30 flex items-end">
            <div className="h-[30%] w-full rounded-[2px] bg-[#8F7E77]" />
          </div>
          <div className="rounded-[2px] h-full w-[2px] bg-[#8F7E77]/30 flex items-end">
            <div className="h-[30%] w-full rounded-[2px] bg-[#8F7E77]" />
          </div>
          <div className="rounded-[2px] h-full w-[1.75px] bg-[#8F7E77]/30 flex items-end">
            <div className="h-[30%] w-full rounded-[2px] bg-[#8F7E77]" />
          </div>
          <div className="rounded-[2px] h-full w-[2px] bg-[#8F7E77]/30 flex items-end">
            <div className="h-[30%] w-full rounded-[2px] bg-[#8F7E77]" />
          </div>
          <div className="rounded-[2px] h-full w-[1.75px] bg-[#8F7E77]/30 flex items-end">
            <div className="h-[30%] w-full rounded-[2px] bg-[#8F7E77]" />
          </div>
        </div>
      )}
    </button>
  );
};

export default SoundToggle;
