"use client";
import Map from "@/components/map";
import Hero from "@/components/hero";
import Quiz from "@/components/quiz";
import About from "@/components/about/about";
import CharacterSlider from "@/components/slider/character-slider";

export default function Home() {
  return (
    <>
      {/* <SpheresSection /> */}

      <Hero />
      <About />
      <Map />
      <CharacterSlider />
      <Quiz />
    </>
  );
}
