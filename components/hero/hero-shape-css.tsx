import SmartImage from "../ui/smart-image";

const HeroShapeCSS = () => {
	return (
		<div className="w-full h-full flex items-center justify-center inset-0 absolute">
			<SmartImage
				fill
				alt="hero shape image"
				src="/images/static/hero-bg.png"
				className="aspect-square max-lg:w-[150vw] brightness-75 contrast-85 md:object-scale-down object-cover max-md:ml-0.5"
			/>
		</div>
	);
};

export default HeroShapeCSS;
