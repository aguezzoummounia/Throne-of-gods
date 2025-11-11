"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Location } from "@/lib/types";
import useEscape from "@/hooks/useEscape";
import { locationData } from "@/lib/data";
import LocationPing from "./location-ping";
import LocationCard from "./location-card";
import SmartImage from "../ui/smart-image";
import ScrollTrigger from "gsap/ScrollTrigger";
import { map_locations_positions } from "@/lib/consts";
import { useState, useRef, useMemo, useCallback, Fragment, memo } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Position = {
  item: string;
  card: string;
};

const MapCard: React.FC = () => {
  const pinsContainerRef = useRef<HTMLDivElement | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  useEscape(() => setSelectedIndex(null));

  const handlePingClick = useCallback((i: number) => {
    setSelectedIndex((prev) => (prev === i ? null : i)); // Toggle behavior
  }, []);

  const handlePingBlur = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const locations = useMemo(() => locationData as Location[], []);
  // commented for now for optimisation testing
  // useGSAP(
  //   () => {
  //     if (!pinsContainerRef.current) return;

  //     const tl = gsap.timeline({
  //       scrollTrigger: {
  //         trigger: pinsContainerRef.current,
  //         start: "top 80%",
  //         once: true, // Performance: animate only once
  //       },
  //     });

  //     const pins = gsap.utils.toArray(".location-ping");

  //     tl.from(pins, {
  //       y: 10,
  //       autoAlpha: 0,
  //       duration: 1.2,
  //       ease: "power2.out",
  //       stagger: {
  //         each: 0.1,
  //         from: "random",
  //       },
  //     });
  //   },
  //   {
  //     scope: pinsContainerRef,
  //     dependencies: [locations.length], // Re-run if locations change
  //   }
  // );

  return (
    <div className="w-full relative">
      <SmartImage
        width={1920}
        height={1080}
        sizes="100vw"
        alt="ereosa map"
        src="/images/map/ereosa-map.png"
        className="md:block hidden w-full h-auto"
      />
      <SmartImage
        width={1080}
        height={1920}
        sizes="100vw"
        alt="ereosa map"
        className="md:hidden block w-full h-auto"
        src="/images/map/ereosa-map-vertical.png"
      />
      <div className="absolute inset-0 z-10">
        <div ref={pinsContainerRef} className="relative w-full h-full">
          {locations.map((location, index) => {
            const position: Position =
              map_locations_positions[index] ??
              ({ item: "", card: "" } as Position);

            return (
              <Fragment key={`location-ping-${index}`}>
                <LocationPing
                  className={position.item}
                  handleBlur={handlePingBlur}
                  ariaLabel={`Open ${location.label}`}
                  ariaExpanded={selectedIndex === index}
                  ariaControls={`location-card-${index}`}
                  handleClick={() => handlePingClick(index)}
                />
                {selectedIndex === index && (
                  <LocationCard
                    type={index % 2 === 0 ? "new" : "default"}
                    label={location.label}
                    title={location.title}
                    image={location.image}
                    className={position.card}
                    details={location.details}
                  />
                )}
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default memo(MapCard);
