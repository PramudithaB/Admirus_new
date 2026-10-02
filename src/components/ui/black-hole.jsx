import { useEffect, useRef } from "react";
import { createRenderer } from "./black-hole-utils/renderer";

/**
 * BlackHole — Full-screen WebGL2 gravitational lensing experience
 * - Schwarzschild-inspired lensing
 * - Accretion disk with temperature gradient + Doppler shift
 * - Relativistic jets
 * - Photon ring
 * - Nebula + star field
 * Mouse / touch responsive
 */
export function BlackHole() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = createRenderer({ canvas });
    void renderer.ready;

    return () => renderer.dispose();
  }, []);

  return (
    <div className="bh-root">
      <canvas ref={canvasRef} className="bh-canvas" aria-hidden="true" />
    </div>
  );
}

export default BlackHole;
