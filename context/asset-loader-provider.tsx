"use client";
import { SOUNDS_TO_PRELOAD } from "@/lib/consts";
import { useAssetLoader } from "@/hooks/useAssetLoader";
import PreloadedImageRegistry from "@/lib/preloaded-image-registry";
import {
  useState,
  useEffect,
  ReactNode,
  useContext,
  createContext,
  useMemo,
  useCallback,
} from "react";
interface PreloadContextType {
  isLoaded: boolean;
  progress: number;
  assets: {
    sounds: Record<string, HTMLAudioElement>;
  };
  errors: string[];
  hasInteracted: boolean;
  isImagePreloaded: (src: string) => boolean;
}

interface HookAssets {
  sounds: Record<string, HTMLAudioElement>; // Key is the file path (src)
}

// Define the output type for the assets to be provided by the context
interface RemappedAssets {
  sounds: Record<string, HTMLAudioElement>; // Key is the semantic id
}

// Create the context with a default value
const AssetLoaderContext = createContext<PreloadContextType | undefined>(
  undefined
);
const remapSoundAssets = (hookAssets: HookAssets): RemappedAssets => {
  const remappedSounds: Record<string, HTMLAudioElement> = {};

  // Loop through our original manifest (the source of truth)
  for (const soundManifest of SOUNDS_TO_PRELOAD) {
    const { id, src } = soundManifest;

    // Check if the preloaded assets from the hook contain this sound's source path
    const preloadedAudioElement = hookAssets.sounds[src];

    if (preloadedAudioElement) {
      // If it exists, add it to our new map using the clean 'id' as the key
      remappedSounds[id] = preloadedAudioElement;
    } else {
      // Optional: Log a warning if a sound from the manifest was not found in the preloaded assets.
      // This can help catch typos or issues where an asset was removed from the loader
      // but not from the manifest.
      console.warn(
        `[remapSoundAssets] Sound with id "${id}" and src "${src}" was not found in preloaded assets.`
      );
    }
  }

  // Return the newly structured object, ready for the context provider
  return {
    sounds: remappedSounds,
  };
};

// Create the Provider component
export const AssetLoaderProvider = ({ children }: { children: ReactNode }) => {
  const [hasInteracted, setHasInteracted] = useState(false);
  const { progress, errors, isLoaded, assets } = useAssetLoader();

  // Get the singleton instance of the image registry
  const imageRegistry = useMemo(() => PreloadedImageRegistry.getInstance(), []);

  // Memoize the interaction handler to prevent recreation
  const handleInteraction = useCallback(() => {
    setHasInteracted(true);
    if (process.env.NODE_ENV === "development") {
      console.log("[PreloadProvider] User has interacted for the first time.");
    }
  }, []);

  useEffect(() => {
    if (hasInteracted) return;

    const events: (keyof DocumentEventMap)[] = [
      "click",
      "keydown",
      "touchstart",
    ];

    // Add listeners that will only fire once
    events.forEach((event) => {
      document.addEventListener(event, handleInteraction, { once: true });
    });

    // Cleanup function to remove listeners if component unmounts before interaction
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleInteraction);
      });
    };
  }, [hasInteracted, handleInteraction]);

  // Memoize remapped assets to prevent unnecessary recalculations
  const remappedAssets = useMemo(() => remapSoundAssets(assets), [assets]);

  // Memoize the isImagePreloaded function
  const isImagePreloaded = useCallback(
    (src: string): boolean => {
      return imageRegistry.isPreloaded(src);
    },
    [imageRegistry]
  );

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      errors,
      isLoaded,
      progress,
      hasInteracted,
      assets: remappedAssets,
      isImagePreloaded,
    }),
    [
      errors,
      isLoaded,
      progress,
      hasInteracted,
      remappedAssets,
      isImagePreloaded,
    ]
  );

  return (
    <AssetLoaderContext.Provider value={contextValue}>
      {children}
    </AssetLoaderContext.Provider>
  );
};

export const usePreloader = () => {
  const context = useContext(AssetLoaderContext);
  if (!context) {
    throw new Error("usePreloader must be used within a PreloadProvider");
  }
  return context;
};
