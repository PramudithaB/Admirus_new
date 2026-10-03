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

// ── Admirus Real Portfolio & Social Media Images ──────────────────────────────
const BASE_IMAGES = [
  // Social Media Campaign Photos
  { src: '/social/suwa-arana-ayurveda-oil.jpg', alt: 'Suwa Arana Ayurveda Oil', title: 'Suwa Arana Ayurveda Oil', description: 'Social Media Campaign & Product Design' },
  { src: '/social/copymoite-smartboard-classroom.jpg', alt: 'CopyMoite Smartboard', title: 'CopyMoite Smartboard', description: 'EdTech Smartboard Campaign' },
  { src: '/social/gami-gedara-pittu-craving.jpg', alt: 'Gami Gedara Culinary', title: 'Gami Gedara Culinary', description: 'Restaurant Social Campaign' },
  { src: '/social/ceylon-lagos-mint-drink.jpg', alt: 'Ceylon Lagos Mint Drink', title: 'Ceylon Lagos Mint Drink', description: 'Beverage Branding & Social Campaign' },
  { src: '/social/hair-studio-reclaim-confidence.jpg', alt: 'Hair Studio Campaign', title: 'Hair Studio Campaign', description: 'Beauty & Lifestyle Marketing' },
  { src: '/social/ministry-of-cakes-instant-happiness.jpg', alt: 'Ministry of Cakes', title: 'Ministry of Cakes', description: 'Confectionery Social Design' },
  { src: '/social/taiyo-carepoint-glass-coating.jpg', alt: 'Taiyo Care Point', title: 'Taiyo Care Point', description: 'Automotive Care Campaign' },
  { src: '/social/radex-roofing-sheet-strength.jpg', alt: 'Radex Roofing', title: 'Radex Roofing', description: 'Industrial Brand Campaign' },
  { src: '/social/rithu-packaging-partner.jpg', alt: 'Rithu Packaging', title: 'Rithu Packaging', description: 'Corporate Packaging Campaign' },
  { src: '/social/sabendi-surprise-delivery.jpg', alt: 'Sabendi Surprise Delivery', title: 'Sabendi Surprise Delivery', description: 'E-commerce Delivery Campaign' },
  { src: '/social/gleamz-cleaning-our-services.jpg', alt: 'Gleamz Cleaning', title: 'Gleamz Cleaning', description: 'Services Social Media Design' },
  { src: '/social/adole-fashion-childrens-day.jpg', alt: 'Adole Fashion', title: 'Adole Fashion', description: 'Kids Apparel Social Campaign' },
  { src: '/social/learn-german-mandakini.jpg', alt: 'Learn German Mandakini', title: 'Learn German Mandakini', description: 'Educational Social Media Campaign' },
  { src: '/social/copymoite-tech-support.jpg', alt: 'CopyMoite Support', title: 'CopyMoite Support', description: 'Corporate Tech Service Campaign' },
  { src: '/social/gami-gedara-chai-break.jpg', alt: 'Gami Gedara Chai', title: 'Gami Gedara Chai', description: 'Food & Beverage Marketing' },
  { src: '/social/hair-studio-new-look.jpg', alt: 'Hair Studio New Look', title: 'Hair Studio New Look', description: 'Salon & Spa Branding' },
  { src: '/social/ministry-of-cakes-you-dream-we-bake.jpg', alt: 'Ministry of Cakes', title: 'Ministry of Cakes', description: 'Custom Bakery Campaign' },
  { src: '/social/rithu-industrial-poly-rolls.jpg', alt: 'Rithu Poly Rolls', title: 'Rithu Poly Rolls', description: 'Industrial Products Campaign' },
  { src: '/social/suwa-arana-before-after-recovery.jpg', alt: 'Suwa Arana Recovery', title: 'Suwa Arana Recovery', description: 'Ayurvedic Medical Campaign' },
  { src: '/social/suwa-arana-diabetes-nerve-treatment.jpg', alt: 'Suwa Arana Care', title: 'Suwa Arana Care', description: 'Healthcare Brand Campaign' },
  { src: '/social/suwa-arana-herbal-body-wash.jpg', alt: 'Suwa Arana Body Wash', title: 'Suwa Arana Body Wash', description: 'Personal Care Product Launch' },
  { src: '/social/gleamz-friday-chaos-monday-magic.jpg', alt: 'Gleamz Magic', title: 'Gleamz Magic', description: 'Cleaning Brand Campaign' },

  // Event & Aerial Coverage Photos
  { src: '/events/kumbhabhishekam-batticaloa-crew.webp', alt: 'Batticaloa Ceremony Crew', title: 'Batticaloa Temple Ceremony', description: 'Live Event & Drone Aerial Coverage' },
  { src: '/events/drone-crew-night-lights.webp', alt: 'Night Aerial Crew', title: 'Night Festival Production', description: 'Aerial Drone & Night Lighting Crew' },
  { src: '/events/visaga-opening-team-lineup.webp', alt: 'VISAGA Opening Lineup', title: 'VISAGA Kotahena Launch', description: 'Showroom Opening Production' },
  { src: '/events/visaga-opening-crew-selfie.webp', alt: 'VISAGA Media Crew', title: 'VISAGA Presenter Squad', description: 'Live Red Carpet Media Coverage' },
  { src: '/events/emcc-55th-anniversary-crew.webp', alt: 'EMCC 55th Anniversary', title: 'EMCC 55th Celebration', description: 'Stadium Festival Media Production' },
  { src: '/events/thettativu-temple-ceremony.webp', alt: 'Thettativu Temple', title: 'Temple Consecration', description: 'Drone Holy Water Consecration' },
  { src: '/events/visaga-kotahena-opening.webp', alt: 'VISAGA Showroom', title: 'VISAGA Grand Opening', description: 'VIP Retail Launch & Drone Reveal' },
  { src: '/events/temple-drone-festival.webp', alt: 'Temple Drone Festival', title: 'Temple Aerial Blessing', description: 'Drone Floral Shower Production' },
  { src: '/events/premium-optix-opening.webp', alt: 'Premium Optix Opening', title: 'Premium Optix Kurunegala', description: 'Flagship Showroom Launch' },
  { src: '/events/malee-dress-point-opening.webp', alt: 'Malee Dress Point', title: 'Malee Dress Point Opening', description: 'Retail Grand Opening Production' },
  { src: '/events/suwa-arana-aerial-banner-drop.webp', alt: 'Suwa Arana Banner Drop', title: 'Suwa Arana 4 Launch', description: 'Heavy-Lift Aerial Banner Flight' },
  { src: '/events/browns-premier-league-drone-team.webp', alt: 'Browns Premier League', title: 'Browns Premier League 2025', description: 'Tournament Live Drone Coverage' },
  { src: '/events/suwa-arana-drone-launch-crew.webp', alt: 'Suwa Arana Crew', title: 'Suwa Arana 4 Operations', description: 'Drone Flight & Security Command' },
  { src: '/events/media-event-production-squad.webp', alt: 'Media Production Squad', title: 'Admirus Media Squad', description: 'Live Accredited Event Crew' },

  // Apparel & Feature Showcase Photos
  { src: '/hicloth/lahiru-creation-black-polo.webp', alt: 'Lahiru Creation Black Polo', title: 'Hi Cloth Black Polo', description: 'Heavyweight Custom Executive Polo' },
  { src: '/hicloth/lahiru-creation-white-polo.webp', alt: 'Lahiru Creation White Polo', title: 'Hi Cloth White Polo', description: 'Executive White Tipped Polo' },
  { src: '/hicloth/elle-salon-polo-batch.webp', alt: 'Elle Salon Polo Batch', title: 'Elle Salon Uniforms', description: 'Gold Embroidered Staff Apparel' },
  { src: '/hicloth/boc-polo-shirt.webp', alt: 'BOC Corporate Polo', title: 'Bank of Ceylon Polo', description: 'Official BOC Heritage Crest Polo' },
  { src: '/hicloth/cargills-polo-shirts.webp', alt: 'Cargills Crew Polo', title: 'Cargills Staff Apparel', description: 'Active Retail Workwear Polo' },
  { src: '/hicloth/ahm-auto-electricals-polo.webp', alt: 'AHM Auto Polo', title: 'AHM Motorsport Polo', description: 'Industrial Workshop Uniform' },
  { src: '/hicloth/ssj-beter-solution-polo.webp', alt: 'SSJ Maritime Polo', title: 'SSJ Solution Polo', description: 'Heather Slate Marine Polo' },

  // Team Leadership & Creative Heads
  { src: '/team/kasun-wickramasinghe.webp', alt: 'Kasun Wickramasinghe', title: 'Kasun Wickramasinghe', description: 'Founder & Chief Executive Officer' },
  { src: '/team/dilshan-senanayake.webp', alt: 'Dilshan Senanayake', title: 'Dilshan Senanayake', description: 'Head of Brand Strategy & Identity' },
  { src: '/team/pramuditha-bandara.webp', alt: 'Pramuditha Bandara', title: 'Pramuditha Bandara', description: 'Lead 3D Web & Interactive Engineer' },
  { src: '/team/sachini-jayawardena.webp', alt: 'Sachini Jayawardena', title: 'Sachini Jayawardena', description: 'Head of Social Media & Digital Growth' },
  { src: '/team/tharindu-fernando.webp', alt: 'Tharindu Fernando', title: 'Tharindu Fernando', description: 'Lead Cinematic Video & Visual FX Director' },
  { src: '/team/nuwan-perera.webp', alt: 'Nuwan Perera', title: 'Nuwan Perera', description: 'Chief Aerial Director (Drone Mahaththaya)' },
  { src: '/team/dinithi-alwis.webp', alt: 'Dinithi Alwis', title: 'Dinithi Alwis', description: 'Creative Art Director (Sugar Pixel Studio)' },
  { src: '/team/malith-rodrigo.webp', alt: 'Malith Rodrigo', title: 'Malith Rodrigo', description: 'Head of Experience & Event Production' },
  { src: '/team/kavinda-silva.webp', alt: 'Kavinda Silva', title: 'Kavinda Silva', description: 'Senior Brand & Operations Lead' },
  { src: '/team/isuru-bandara.webp', alt: 'Isuru Bandara', title: 'Isuru Bandara', description: 'Creative Content & Media Strategist' },

  // Brand Pillars
  { src: '/features/admirus.jpeg', alt: 'Admirus Digital', title: 'Admirus Digital', description: 'Social Media & Brand Growth' },
  { src: '/features/drone.jpeg', alt: 'Drone Mahaththaya', title: 'Drone Mahaththaya', description: 'Cinema 6K Aerial Production' },
  { src: '/features/eventbyadmirus.jpeg', alt: 'The Events by Admirus', title: 'The Events by Admirus', description: 'Experiential Stage & Spatial Events' },
  { src: '/features/hicloth.jpeg', alt: 'Hi Cloth Lab', title: 'Hi Cloth Lab', description: 'Streetwear & Corporate Apparel' },
  { src: '/features/sugerpixel.jpeg', alt: 'Sugar Pixel Studio', title: 'Sugar Pixel Studio', description: '3D Artistry & Brand Identity' },
];

// Expand to 60 images for full 3D sphere coverage
const DEFAULT_IMAGES = Array.from({ length: 60 }, (_, i) => ({
  id: `img-${i + 1}`,
  ...BASE_IMAGES[i % BASE_IMAGES.length],
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
