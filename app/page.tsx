import Map from "@/components/map";
import Quiz from "@/components/quiz";
import Hero from "@/components/hero/hero";
import About from "@/components/about/about";
import CharacterSlider from "@/components/slider/character-slider";
// import ShaderCanvas from "@/components/test-shape";

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
