"use client";

import React, {
  createContext,
  useRef,
  useState,
  useContext,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playHoverSound: () => void;
  playClickSound: () => void;
  playSlideSound: () => void;
}

const EFFECTS_VOLUME = 0.4; // 40% volume for effects
const HOVER_DEBOUNCE_DELAY = 100; // in milliseconds
const CLICK_COOLDOWN_DELAY = 200; // in milliseconds

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const [isMuted, setIsMuted] = useState(false);

  // Use useRef to hold the Audio objects. This prevents them from being re-created on every render.
  const hoverAudioRef = useRef<HTMLAudioElement | null>(null);
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);
  const slideAudioRef = useRef<HTMLAudioElement | null>(null);

  // Refs for debouncing and rate-limiting
  const lastClickTimeRef = useRef<number>(0);
  const hoverDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Audio objects on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      hoverAudioRef.current = new Audio("/sounds/hover-sf.wav");
      clickAudioRef.current = new Audio("/sounds/click-sf.wav");
      slideAudioRef.current = new Audio("/sounds/slide-over-sf.mp3");
      // Set initial volume for all sound effects
      hoverAudioRef.current.volume = EFFECTS_VOLUME;
      clickAudioRef.current.volume = EFFECTS_VOLUME;
      slideAudioRef.current.volume = EFFECTS_VOLUME;
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newMutedState = !prev;
      if (hoverAudioRef.current) hoverAudioRef.current.muted = newMutedState;
      if (clickAudioRef.current) clickAudioRef.current.muted = newMutedState;
      if (slideAudioRef.current) slideAudioRef.current.muted = newMutedState;
      return newMutedState;
    });
  }, []);

  const playHoverSound = useCallback(() => {
    if (isMuted || !hoverAudioRef.current) return;

    // Clear any existing timer
    if (hoverDebounceTimerRef.current) {
      clearTimeout(hoverDebounceTimerRef.current);
    }

    // Set a new timer
    hoverDebounceTimerRef.current = setTimeout(() => {
      const audio = hoverAudioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio
          .play()
          .catch((error) => console.log("Error playing hover sound:", error));
      }
    }, HOVER_DEBOUNCE_DELAY);
  }, [isMuted]);

  const playClickSound = useCallback(() => {
    if (isMuted || !clickAudioRef.current) return;

    const now = Date.now();
    // Check if enough time has passed since the last click
    if (now - lastClickTimeRef.current > CLICK_COOLDOWN_DELAY) {
      lastClickTimeRef.current = now; // Update the last click time
      const audio = clickAudioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio
          .play()
          .catch((error) => console.log("Error playing click sound:", error));
      }
    }
  }, [isMuted]);

  const playSlideSound = useCallback(() => {
    if (isMuted || !slideAudioRef.current) return;

    const audio = slideAudioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio
        .play()
        .catch((error) => console.log("Error playing slide sound:", error));
    }
  }, [isMuted]);

  const value = {
    isMuted,
    toggleMute,
    playHoverSound,
    playClickSound,
    playSlideSound,
  };

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
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
