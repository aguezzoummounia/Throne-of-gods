import SmartImage from "../ui/smart-image";

const HeroShapeCSS = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <SmartImage
        width={500}
        height={500}
        alt="hero shape image"
        src="/images/static/hero-bg.png"
        className="w-[95%] aspect-square object-cover"
      />
    </div>
  );
};

export default HeroShapeCSS;
