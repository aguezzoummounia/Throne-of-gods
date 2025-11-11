"use client";
import { assets_to_load as defaultAssets } from "@/lib/consts";
import PreloadedImageRegistry from "@/lib/preloaded-image-registry";
import { useEffect, useRef, useState, useCallback } from "react";

interface PreloadedAssets {
  sounds: Record<string, HTMLAudioElement>;
}

interface UsePreloaderResult {
  errors: string[];
  progress: number;
  isLoaded: boolean;
  assets: PreloadedAssets;
  notifyItemLoaded: (itemName: string) => void;
}

export function useAssetLoader(
  assets_to_load: string[] = defaultAssets
): UsePreloaderResult {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [assets, setAssets] = useState<PreloadedAssets>({ sounds: {} });

  // Use refs to track state without causing re-renders
  const loadedItemsRef = useRef<Set<string>>(new Set());
  const totalItems = useRef(assets_to_load.length);
  const progressUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Throttled progress updates to reduce re-renders
  const updateProgress = useCallback((newProgress: number) => {
    if (progressUpdateTimeoutRef.current) {
      clearTimeout(progressUpdateTimeoutRef.current);
    }

    progressUpdateTimeoutRef.current = setTimeout(() => {
      setProgress(newProgress);
    }, 16); // ~60fps throttling
  }, []);

  const handleItemLoaded = useCallback(
    (itemName: string) => {
      const normalized = String(itemName);
      if (loadedItemsRef.current.has(normalized)) return;

      loadedItemsRef.current.add(normalized);
      const loadedCount = loadedItemsRef.current.size;
      const newProgress =
        totalItems.current > 0
          ? Math.floor((loadedCount / totalItems.current) * 100)
          : 100;

      updateProgress(newProgress);

      if (loadedCount >= totalItems.current) {
        // Small delay to ensure smooth completion animation
        setTimeout(() => setIsLoaded(true), 200);
      }
    },
    [updateProgress]
  );

  const handleItemError = useCallback(
    (itemName: string) => {
      setErrors((prev) => {
        const normalized = String(itemName);
        return prev.includes(normalized) ? prev : [...prev, normalized];
      });
      handleItemLoaded(itemName);
    },
    [handleItemLoaded]
  );

  const notifyItemLoaded = useCallback(
    (itemName: string) => {
      if (process.env.NODE_ENV === "development") {
        console.log(`[AssetLoader] RECEIVED notification for: ${itemName}`);
      }
      handleItemLoaded(itemName);
    },
    [handleItemLoaded]
  );

  useEffect(() => {
    let cancelled = false;

    async function preloadDomAssets() {
      const soundMap: Record<string, HTMLAudioElement> = {};
      const promises: Promise<void>[] = [];

      const isTextureOrShader = (a: string) =>
        a.startsWith("texture:") || a.startsWith("shader:");

      assets_to_load.forEach((asset) => {
        if (isTextureOrShader(asset)) {
          // these will be fulfilled by external notify calls via assetBus
          return;
        }
        const url = asset.startsWith("/") ? asset : `/${asset}`;
        if (/\.(png|jpe?g|gif|webp|avif)$/i.test(url)) {
          promises.push(
            new Promise((resolve) => {
              const img = new Image();
              img.onload = () => {
                if (!cancelled) {
                  try {
                    // Register the successfully loaded image in the registry
                    const registry = PreloadedImageRegistry.getInstance();
                    registry.registerPreloadedImage(url);
                    handleItemLoaded(asset);
                  } catch (error) {
                    // If registry registration fails, still mark as loaded to prevent hanging
                    console.warn(
                      `Failed to register preloaded image ${url}:`,
                      error
                    );
                    handleItemLoaded(asset);
                  }
                }
                resolve();
              };
              img.onerror = () => {
                if (!cancelled) {
                  // Don't register failed images to prevent registry corruption
                  handleItemError(asset);
                }
                resolve();
              };
              img.src = url;
            })
          );
          return;
        }

        if (/\.(mp3|ogg|wav)$/i.test(url)) {
          promises.push(
            new Promise((resolve) => {
              const audio = new Audio();
              audio.src = url;
              audio.preload = "auto";
              audio.oncanplaythrough = () => {
                if (!cancelled) {
                  // Store the loaded audio object in our temporary map
                  soundMap[asset] = audio;
                  handleItemLoaded(asset);
                }
                resolve();
              };
              audio.onerror = () => {
                if (!cancelled) handleItemError(asset);
                resolve();
              };
              audio.load();
            })
          );
          return;
        }

        if (asset === "fonts") {
          promises.push(
            document.fonts.ready
              .then(() => {
                if (!cancelled) handleItemLoaded(asset);
              })
              .catch(() => {
                if (!cancelled) handleItemError(asset);
              })
          );
          return;
        }

        // Fallback: mark as error (so loader won't hang)
        console.warn("AssetLoader: Unhandled asset type", asset);
        handleItemError(asset);
      });

      await Promise.all(promises);

      if (!cancelled) {
        setAssets({ sounds: soundMap });
      }
    }

    preloadDomAssets();

    return () => {
      cancelled = true;
      if (progressUpdateTimeoutRef.current) {
        clearTimeout(progressUpdateTimeoutRef.current);
      }
    };
  }, [handleItemError, handleItemLoaded, assets_to_load]);

  return { progress, assets, isLoaded, errors, notifyItemLoaded };
}
