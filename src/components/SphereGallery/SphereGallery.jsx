import { useRef, useEffect, useState } from 'react';
import { gsap } from '../../lib/animations';
import { useReducedMotion, useDevicePerformance } from '../../hooks';
import SphereImageGrid from '../ui/img-sphere';
import './SphereGallery.css';

export default function SphereGallery() {
  const sectionRef  = useRef(null);
  const reducedMotion = useReducedMotion();
  const performance   = useDevicePerformance();

  // Responsive sphere size
  const [size, setSize] = useState(560);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setSize(w < 480 ? 300 : w < 768 ? 380 : w < 1024 ? 460 : 560);
    };
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.sg-heading', { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.sg-heading', start: 'top 85%' },
      });

      gsap.fromTo('.sg-sphere-wrap', { scale: 0.85, opacity: 0 }, {
        scale: 1, opacity: 1, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.sg-sphere-wrap', start: 'top 80%' },
      });

      gsap.fromTo('.sg-hint', { opacity: 0 }, {
        opacity: 1, duration: 0.6,
        scrollTrigger: { trigger: '.sg-hint', start: 'top 90%' },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Lower image count & disable auto-rotate on weak devices
  const isLowEnd   = performance === 'low';
  const isMedium   = performance === 'medium';
  const imageCount  = isLowEnd ? 20 : isMedium ? 40 : 60;
  const autoRotate  = !isLowEnd;

  return (
    <section
      ref={sectionRef}
      className="sg-section section"
      id="sphere-gallery"
      aria-label="Sphere gallery — portfolio"
    >
      <div className="container">

        {/* Heading */}
        <div className="sg-heading">
          <span className="label label-accent">Our Work</span>
          <h2 className="heading-lg">
            Every project,<br />
            <span className="text-muted-inline">a universe of craft.</span>
          </h2>
          <p className="body-lg sg-sub">
            Drag the sphere to explore. Click any image to discover the story behind it.
          </p>
        </div>

        {/* Sphere */}
        <div className="sg-sphere-wrap">
          {/* Ambient ring */}
          <div className="sg-ring" aria-hidden="true" />

          <SphereImageGrid
            containerSize={size}
            sphereRadius={size * 0.38}
            baseImageScale={0.13}
            dragSensitivity={0.65}
            momentumDecay={0.96}
            maxRotationSpeed={6}
            perspective={1200}
            autoRotate={autoRotate}
            autoRotateSpeed={0.22}
          />
        </div>

        {/* Hint */}
        <p className="sg-hint label">
          <span className="sg-hint-dot" aria-hidden="true" />
          Drag · Spin · Click
        </p>

      </div>

      {/* Background decoration */}
      <div className="sg-bg-glow" aria-hidden="true" />
    </section>
  );
}
