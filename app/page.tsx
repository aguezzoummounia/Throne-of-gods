import Map from "@/components/map";
import Quiz from "@/components/quiz";
import Hero from "@/components/hero/hero";
import About from "@/components/about/about";
import Footer from "@/components/global/footer";
import CharactersSection from "@/components/characters-section";
import HomeScrollContainer from "@/components/home-scroll-container";

export default function Home() {
  return (
    <>
      <HomeScrollContainer>
        <Hero />
        <About />
        <Map />
        <CharactersSection />
        <Quiz />
      </HomeScrollContainer>
      <Footer />
    </>
  );
}
