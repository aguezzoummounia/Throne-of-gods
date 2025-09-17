"use client";
import { useEffect, useRef } from "react";
import { useAudio } from "@/context/sound-context";
import { usePreloader } from "@/context/asset-loader-provider";

const BACKGROUND_MUSIC_VOLUME = 0.2;

export const BackgroundMusic = () => {
  const { isMuted } = useAudio();
  const { assets, hasInteracted } = usePreloader();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize the Audio object on mount
  useEffect(() => {
    if (assets.sounds.background) {
      audioRef.current = assets.sounds.background;
      audioRef.current.loop = true;
      audioRef.current.volume = BACKGROUND_MUSIC_VOLUME;
    }
  }, [assets.sounds]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    // The logic is exactly the same, but the source of `hasInteracted` is now the PreloadContext.
    if (hasInteracted && audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch((e) => {
        console.error("Background audio failed to play:", e);
      });
    }
  }, [hasInteracted, assets.sounds]);

  return null; // This component does not render anything
};
