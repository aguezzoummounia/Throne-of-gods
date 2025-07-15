import Hero from "@/components/hero";
import Slider from "@/components/slider";
import Newsletter from "@/components/newsletter";
interface Slide {
  id: number;
  image: string;
  title: string;
}

const SLIDES_DATA: Slide[] = [
  {
    id: 1,
    image: "https://picsum.photos/id/10/1600/900",
    title: "Forest Path",
  },
  {
    id: 2,
    image: "https://picsum.photos/id/20/1600/900",
    title: "Mountain View",
  },
  {
    id: 3,
    image: "https://picsum.photos/id/30/1600/900",
    title: "City at Night",
  },
  {
    id: 4,
    image: "https://picsum.photos/id/40/1600/900",
    title: "Desert Dunes",
  },
  {
    id: 5,
    image: "https://picsum.photos/id/50/1600/900",
    title: "Ocean Waves",
  },
  { id: 6, image: "https://picsum.photos/id/60/1600/900", title: "Icy Peaks" },
];

export default function Home() {
  return (
    <>
      {/* <Hero /> */}
      <Slider slides={SLIDES_DATA} />
      <Newsletter />
    </>
  );
}
// header
// hero with teaser and title and CTA to watch the full trailer
// about the story gsap animated text with images
// characters slider
// contact
// footer
// 🏠 1. Homepage

// Design Feel: Dark, epic, atmospheric – ancient ruins, celestial imagery, flickers of lightning

// Content:

// Hero Section:

//     Title: THRONE OF GODS

//     Tagline: When the gods fall, who will rise?

//     CTA Buttons:
//     🔥 Watch the Series
//     📖 Read the Prologue

// Background Visual: A looping animation or static image of a storm over a broken throne in a forgotten temple.

// Intro Text:

//     Erosea lies in ruin. The gods are silent. But prophecy whispers of a fallen heir returned from death… Kaen. Cursed bloodlines, ancient powers, and divine secrets collide in THRONE OF GODS, a dark fantasy epic where gods are not what they seem, and the dead don't stay buried.

// Video Embed (Trailer or Teaser):
// Embed your first teaser or trailer for the YouTube series.
// 📜 2. The Story

// Sections:

//     The Age of Divine Unity

//         A time when the Goddess Law upheld balance across the fractured empires…

//     The War of the Deep

//         The rise of the monstrous King and Queen of the Deep – and the death of a goddess.

//     The Prophecy

//         A forgotten verse buried beneath time, whispering of the lightning reborn.

// Design: Ancient scroll or parchment style, with animations (e.g., glowing text as the user scrolls).
// 👑 3. Characters

// Kaen – The Lightning Heir

//     Betrayed, murdered, reborn. The true son of the Galeerian Empire returns, cloaked in shadow and storm.

// Leticia – The Empress of Knives

//     Kaen's stepmother and political mastermind. Ruthless and regal.

// Agon – The Prince of Thorns

//     Arrogant, entitled, and dangerously ambitious.

// Reynold – The Cursed Noble

//     Son of the Duke of Castle Berry. His blood holds a terrible secret.

// Lucindra Thalakar – The Star-Eyed Princess

//     Graceful, mysterious, and far more dangerous than she seems.

// Optional:

//     Include side factions or races (e.g., Order of Black Flame, Deep Dwellers, Priests of Moon Ash)

// 📺 4. Episodes

// Title: Watch the Series

// Each episode can be displayed like:

//     Episode 1 – The Lightning Reborn

//         Kaen awakens in a tomb of storm, hunted by shadows from his past.
//         (Watch on YouTube)

// You can embed a YouTube playlist and expand episodes as more are released.
// 📚 5. Read the Book

// If you're publishing it online or selling it:

//     Excerpt: First few paragraphs of the prologue

//     Download Link / Amazon Link

//     Reviews Section: Add testimonials from readers (even early fans or beta readers)

// 🗺️ 6. Lore & Worldbuilding (Optional but Valuable)

// Title: The Lore Vault or The Codex of Erosea

// Sections:

//     The Three Empires

//     The Gods and the Deep

//     Timeline of the Divine Fall

//     Artifacts and Magic

//     The Blood Curse

// Great for deep fans and SEO traffic.
// 🧙‍♂️ 7. Behind the Scenes / Blog

//     Making of the show

//     Casting / Voice acting

//     Concept art

//     Progress updates

// 💌 8. Newsletter Signup

// Title: Join the Watchers of the Storm

// Text:

//     Be the first to hear about new episodes, exclusive art, and prophecy updates. No spam. Only shadows.

// 📞 9. Contact Page

//     Simple contact form

//     Links to social platforms

//     Possibly: “Want to collaborate?” or “Submit Fan Art”
