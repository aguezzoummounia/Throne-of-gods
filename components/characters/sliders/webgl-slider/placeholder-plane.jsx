import * as THREE from "three";

const PlaceholderPlane = ({ width, height }) => (
  <mesh>
    <planeGeometry args={[width, height]} />
    <meshBasicMaterial color="#181c1f" side={THREE.DoubleSide} />
  </mesh>
);

export default PlaceholderPlane;
