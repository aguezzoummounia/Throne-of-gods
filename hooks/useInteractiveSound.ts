import { useAudio } from "@/context/sound-context";

export const useInteractiveSound = () => {
  const { playHoverSound, playClickSound } = useAudio();

  return {
    onMouseEnter: playHoverSound,
    onClick: playClickSound,
  };
};
