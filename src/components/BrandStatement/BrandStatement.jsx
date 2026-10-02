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
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const mainText = 'ONE CREATIVE SYSTEM. MULTIPLE DIGITAL POSSIBILITIES.';
  const words = mainText.split(' ');

  return (
    <section ref={sectionRef} className="brand-statement section">
      <div className="container">
        <div className="brand-statement-inner">
          <p ref={textRef} className="brand-text heading-lg">
            {words.map((word, i) => (
              <span key={i} className="brand-word">
                {word}{' '}
              </span>
            ))}
          </p>
          <p className="brand-subtitle body-lg">
            Admirus brings strategy, creativity, technology, and production
            into one connected creative ecosystem.
          </p>
        </div>
      </div>
    </section>
  );
}
