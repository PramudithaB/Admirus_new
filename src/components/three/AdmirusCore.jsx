import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function AdmirusCore({ mouse, scrollProgress }) {
  const groupRef = useRef();
  const torusRef = useRef();
  const innerRef = useRef();
  const nodesRef = useRef();
  const targetRotation = useRef({ x: 0, y: 0 });

  // Create particle positions for floating nodes
  const nodePositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 24; i++) {
      const theta = (i / 24) * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.2 + Math.random() * 0.8;
      positions.push([
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      ]);
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();

    // Mouse interaction
    targetRotation.current.x = mouse.y * 0.3;
    targetRotation.current.y = mouse.x * 0.5;

    groupRef.current.rotation.x +=
      (targetRotation.current.x - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.y +=
      (targetRotation.current.y - groupRef.current.rotation.y) * 0.05;

    // Scroll-based transformation
    const scroll = scrollProgress || 0;
    groupRef.current.position.z = -scroll * 3;
    groupRef.current.scale.setScalar(1 - scroll * 0.2);

    // Idle float
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.15;

    // Torus rotation
    if (torusRef.current) {
      torusRef.current.rotation.x = time * 0.15;
      torusRef.current.rotation.z = time * 0.1;
    }

    // Inner geometry rotation
    if (innerRef.current) {
      innerRef.current.rotation.y = -time * 0.2;
      innerRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
    }

    // Animate nodes
    if (nodesRef.current) {
      nodesRef.current.children.forEach((node, i) => {
        const offset = i * 0.3;
        node.position.y += Math.sin(time * 0.4 + offset) * 0.001;
        const s = 0.8 + Math.sin(time * 0.6 + offset) * 0.2;
        node.scale.setScalar(s);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ambient environment */}
      <ambientLight intensity={0.15} />

      {/* Key light */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        color="#ffffff"
      />

      {/* Accent purple rim light */}
      <pointLight
        position={[-4, 2, -3]}
        intensity={2}
        color="#F97316"
        distance={12}
      />

      {/* Cyan accent */}
      <pointLight
        position={[3, -2, 4]}
        intensity={1}
        color="#FACC15"
        distance={10}
      />

      {/* Main torus - outer ring */}
      <mesh ref={torusRef}>
        <torusGeometry args={[2, 0.02, 16, 100]} />
        <meshStandardMaterial
          color="#FB923C"
          emissive="#F97316"
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Second torus - slightly tilted */}
      <mesh rotation={[Math.PI / 3, 0, Math.PI / 6]}>
        <torusGeometry args={[1.6, 0.015, 16, 80]} />
        <meshStandardMaterial
          color="#FACC15"
          emissive="#FACC15"
          emissiveIntensity={0.2}
          metalness={0.8}
          roughness={0.3}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Inner icosahedron - glass-like */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshPhysicalMaterial
          color="#15151B"
          metalness={0.1}
          roughness={0.05}
          transmission={0.6}
          thickness={0.5}
          ior={1.5}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Core emissive sphere */}
      <mesh>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial
          color="#F97316"
          emissive="#F97316"
          emissiveIntensity={1.2}
          metalness={0.5}
          roughness={0.1}
        />
      </mesh>

      {/* Wireframe octahedron */}
      <mesh rotation={[0.4, 0.3, 0]}>
        <octahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial
          color="#FB923C"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Floating nodes */}
      <group ref={nodesRef}>
        {nodePositions.map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? '#F97316' : i % 3 === 1 ? '#FACC15' : '#FB923C'}
              emissive={i % 3 === 0 ? '#F97316' : i % 3 === 1 ? '#FACC15' : '#FB923C'}
              emissiveIntensity={0.8}
            />
          </mesh>
        ))}
      </group>

      {/* Thin connecting lines using wireframe */}
      <mesh>
        <dodecahedronGeometry args={[2.5, 0]} />
        <meshStandardMaterial
          color="#FB923C"
          wireframe
          transparent
          opacity={0.04}
        />
      </mesh>
    </group>
  );
}
