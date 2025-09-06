import Image from "next/image";
import { cn } from "@/lib/utils";
import ElementsSvgOutline from "../elements-svg-outline";

interface AboutCardProps {
  title: string;
  image: string;
  className?: string;
}

const AboutCard = ({ title, image, className }: AboutCardProps) => {
  return (
    <div
      className={cn(
        "relative bg-[rgba(0,0,0,.05)] w-[400px] max-h-[250px] aspect-[16/10] rounded-[10px] overflow-hidden shadow-md group",
        className
      )}
    >
      <div className="absolute top-0 w-full h-full">
        <Image
          fill
          src={image}
          sizes="90vw"
          alt={`${title} image`}
          className="w-full h-full object-cover"
        />
      </div>

      <ElementsSvgOutline className="z-10 pointer-events-none group-hover:drop-shadow-[0_0_4px_rgba(244,234,143,0.5)]" />
    </div>
  );
};

export default AboutCard;
