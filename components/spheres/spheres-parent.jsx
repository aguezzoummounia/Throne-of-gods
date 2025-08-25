import { Suspense } from "react";
import { SunSphere } from "./sun-sphere";
import { Canvas } from "@react-three/fiber";
import Container from "../global/container";
import { SmokySphere } from "./smoke-sphere";
import { WaterSphere } from "./water-sphere";
import { BlendFunction } from "postprocessing";
import { EnergySphere } from "./lightning-sphere";
import { OrbitControls } from "@react-three/drei";
import { RealisticWaterSphere } from "./water-v2-sphere";
import {
  EffectComposer,
  Bloom,
  ToneMapping,
  ChromaticAberration,
} from "@react-three/postprocessing";

const SpheresSection = () => {
  return (
    <Container
      as="section"
      className="w-full h-svh relative bg-transparent p-0 md:p-0"
    >
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <EnergySphere />
          {/* <SmokySphere /> */}
          {/* <WaterSphere /> */}
          {/* <SunSphere /> */}
          {/* <RealisticWaterSphere /> */}

          <OrbitControls
            enableZoom={true}
            autoRotate
            autoRotateSpeed={0.3}
            minDistance={3}
            maxDistance={15}
            enablePan={false}
          />

          <EffectComposer>
            <Bloom
              intensity={0.5}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.5}
              mipmapBlur={true}
            />
            <ToneMapping
              blendFunction={BlendFunction.NORMAL}
              adaptive={true}
              resolution={256}
              middleGrey={0.6}
              maxLuminance={16.0}
              averageLuminance={1.0}
              adaptationRate={1.0}
            />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={[0.001, 0.001]}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
      <div className="absolute bottom-4 left-4 p-6 rounded-xl text-white text-xs font-mono select-none bg-red-950">
        Drag to rotate. Scroll to zoom.
      </div>
    </Container>
  );
};

export default SpheresSection;
