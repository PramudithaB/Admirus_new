import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '../../lib/animations';
import { useReducedMotion } from '../../hooks';
import './BrandStatement.css';

export default function BrandStatement() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      // Reveal words progressively on scroll
      const words = textRef.current.querySelectorAll('.brand-word');

      gsap.fromTo(
        words,
        { opacity: 0.1 },
        {
          opacity: 1,
          stagger: 0.15,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'center center',
            scrub: 1,
          },
        }
      );

      // Subtitle reveal
      gsap.fromTo(
        '.brand-subtitle',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.brand-subtitle',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Automatic 2-Phase Sequence when section comes into view (not scrubbed to scroll):
      // Phase 1: Side profile robot walks horizontally from left (-38%) to right side (30%) while blurred.
      // Phase 2: Once at right side, robot turns facing directly at viewer/laptop screen, scaling up big (1.38) with ZERO BLUR (crystal clear).
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          toggleActions: 'play none none none',
        },
      });

      // Initial state
      tl.set('.brand-robo-front-img', { opacity: 0, filter: 'blur(4px) brightness(1.1)', scale: 1.0 });

      // Step 1: Walk to right side automatically (blurred side view)
      tl.fromTo(
        '.brand-robo-track',
        { x: '-38%', scale: 0.9 },
        { x: '30%', scale: 1.0, duration: 2.2, ease: 'power1.inOut' }
      );
      tl.fromTo(
        '.brand-robo-side-img',
        { filter: 'blur(4px) brightness(1.1)', opacity: 0.6 },
        { filter: 'blur(4px) brightness(1.1)', opacity: 0.6, duration: 2.2, ease: 'none' },
        0
      );

      // Step 2: Once at right side (x: 30%), crossfade to 45-degree 3D robot pose aiming camera toward viewer with ZERO BLUR (crystal clear)
      tl.to(
        '.brand-robo-side-img',
        { opacity: 0, filter: 'blur(6px)', duration: 0.6, ease: 'power2.out' },
        '>'
      );
      tl.fromTo(
        '.brand-robo-front-img',
        { opacity: 0, filter: 'blur(4px) brightness(1.1)', scale: 1.0 },
        { opacity: 1.0, filter: 'blur(0px) brightness(1.25)', scale: 1.0, duration: 0.9, ease: 'power2.out' },
        '<'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const mainText = 'ONE CREATIVE SYSTEM. MULTIPLE DIGITAL POSSIBILITIES.';
  const words = mainText.split(' ');

  return (
    <section ref={sectionRef} className="brand-statement section">
      {/* Background 3D Robo Cameraman (Pure Isolated Character) */}
      <div className="brand-robo-bg-wrap" aria-hidden="true">
        <div className="brand-robo-glow" />
        <div className="brand-robo-track">
          {/* Side walking view */}
          <img
            src="/features/robo-cameraman-isolated.jpg"
            alt="3D Isolated Robo Cameraman side walking"
            className="brand-robo-bg-img brand-robo-side-img"
          />
          {/* 45-degree 3D turned view aiming camera toward viewer */}
          <img
            src="/features/robo-cameraman-45deg.jpg"
            alt="3D Robo Cameraman turned 45 degrees aiming camera at viewer"
            className="brand-robo-bg-img brand-robo-front-img"
          />
        </div>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="brand-statement-inner">
          <p ref={textRef} className="brand-text heading-lg">
            {words.map((word, i) => (
              <span key={i} className="brand-word">
                {word}
              </span>
            ))}
          </p>
          <p className="brand-subtitle body-lg">
            Admirus brings strategy, creativity, technology, and production
            into one connected creative system.
          </p>
        </div>
      </div>
    </section>
  );
}
