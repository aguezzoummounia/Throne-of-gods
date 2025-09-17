import Text from "../ui/text";

interface SliderTitlesProps {
  data: any[];
  selectedIndex: number;
}

const SliderTitles = ({ data, selectedIndex }: SliderTitlesProps) => {
  return (
    <div className="absolute md:bottom-[50%] bottom-[40px] left-[5vw] md:-translate-y-[-50%] z-10 pointer-events-none mix-blend-difference">
      <div className="flex overflow-hidden gap-x-1 max-md:text-xl max-md:font-normal max-md:flex-col max-md:items-start h-10">
        <div
          className="transition-transform duration-500 ease-in-out"
          style={{ transform: `translateY(-${selectedIndex * 40}px)` }}
        >
          {data.map((character) => (
            <Text
              as="h2"
              variant="lead"
              key={character.id}
              className="[text-shadow:0_2px_10px_rgba(0,0,0,0.5)] max-md:py-2 h-10 uppercase md:leading-[100%]"
            >
              {character.name}
            </Text>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SliderTitles;
