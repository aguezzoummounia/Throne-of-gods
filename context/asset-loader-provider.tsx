"use client";

import { useAssetLoader } from "@/hooks/useAssetLoader";
import { createContext, useContext, ReactNode } from "react";

interface AssetLoaderContextType {
  errors: string[];
  progress: number;
  isLoaded: boolean;
  notifyItemLoaded: (itemName: string) => void;
}

// Create the context with a default value
const AssetLoaderContext = createContext<AssetLoaderContextType | undefined>(
  undefined
);

// Create a custom hook for easy consumption
export const useAssetLoaderContext = () => {
  const context = useContext(AssetLoaderContext);
  if (!context) {
    throw new Error(
      "useAssetLoaderContext must be used within an AssetLoaderProvider"
    );
  }
  return context;
};

// Create the Provider component
export const AssetLoaderProvider = ({ children }: { children: ReactNode }) => {
  const assetLoaderState = useAssetLoader();

  return (
    <AssetLoaderContext.Provider value={assetLoaderState}>
      {children}
    </AssetLoaderContext.Provider>
  );
};
