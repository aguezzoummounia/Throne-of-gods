"use client";
import { assets_to_load } from "@/lib/consts";
import { useState, useEffect, useRef } from "react";

interface UsePreloaderResult {
  errors: string[];
  progress: number;
  isLoaded: boolean;
  notifyShaderReady: () => void;
}

export function useAssetLoader(): UsePreloaderResult {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const totalAssets = assets_to_load.length; // +1 for shader
  const loadedCountRef = useRef(0);

  function handleAssetLoaded() {
    loadedCountRef.current += 1;
    const newProgress = Math.floor(
      (loadedCountRef.current / totalAssets) * 100
    );
    setProgress(newProgress);

    if (loadedCountRef.current >= totalAssets) {
      setTimeout(() => setIsLoaded(true), 500);
    }
  }

  function handleAssetError(src: string) {
    setErrors((prev) => [...prev, src]);
    handleAssetLoaded();
  }

  function notifyShaderReady() {
    handleAssetLoaded();
  }

  useEffect(() => {
    let cancelled = false;

    function preloadImage(src: string): Promise<void> {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (!cancelled) handleAssetLoaded();
          resolve();
        };
        img.onerror = () => {
          if (!cancelled) handleAssetError(src);
          resolve();
        };
        img.src = src;
      });
    }

    function preloadAudio(src: string): Promise<void> {
      return new Promise<void>((resolve) => {
        const audio = new Audio();
        audio.src = src;
        audio.preload = "auto";

        audio.oncanplaythrough = () => {
          if (!cancelled) handleAssetLoaded();
          resolve();
        };
        audio.onerror = () => {
          if (!cancelled) handleAssetError(src);
          resolve();
        };

        audio.load();
      });
    }
    function preloadFonts(): Promise<void> {
      return document.fonts.ready
        .then(() => {
          if (!cancelled) handleAssetLoaded();
        })
        .catch(() => {
          if (!cancelled) handleAssetError("fonts");
        });
    }

    async function loadAll() {
      const promises = assets_to_load.map((path) => {
        const url = path.startsWith("/") ? path : `/${path}`;
        if (/\.(png|jpe?g|gif|webp|avif)$/i.test(url)) {
          return preloadImage(url);
        }
        if (/\.(mp3|ogg|wav)$/i.test(url)) {
          return preloadAudio(url);
        }
        // Unsupported: just mark it as error
        return Promise.resolve().then(() => {
          if (!cancelled) handleAssetError(url);
        });
      });
      promises.push(preloadFonts());

      await Promise.all(promises);
    }

    loadAll();

    return () => {
      cancelled = true;
    };
  }, []);

  return { progress, isLoaded, errors, notifyShaderReady };
}
