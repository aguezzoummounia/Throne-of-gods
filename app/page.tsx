import Map from "@/components/map";
import Quiz from "@/components/quiz";
import Hero from "@/components/hero/hero";
import About from "@/components/about/about";
import Footer from "@/components/global/footer";
import CharactersSection from "@/components/characters-section";

export default function Home() {
  return (
    <>
      <Hero />
      {/* <About /> */}
      {/* <CharactersSection /> */}
      <Map />
      <Quiz />
      <Footer />
    </>
  );
}
