"use client";
import { assets_to_load as defaultAssets } from "@/lib/consts";
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

  // Use a ref to track loaded items to avoid re-renders on every load
  const loadedItemsRef = useRef<Set<string>>(new Set());
  const totalItems = useRef(assets_to_load.length);

  const handleItemLoaded = useCallback((itemName: string) => {
    const normalized = String(itemName);
    if (loadedItemsRef.current.has(normalized)) return;
    loadedItemsRef.current.add(normalized);
    const loadedCount = loadedItemsRef.current.size;
    const newProgress =
      totalItems.current > 0
        ? Math.floor((loadedCount / totalItems.current) * 100)
        : 100;
    setProgress(newProgress);
    if (loadedCount >= totalItems.current) {
      setTimeout(() => setIsLoaded(true), 200);
    }
  }, []);

  const handleItemError = useCallback(
    (itemName: string) => {
      setErrors((p) => [...p, String(itemName)]);
      handleItemLoaded(itemName);
    },
    [handleItemLoaded]
  );

  const notifyItemLoaded = useCallback(
    (itemName: string) => {
      console.log(`[AssetLoader] RECEIVED notification for: ${itemName}`);
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
                if (!cancelled) handleItemLoaded(asset);
                resolve();
              };
              img.onerror = () => {
                if (!cancelled) handleItemError(asset);
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
        // console.log("Assets processed. Sound map is ready.");
      }
    }

    preloadDomAssets();

    return () => {
      cancelled = true;
    };
  }, [handleItemError, handleItemLoaded, assets_to_load]);

  return { progress, assets, isLoaded, errors, notifyItemLoaded };
}
