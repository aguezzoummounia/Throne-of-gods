"use client";
import { useEffect, useRef, useCallback } from "react";
import { useAudio } from "@/context/sound-context";
import { usePreloader } from "@/context/asset-loader-provider";

const BACKGROUND_MUSIC_VOLUME = 0.2;
const FADE_DURATION = 1000; // 1 second fade
const VOLUME_STEP = 0.02; // Smooth volume steps
const FADE_INTERVAL = 50; // 50ms intervals for smooth fade

export const BackgroundMusic = () => {
  const { isMuted } = useAudio();
  const { assets, hasInteracted } = usePreloader();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);

  // Optimized fade function
  const fadeVolume = useCallback(
    (targetVolume: number, onComplete?: () => void) => {
      const audio = audioRef.current;
      if (!audio) return;

      // Clear existing fade
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }

      const startVolume = audio.volume;
      const volumeDiff = targetVolume - startVolume;
      const steps = FADE_DURATION / FADE_INTERVAL;
      const stepSize = volumeDiff / steps;
      let currentStep = 0;

      fadeIntervalRef.current = setInterval(() => {
        currentStep++;
        const newVolume = startVolume + stepSize * currentStep;

        if (currentStep >= steps) {
          audio.volume = targetVolume;
          clearInterval(fadeIntervalRef.current!);
          fadeIntervalRef.current = null;
          onComplete?.();
        } else {
          audio.volume = Math.max(0, Math.min(1, newVolume));
        }
      }, FADE_INTERVAL);
    },
    []
  );

  // Initialize audio with optimized settings
  useEffect(() => {
    const backgroundAudio = assets.sounds.background;
    if (backgroundAudio && !isInitializedRef.current) {
      audioRef.current = backgroundAudio;

      // Optimize audio settings for background music
      backgroundAudio.loop = true;
      backgroundAudio.volume = 0; // Start at 0 for smooth fade-in
      backgroundAudio.preload = "auto";
      backgroundAudio.muted = isMuted;

      // Add event listeners for better control
      backgroundAudio.addEventListener("ended", () => {
        // Fallback in case loop fails
        backgroundAudio.currentTime = 0;
        backgroundAudio.play().catch(console.warn);
      });

      backgroundAudio.addEventListener("error", (e) => {
        if (process.env.NODE_ENV === "development") {
          console.warn("Background music error:", e);
        }
      });

      isInitializedRef.current = true;
    }

    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, [assets.sounds, isMuted]);

  // Handle mute state changes with smooth fade
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      // Fade out then mute
      fadeVolume(0, () => {
        audio.muted = true;
      });
    } else {
      // Unmute then fade in
      audio.muted = false;
      if (hasInteracted && !audio.paused) {
        fadeVolume(BACKGROUND_MUSIC_VOLUME);
      }
    }
  }, [isMuted, fadeVolume, hasInteracted]);

  // Handle user interaction and playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !hasInteracted || isMuted) return;

    // Only start if not already playing
    if (audio.paused) {
      // Start playback with smooth fade-in
      const playPromise = audio.play();

      if (playPromise) {
        playPromise
          .then(() => {
            // Fade in the volume smoothly
            fadeVolume(BACKGROUND_MUSIC_VOLUME);
          })
          .catch((error) => {
            if (process.env.NODE_ENV === "development") {
              console.warn("Background audio failed to play:", error);
            }
          });
      }
    } else if (audio.volume === 0) {
      // Already playing but volume is 0, fade in
      fadeVolume(BACKGROUND_MUSIC_VOLUME);
    }
  }, [hasInteracted, fadeVolume, isMuted]);

  return null;
};
