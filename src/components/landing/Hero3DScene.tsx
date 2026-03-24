import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Float, Environment } from "@react-three/drei";
import * as THREE from "three";

const FloatingParticles = ({ count = 200 }: { count?: number }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
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

      sizes[i] = 0.03 + Math.random() * 0.04;
    }
    return { positions, colors, sizes };
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
        <MainBlob />
        <FloatingParticles count={200} />
        <OrbitingSphere radius={4} speed={0.5} size={0.3} color="#d4a017" offset={0} />
        <OrbitingSphere radius={5} speed={0.35} size={0.2} color="#6a9f5b" offset={2} />
        <OrbitingSphere radius={3.5} speed={0.6} size={0.25} color="#c4985a" offset={4} />
        <OrbitingSphere radius={4.5} speed={0.4} size={0.15} color="#2d5a27" offset={5.5} />
        <Environment preset="forest" />
      </Canvas>
    </div>
  );
};

export default Hero3DScene;
