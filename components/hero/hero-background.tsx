import { memo } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import HeroSVGs from "../svgs/hero-svgs";
import type { DeviceCapabilityContextType } from "./hero-adaptive-shader";

interface HeroBackgroundProps {
	className?: string;
	deviceCapability?: DeviceCapabilityContextType;
}

const HeroBackground = memo<HeroBackgroundProps>(
	({ className, deviceCapability }) => {
		return (
			<div
				className={cn(
					"absolute inset-0 z-[-1] flex items-start justify-center mix-blend-difference",
					className,
				)}
			>
				<div className="absolute inset-0 flex items-center justify-center">
					<Image
						fill
						alt="hero img"
						src="/images/static/hero-bg.png"
						className="absolute object-scale-down z-10"
					/>
					<HeroSVGs className="w-[90%] md:w-[65vh]" />
				</div>
			</div>
		);
	},
);

HeroBackground.displayName = "HeroBackground";

export default HeroBackground;
