import "./globals.css";
import type { Metadata, Viewport } from "next";
import Preloader from "@/components/preloader";
import Header from "@/components/global/header";
import { SoundProvider } from "@/context/sound-context";
import { ViewTransitions } from "next-view-transitions";
import SvgOutline from "@/components/global/svg-outline";
import SmoothScroll from "@/components/global/smooth-scroll";
import GrainOverlay from "@/components/global/grain-overlay";
import CustomCursor from "@/components/global/custom-cursor";
import { BackgroundMusic } from "@/components/sound/background-music";
import { AssetLoaderProvider } from "@/context/asset-loader-provider";
import { Alegreya, Cinzel, Cinzel_Decorative } from "next/font/google";
import { SEOGenerator } from "@/lib/seo";

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-cinzel-decorative",
  weight: ["400", "700", "900"],
  subsets: ["latin"],
});
const alegreya = Alegreya({
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-alegreya",
  subsets: ["latin"],
});
const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

// SEO configuration for the homepage
const seoConfig = {
  title: "Throne of Gods - Discover Your Inner Villain",
  description:
    "Embark on a fantasy journey in Erosea. Take our quiz to find out which Throne of Gods villain matches your dark ambitions.",
  keywords: [
    "fantasy quiz",
    "personality test",
    "villain quiz",
    "fantasy characters",
    "throne of gods",
    "erosea",
    "interactive fiction",
    "character matching",
    "fantasy world",
    "dark fantasy",
  ],
  image: {
    url: "/images/og-homepage.png",
    width: 1200,
    height: 630,
    alt: "Throne of Gods - Fantasy Character Quiz",
  },
  mobileImage: {
    url: "/images/og-homepage-mobile.png",
    width: 800,
    height: 600,
    alt: "Throne of Gods - Fantasy Character Quiz",
  },
  url: "/",
  type: "website" as const,
};

// Generate site-wide metadata for the root layout
export const metadata: Metadata = SEOGenerator.generateMetadata(seoConfig);

// Generate viewport configuration separately (required by Next.js 14+)
export const viewport: Viewport = SEOGenerator.generateViewport(seoConfig);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en">
        <body
          className={`${alegreya.variable} ${cinzel.variable} ${cinzelDecorative.variable} antialiased`}
        >
          <AssetLoaderProvider>
            <SmoothScroll>
              <SoundProvider>
                <div className="min-h-screen overflow-clip relative">
                  <Preloader>
                    <Header />
                    <BackgroundMusic />
                    <main className="min-h-screen">{children}</main>
                  </Preloader>
                </div>
              </SoundProvider>
              <CustomCursor />
              <SvgOutline />
              <GrainOverlay />
              <div id="popup-portal"></div>
            </SmoothScroll>
          </AssetLoaderProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
