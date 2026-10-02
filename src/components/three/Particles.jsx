import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Particles({ count = 200, mouse }) {
  const meshRef = useRef();

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const siz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      siz[i] = Math.random() * 2 + 0.5;
    }

    return [pos, siz];
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    meshRef.current.rotation.y = time * 0.02;
    meshRef.current.rotation.x = time * 0.01;

    // Subtle mouse parallax
    if (mouse) {
      meshRef.current.position.x = mouse.x * 0.3;
      meshRef.current.position.y = mouse.y * 0.2;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#FB923C"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
