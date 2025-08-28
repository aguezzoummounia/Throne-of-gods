import MapCard from "./map/map-card";
import Container from "./global/container";

const Map: React.FC = () => {
  return (
    <Container
      as="section"
      className="min-h-screen px-0 max-md:px-0 grid md:gap-10 gap-6  bg-red-950"
    >
      <div className="grid gap-8 mx-10 bg-green-950">
        <h2 className="">
          Here lies the scarred land—shaped by gods, split by emperors, and
          haunted by the echoes of what should have stayed buried. Every name
          carved on this map carries blood, ruin, or prophecy. And though the
          divine are gone, their shadow lingers in every ruin and restless star
          above.
        </h2>
        <h2>
          1. Mysterious / Prophetic: They say the world cracked in three—but it
          never healed. Look closely. The threads of fate are stitched through
          every valley, every ruin, every empire clinging to memory. 2. Ominous
          / Foreboding: This is no mere map. It is a ledger of sins, a memory of
          divine wrath, and a warning etched in soil and stone. Step
          lightly—Erosea remembers. 3. Grand / Lore-Heavy: Once ruled by gods
          and giants of men, Erosea became a crucible for ambition and
          annihilation. What remains is a land cursed with memory—and marked by
          prophecy yet to be fulfilled.
        </h2>
      </div>

      <MapCard />
    </Container>
  );
};

export default Map;
