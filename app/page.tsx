"use client";
import Map from "@/components/map";
import Hero from "@/components/hero";
import Quiz from "@/components/quiz";
import About from "@/components/about/about";
import CharacterSlider from "@/components/slider/character-slider";
import SpheresSection from "@/components/spheres/spheres-parent";
import { RippleImage } from "@/components/ripple-image";
import WavyImage from "@/components/slider/wavy-image";
import Preloader from "@/components/preloader";

export default function Home() {
  return (
    <>
      <Preloader />
      {/* <SpheresSection /> */}

      {/* <Hero />
      <About />
      <Map />
      <CharacterSlider />
      <Quiz /> */}
    </>
  );
}
