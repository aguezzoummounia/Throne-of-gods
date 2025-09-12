"use client";
import Map from "@/components/map";
import Quiz from "@/components/quiz";
import Hero from "@/components/hero/hero";
import About from "@/components/about/about";
import CharacterSlider from "@/components/slider/character-slider";
import HomeScrollContainer from "@/components/home-scroll-container";
import Footer from "@/components/global/footer";
// import ShaderCanvas from "@/components/test-shape";

export default function Home() {
  return (
    <>
      {/* <div className="w-full h-[10000px]"></div> */}
      {/* <SpheresSection /> */}
      <HomeScrollContainer>
        <Hero />
        <About />
        <Map />
        <CharacterSlider />
        <Quiz />
      </HomeScrollContainer>
      <Footer />
    </>
  );
}
