"use client";

import {
  useRef,
  useState,
  useEffect,
  ReactNode,
  useContext,
  useCallback,
  createContext,
  useMemo,
} from "react";
import { usePreloader } from "./asset-loader-provider";

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playHoverSound: () => void;
  playClickSound: () => void;
  playSlideSound: () => void;
}

// Optimized constants
const EFFECTS_VOLUME = 0.4;
const HOVER_THROTTLE_DELAY = 80; // Reduced for better responsiveness
const CLICK_THROTTLE_DELAY = 150; // Reduced for better responsiveness
const SLIDE_THROTTLE_DELAY = 200;

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const { assets } = usePreloader();
  const [isMuted, setIsMuted] = useState(false);

  // Audio refs - using Map for better performance with multiple sounds
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());

  // Throttling refs - using Map for scalability
  const throttleTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const lastPlayTimes = useRef<Map<string, number>>(new Map());

  // Initialize audio objects with optimized setup
  useEffect(() => {
    const soundKeys = ["hover", "click", "slide"] as const;

    soundKeys.forEach((key) => {
      const audio = assets.sounds[key];
      if (audio) {
        // Configure audio for optimal performance
        audio.volume = EFFECTS_VOLUME;
        audio.preload = "auto";
        audio.muted = isMuted;

        // Store in map for efficient access
        audioRefs.current.set(key, audio);

        // Initialize timing tracking
        lastPlayTimes.current.set(key, 0);
      }
    });

    // Cleanup function
    return () => {
      throttleTimers.current.forEach((timer) => clearTimeout(timer));
      throttleTimers.current.clear();
    };
  }, [assets.sounds, isMuted]);

  // Optimized mute toggle with batch updates
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newMutedState = !prev;

      // Batch update all audio elements
      audioRefs.current.forEach((audio) => {
        audio.muted = newMutedState;
      });

      return newMutedState;
    });
  }, []);

  // Generic optimized sound player with throttling
  const createSoundPlayer = useCallback(
    (soundKey: string, throttleDelay: number) => {
      return () => {
        if (isMuted) return;

        const audio = audioRefs.current.get(soundKey);
        if (!audio) return;

        const now = performance.now(); // More precise than Date.now()
        const lastPlayTime = lastPlayTimes.current.get(soundKey) || 0;

        // Throttle check
        if (now - lastPlayTime < throttleDelay) return;

        // Clear existing timer for this sound
        const existingTimer = throttleTimers.current.get(soundKey);
        if (existingTimer) {
          clearTimeout(existingTimer);
        }

        // Set new timer
        const timer = setTimeout(() => {
          if (audio && !isMuted) {
            // Reset to start for immediate playback
            audio.currentTime = 0;

            // Play with error handling
            const playPromise = audio.play();
            if (playPromise) {
              playPromise.catch((error) => {
                if (process.env.NODE_ENV === "development") {
                  console.warn(`Error playing ${soundKey} sound:`, error);
                }
              });
            }

            // Update last play time
            lastPlayTimes.current.set(soundKey, performance.now());
          }

          // Clean up timer reference
          throttleTimers.current.delete(soundKey);
        }, 16); // ~60fps for smooth audio

        throttleTimers.current.set(soundKey, timer);
      };
    },
    [isMuted]
  );

  // Memoized sound players for optimal performance
  const playHoverSound = useMemo(
    () => createSoundPlayer("hover", HOVER_THROTTLE_DELAY),
    [createSoundPlayer]
  );

  const playClickSound = useMemo(
    () => createSoundPlayer("click", CLICK_THROTTLE_DELAY),
    [createSoundPlayer]
  );

  const playSlideSound = useMemo(
    () => createSoundPlayer("slide", SLIDE_THROTTLE_DELAY),
    [createSoundPlayer]
  );

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      isMuted,
      toggleMute,
      playHoverSound,
      playClickSound,
      playSlideSound,
    }),
    [isMuted, toggleMute, playHoverSound, playClickSound, playSlideSound]
  );

  return (
    <SoundContext.Provider value={contextValue}>
      {children}
    </SoundContext.Provider>
  );
};

// Custom hook to use the sound context
export const useAudio = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error("useAudio  must be used within a SoundProvider");
  }
  return context;
};
