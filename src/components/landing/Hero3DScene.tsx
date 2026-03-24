import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Float, Environment } from "@react-three/drei";
import * as THREE from "three";

const FloatingParticles = ({ count = 200 }: { count?: number }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
      new THREE.Color("#d4a017"),
      new THREE.Color("#6a9f5b"),
      new THREE.Color("#f5f0e8"),
    ];

    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = clock.getElapsedTime() * 0.02;
    pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.01) * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

/* ── Y2K Spinning Ring ── */
const SpinningRing = ({
  radius,
  tube,
  color,
  speed,
  position,
  axis,
}: {
  radius: number;
  tube: number;
  color: string;
  speed: number;
  position: [number, number, number];
  axis: "x" | "y" | "z";
}) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed;
    if (axis === "x") ref.current.rotation.x = t;
    else if (axis === "y") ref.current.rotation.y = t;
    else ref.current.rotation.z = t;
  });

  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[radius, tube, 16, 64]} />
      <meshPhysicalMaterial
        color={color}
        roughness={0.05}
        metalness={0.8}
        transparent
        opacity={0.25}
        wireframe
      />
    </mesh>
  );
};

/* ── Y2K Star Shape ── */
const Y2KStar = ({
  position,
  scale,
  color,
  speed,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
  speed: number;
}) => {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed;
    ref.current.rotation.z = t;
    ref.current.rotation.y = t * 0.5;
    ref.current.position.y = position[1] + Math.sin(t * 0.8) * 0.3;
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      {/* 4-point star made of two intersecting planes */}
      <mesh>
        <boxGeometry args={[0.08, 1.2, 0.08]} />
        <meshPhysicalMaterial color={color} metalness={0.9} roughness={0.1} transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.08, 1.2, 0.08]} />
        <meshPhysicalMaterial color={color} metalness={0.9} roughness={0.1} transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.08, 1.2, 0.08]} />
        <meshPhysicalMaterial color={color} metalness={0.9} roughness={0.1} transparent opacity={0.5} />
      </mesh>
      {/* Center sphere */}
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshPhysicalMaterial color={color} metalness={1} roughness={0} transparent opacity={0.6} />
      </mesh>
    </group>
  );
};

/* ── Y2K Floating Diamond ── */
const FloatingDiamond = ({
  position,
  scale,
  color,
  speed,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
  speed: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed;
    ref.current.rotation.y = t;
    ref.current.rotation.x = Math.sin(t * 0.5) * 0.3;
    ref.current.position.y = position[1] + Math.sin(t * 0.6) * 0.5;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <octahedronGeometry args={[1, 0]} />
      <meshPhysicalMaterial
        color={color}
        roughness={0.05}
        metalness={0.7}
        transmission={0.4}
        thickness={1}
        transparent
        opacity={0.35}
      />
    </mesh>
  );
};

const OrbitingSphere = ({ radius, speed, size, color, offset }: { radius: number; speed: number; size: number; color: string; offset: number }) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed + offset;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.y = Math.sin(t * 0.7) * radius * 0.4;
    ref.current.position.z = Math.sin(t) * radius;
  });

  return (
    <mesh ref={ref} scale={size}>
      <icosahedronGeometry args={[1, 3]} />
      <meshPhysicalMaterial
        color={color}
        roughness={0.1}
        metalness={0.3}
        transmission={0.6}
        thickness={1.5}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
};

const MainBlob = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.1;
    meshRef.current.rotation.y += delta * 0.15;
    meshRef.current.rotation.x += (pointer.y * 0.2 - meshRef.current.rotation.x) * 0.01;
    meshRef.current.rotation.y += (pointer.x * 0.2 - meshRef.current.rotation.y) * 0.01;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1.2}>
      <mesh ref={meshRef} scale={2.8}>
        <icosahedronGeometry args={[1, 8]} />
        <MeshDistortMaterial
          color="#1a4a2e"
          roughness={0.15}
          metalness={0.9}
          distort={0.4}
          speed={3}
          envMapIntensity={2}
        />
      </mesh>
    </Float>
  );
};

const Hero3DScene = () => {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#f5f0e8" />
        <pointLight position={[-4, 3, 4]} intensity={0.6} color="#d4a017" />
        <pointLight position={[4, -2, -3]} intensity={0.3} color="#4a7c3f" />

        {/* Main blob */}
        <MainBlob />

        {/* Particles */}
        <FloatingParticles count={200} />

        {/* Orbiting spheres */}
        <OrbitingSphere radius={4} speed={0.5} size={0.3} color="#d4a017" offset={0} />
        <OrbitingSphere radius={5} speed={0.35} size={0.2} color="#6a9f5b" offset={2} />
        <OrbitingSphere radius={3.5} speed={0.6} size={0.25} color="#c4985a" offset={4} />
        <OrbitingSphere radius={4.5} speed={0.4} size={0.15} color="#2d5a27" offset={5.5} />

        {/* Y2K Spinning Rings */}
        <SpinningRing radius={5} tube={0.03} color="#d4a017" speed={0.3} position={[0, 0, -2]} axis="x" />
        <SpinningRing radius={6} tube={0.02} color="#6a9f5b" speed={-0.2} position={[0, 0, -3]} axis="y" />
        <SpinningRing radius={4.5} tube={0.025} color="#c4985a" speed={0.15} position={[0, 0.5, -1]} axis="z" />

        {/* Y2K Stars */}
        <Y2KStar position={[-5, 3, -2]} scale={0.5} color="#d4a017" speed={0.8} />
        <Y2KStar position={[5.5, -2, -3]} scale={0.35} color="#f5f0e8" speed={0.6} />
        <Y2KStar position={[-4, -3.5, -1]} scale={0.4} color="#6a9f5b" speed={1.0} />
        <Y2KStar position={[4, 3.5, -4]} scale={0.3} color="#c4985a" speed={0.7} />

        {/* Y2K Floating Diamonds */}
        <FloatingDiamond position={[6, 1, -2]} scale={0.4} color="#d4a017" speed={0.5} />
        <FloatingDiamond position={[-6, -1.5, -3]} scale={0.3} color="#6a9f5b" speed={0.4} />
        <FloatingDiamond position={[3, -4, -2]} scale={0.25} color="#f5f0e8" speed={0.6} />

        <Environment preset="forest" />
      </Canvas>
    </div>
  );
};

export default Hero3DScene;
