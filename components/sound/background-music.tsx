"use client";
import { useAudio } from "@/context/sound-context";
import { useEffect, useRef, useState } from "react";

const BACKGROUND_MUSIC_VOLUME = 0.2;

export const BackgroundMusic = () => {
  const { isMuted } = useAudio();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Initialize the Audio object on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/sounds/background-sf.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = BACKGROUND_MUSIC_VOLUME;
    }
  }, []);

  // Effect to play/pause based on mute state and user interaction
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (hasInteracted && !isMuted) {
      audio
        .play()
        .catch((error) => console.error("Autoplay was prevented:", error));
    } else {
      audio.pause();
    }
  }, [isMuted, hasInteracted]);

  // Effect to listen for the first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      setHasInteracted(true);
      // Clean up the listener after the first interaction
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };

    window.addEventListener("click", handleFirstInteraction);
    window.addEventListener("keydown", handleFirstInteraction);

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, []);

  return null; // This component does not render anything
};
