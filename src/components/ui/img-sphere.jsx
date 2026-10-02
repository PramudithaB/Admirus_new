import { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

// ── Math helpers ──────────────────────────────────────────────────────────────
const SPHERE_MATH = {
  degreesToRadians: (deg) => deg * (Math.PI / 180),
  normalizeAngle: (angle) => {
    while (angle >  180) angle -= 360;
    while (angle < -180) angle += 360;
    return angle;
  },
};

// ── Default Admirus portfolio images (Unsplash) ───────────────────────────────
const BASE_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&fit=crop', alt: 'Creative Direction', title: 'Creative Direction', description: 'Bold creative direction for iconic brands.' },
  { src: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80&fit=crop', alt: 'UI/UX Design',        title: 'UI/UX Design',       description: 'Pixel-perfect interfaces that convert.' },
  { src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80&fit=crop', alt: 'Brand Identity',   title: 'Brand Identity',    description: 'Visual identities built to last.' },
  { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80&fit=crop', alt: 'Web Platform',     title: 'Web Platform',      description: 'High-performance web experiences.' },
  { src: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&q=80&fit=crop', alt: 'Mobile UX',         title: 'Mobile UX',         description: 'Seamless mobile-first design.' },
  { src: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&q=80&fit=crop', alt: 'Digital Engineering', title: 'Digital Engineering', description: 'Code that scales with ambition.' },
  { src: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?w=400&q=80&fit=crop', alt: 'Content Studio',    title: 'Content Studio',    description: 'Stories that captivate every scroll.' },
  { src: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&q=80&fit=crop', alt: 'Event Production', title: 'Event Production',  description: 'Immersive events that leave impressions.' },
  { src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80&fit=crop', alt: 'Branding',          title: 'Branding',          description: 'Strategy-driven brand building.' },
  { src: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80&fit=crop', alt: 'Social Campaign', title: 'Social Campaign',   description: 'Campaigns impossible to ignore.' },
  { src: 'https://images.unsplash.com/photo-1493119508027-2b584f234d6c?w=400&q=80&fit=crop', alt: 'Photography',     title: 'Photography',       description: 'Visual narratives that resonate.' },
  { src: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=400&q=80&fit=crop', alt: 'Aerial Drone',    title: 'Aerial Drone',      description: 'Breathtaking aerial production.' },
];

// Expand to 60 images for full sphere coverage
const DEFAULT_IMAGES = Array.from({ length: 60 }, (_, i) => ({
  id: `img-${i + 1}`,
  ...BASE_IMAGES[i % BASE_IMAGES.length],
  alt: `${BASE_IMAGES[i % BASE_IMAGES.length].alt} ${Math.floor(i / BASE_IMAGES.length) + 1}`,
}));

// ── Main component ────────────────────────────────────────────────────────────
export default function SphereImageGrid({
  images = DEFAULT_IMAGES,
  containerSize = 580,
  sphereRadius = 220,
  dragSensitivity = 0.6,
  momentumDecay = 0.96,
  maxRotationSpeed = 5,
  baseImageScale = 0.12,
  perspective = 1000,
  autoRotate = true,
  autoRotateSpeed = 0.25,
  className = '',
}) {
  const [isMounted,     setIsMounted]     = useState(false);
  const [rotation,      setRotation]      = useState({ x: 15, y: 15, z: 0 });
  const [velocity,      setVelocity]      = useState({ x: 0, y: 0 });
  const [isDragging,    setIsDragging]    = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePositions, setImagePositions] = useState([]);
  const [hoveredIndex,  setHoveredIndex]  = useState(null);

  const containerRef    = useRef(null);
  const lastMousePos    = useRef({ x: 0, y: 0 });
  const animationFrame  = useRef(null);

  const actualRadius  = sphereRadius || containerSize * 0.5;
  const baseImageSize = containerSize * baseImageScale;

  // ── Fibonacci sphere distribution ─────────────────────────────────────────
  const generatePositions = useCallback(() => {
    const goldenRatio     = (1 + Math.sqrt(5)) / 2;
    const angleIncrement  = 2 * Math.PI / goldenRatio;
    const count           = images.length;

    return Array.from({ length: count }, (_, i) => {
      const t           = i / count;
      const inclination = Math.acos(1 - 2 * t);
      const azimuth     = angleIncrement * i;

      let phi   = inclination * (180 / Math.PI);
      let theta = (azimuth     * (180 / Math.PI)) % 360;

      const poleBonus = Math.pow(Math.abs(phi - 90) / 90, 0.6) * 35;
      phi = phi < 90
        ? Math.max(5,   phi - poleBonus)
        : Math.min(175, phi + poleBonus);

      phi   = 15 + (phi / 180) * 150;
      theta = (theta + (Math.random() - 0.5) * 20) % 360;
      phi   = Math.max(0, Math.min(180, phi + (Math.random() - 0.5) * 10));

      return { theta, phi, radius: actualRadius };
    });
  }, [images.length, actualRadius]);

  // ── 3D → screen projection ────────────────────────────────────────────────
  const calculateWorldPositions = useCallback(() => {
    const rotXRad = SPHERE_MATH.degreesToRadians(rotation.x);
    const rotYRad = SPHERE_MATH.degreesToRadians(rotation.y);

    const raw = imagePositions.map((pos, index) => {
      const tR = SPHERE_MATH.degreesToRadians(pos.theta);
      const pR = SPHERE_MATH.degreesToRadians(pos.phi);

      let x = pos.radius * Math.sin(pR) * Math.cos(tR);
      let y = pos.radius * Math.cos(pR);
      let z = pos.radius * Math.sin(pR) * Math.sin(tR);

      // Y-axis rotation
      const x1 =  x * Math.cos(rotYRad) + z * Math.sin(rotYRad);
      const z1 = -x * Math.sin(rotYRad) + z * Math.cos(rotYRad);
      x = x1; z = z1;

      // X-axis rotation
      const y2 = y * Math.cos(rotXRad) - z * Math.sin(rotXRad);
      const z2 = y * Math.sin(rotXRad) + z * Math.cos(rotXRad);
      y = y2; z = z2;

      const isVisible  = z > -30;
      const fadeOpacity = z <= -10
        ? Math.max(0, (z - (-30)) / (-10 - (-30)))
        : 1;

      const distFromCenter  = Math.sqrt(x * x + y * y);
      const distRatio       = Math.min(distFromCenter / actualRadius, 1);
      const isPole          = pos.phi < 30 || pos.phi > 150;
      const centerScale     = Math.max(0.3, 1 - distRatio * (isPole ? 0.4 : 0.7));
      const depthScale      = (z + actualRadius) / (2 * actualRadius);
      const scale           = centerScale * Math.max(0.5, 0.8 + depthScale * 0.3);

      return { x, y, z, scale, zIndex: Math.round(1000 + z), isVisible, fadeOpacity, originalIndex: index };
    });

    // Collision detection
    return raw.map((pos, i) => {
      if (!pos.isVisible) return pos;
      let adjScale = pos.scale;
      const size = baseImageSize * adjScale;

      raw.forEach((other, j) => {
        if (i === j || !other.isVisible) return;
        const otherSize = baseImageSize * other.scale;
        const dx   = pos.x - other.x;
        const dy   = pos.y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minD = (size + otherSize) / 2 + 25;

        if (dist < minD && dist > 0) {
          const overlap = minD - dist;
          adjScale = Math.min(adjScale, adjScale * Math.max(0.4, 1 - (overlap / minD) * 0.6));
        }
      });

      return { ...pos, scale: Math.max(0.25, adjScale) };
    });
  }, [imagePositions, rotation, actualRadius, baseImageSize]);

  const clamp = useCallback(
    (v) => Math.max(-maxRotationSpeed, Math.min(maxRotationSpeed, v)),
    [maxRotationSpeed]
  );

  // ── Momentum / auto-rotation loop ────────────────────────────────────────
  const updateMomentum = useCallback(() => {
    if (isDragging) return;

    setVelocity(prev => {
      const next = { x: prev.x * momentumDecay, y: prev.y * momentumDecay };
      if (!autoRotate && Math.abs(next.x) < 0.01 && Math.abs(next.y) < 0.01)
        return { x: 0, y: 0 };
      return next;
    });

    setRotation(prev => ({
      x: SPHERE_MATH.normalizeAngle(prev.x + clamp(velocity.x)),
      y: SPHERE_MATH.normalizeAngle(prev.y + clamp(velocity.y) + (autoRotate ? autoRotateSpeed : 0)),
      z: prev.z,
    }));
  }, [isDragging, momentumDecay, velocity, clamp, autoRotate, autoRotateSpeed]);

  // ── Mouse handlers ────────────────────────────────────────────────────────
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
    setVelocity({ x: 0, y: 0 });
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    const delta = { x: -dy * dragSensitivity, y: dx * dragSensitivity };

    setRotation(prev => ({
      x: SPHERE_MATH.normalizeAngle(prev.x + clamp(delta.x)),
      y: SPHERE_MATH.normalizeAngle(prev.y + clamp(delta.y)),
      z: prev.z,
    }));
    setVelocity({ x: clamp(delta.x), y: clamp(delta.y) });
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  }, [isDragging, dragSensitivity, clamp]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  // ── Touch handlers ────────────────────────────────────────────────────────
  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    const t = e.touches[0];
    setIsDragging(true);
    setVelocity({ x: 0, y: 0 });
    lastMousePos.current = { x: t.clientX, y: t.clientY };
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();
    const t  = e.touches[0];
    const dx = t.clientX - lastMousePos.current.x;
    const dy = t.clientY - lastMousePos.current.y;
    const delta = { x: -dy * dragSensitivity, y: dx * dragSensitivity };

    setRotation(prev => ({
      x: SPHERE_MATH.normalizeAngle(prev.x + clamp(delta.x)),
      y: SPHERE_MATH.normalizeAngle(prev.y + clamp(delta.y)),
      z: prev.z,
    }));
    setVelocity({ x: clamp(delta.x), y: clamp(delta.y) });
    lastMousePos.current = { x: t.clientX, y: t.clientY };
  }, [isDragging, dragSensitivity, clamp]);

  const handleTouchEnd = useCallback(() => setIsDragging(false), []);

  // ── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => { setIsMounted(true); }, []);
  useEffect(() => { setImagePositions(generatePositions()); }, [generatePositions]);

  useEffect(() => {
    if (!isMounted) return;
    const animate = () => {
      updateMomentum();
      animationFrame.current = requestAnimationFrame(animate);
    };
    animationFrame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame.current);
  }, [isMounted, updateMomentum]);

  useEffect(() => {
    if (!isMounted) return;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup',   handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend',  handleTouchEnd);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup',   handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend',  handleTouchEnd);
    };
  }, [isMounted, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const worldPositions = calculateWorldPositions();

  // ── Render helpers ────────────────────────────────────────────────────────
  const renderNode = useCallback((image, index) => {
    const pos = worldPositions[index];
    if (!pos || !pos.isVisible) return null;

    const size       = baseImageSize * pos.scale;
    const isHovered  = hoveredIndex === index;
    const finalScale = isHovered ? Math.min(1.2, 1.2 / pos.scale) : 1;

    return (
      <div
        key={image.id}
        style={{
          position:  'absolute',
          width:     size,
          height:    size,
          left:      containerSize / 2 + pos.x,
          top:       containerSize / 2 + pos.y,
          opacity:   pos.fadeOpacity,
          transform: `translate(-50%, -50%) scale(${finalScale})`,
          zIndex:    pos.zIndex,
          cursor:    'pointer',
          userSelect: 'none',
          transition: 'transform 200ms ease-out',
        }}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
        onClick={() => setSelectedImage(image)}
      >
        <div style={{
          position:     'relative',
          width:        '100%',
          height:       '100%',
          borderRadius: '50%',
          overflow:     'hidden',
          boxShadow:    '0 8px 24px rgba(0,0,0,0.4)',
          border:       '2px solid rgba(249,115,22,0.25)',
        }}>
          <img
            src={image.src}
            alt={image.alt}
            draggable={false}
            loading={index < 6 ? 'eager' : 'lazy'}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      </div>
    );
  }, [worldPositions, baseImageSize, containerSize, hoveredIndex]);

  const renderModal = () => {
    if (!selectedImage) return null;
    return (
      <div
        onClick={() => setSelectedImage(null)}
        style={{
          position:        'fixed',
          inset:            0,
          zIndex:           9999,
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          padding:          16,
          background:      'rgba(0,0,0,0.75)',
          backdropFilter:  'blur(6px)',
          animation:       'sphereFadeIn 0.25s ease-out',
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background:    '#111',
            borderRadius:   16,
            maxWidth:       420,
            width:          '100%',
            overflow:       'hidden',
            border:        '1px solid rgba(249,115,22,0.2)',
            boxShadow:     '0 32px 80px rgba(0,0,0,0.6)',
            animation:     'sphereScaleIn 0.25s ease-out',
          }}
        >
          <div style={{ position: 'relative', aspectRatio: '1' }}>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <button
              onClick={() => setSelectedImage(null)}
              style={{
                position:        'absolute',
                top:              10,
                right:            10,
                width:            32,
                height:           32,
                borderRadius:    '50%',
                background:      'rgba(0,0,0,0.6)',
                color:           '#fff',
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
                cursor:          'pointer',
                border:          'none',
                transition:      'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,115,22,0.8)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
            >
              <X size={14} />
            </button>
          </div>
          {(selectedImage.title || selectedImage.description) && (
            <div style={{ padding: '20px 24px' }}>
              {selectedImage.title && (
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#F5F5F5', marginBottom: 6, fontFamily: 'var(--font-display)' }}>
                  {selectedImage.title}
                </h3>
              )}
              {selectedImage.description && (
                <p style={{ fontSize: 14, color: '#A1A1AA', lineHeight: 1.6 }}>
                  {selectedImage.description}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── Loading / empty states ────────────────────────────────────────────────
  if (!isMounted) return (
    <div style={{ width: containerSize, height: containerSize, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111', borderRadius: 12 }}>
      <span style={{ color: '#71717A', fontSize: 14 }}>Initialising…</span>
    </div>
  );

  if (!images.length) return (
    <div style={{ width: containerSize, height: containerSize, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #27272A', borderRadius: 12 }}>
      <span style={{ color: '#71717A', fontSize: 14 }}>No images provided</span>
    </div>
  );

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes sphereFadeIn  { from { opacity: 0; }              to { opacity: 1; } }
        @keyframes sphereScaleIn { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>

      <div
        ref={containerRef}
        className={className}
        style={{
          position:   'relative',
          width:       containerSize,
          height:      containerSize,
          userSelect: 'none',
          cursor:      isDragging ? 'grabbing' : 'grab',
          perspective: `${perspective}px`,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 10 }}>
          {images.map((img, i) => renderNode(img, i))}
        </div>
      </div>

      {renderModal()}
    </>
  );
}

export { SphereImageGrid };
