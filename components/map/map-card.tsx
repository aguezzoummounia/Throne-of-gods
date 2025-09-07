"use client";
import gsap from "gsap";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { Location } from "@/lib/types";
import { locationData } from "@/lib/data";
import LocationPing from "./location-ping";
import LocationCard from "./location-card";
import ScrollTrigger from "gsap/ScrollTrigger";
import { map_locations_positions } from "@/lib/consts";
import { useState, useRef, useMemo, useCallback, Fragment } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Position = {
  item: string;
  card: string;
};

const MapCard: React.FC = () => {
  const pinsContainerRef = useRef<HTMLDivElement | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handlePingClick = useCallback((i: number) => {
    setSelectedIndex(i);
  }, []);

  const handlePingBlur = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const locations = useMemo(() => locationData as Location[], []);

  useGSAP(
    () => {
      if (!pinsContainerRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinsContainerRef.current,
          start: "top 80%",
        },
      });

      const pins = gsap.utils.toArray(".location-ping");

      tl.from(pins, {
        y: 10,
        autoAlpha: 0,
        duration: 1.2,
        ease: "power2.out",
        stagger: {
          each: 0.1,
          from: "start",
        },
      });

      return () => {
        tl.kill();
      };
    },
    {
      scope: pinsContainerRef, // scope selectors to the container
    }
  );

  return (
    <div className="w-full md:aspect-video aspect-[9/16]">
      <div className="relative w-full h-full">
        <Image
          fill
          sizes="100vw"
          alt="ereosa map"
          src="/images/map/ereosa-map.avif"
          className="md:block hidden object-cover"
        />
        <Image
          fill
          sizes="100vw"
          alt="ereosa map"
          className="md:hidden block object-cover"
          src="/images/map/ereosa-map-vertical.avif"
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
    </div>
  );
};

export default MapCard;
