import { useRef, useEffect } from 'react';
import { gsap } from '../../lib/animations';
import { useReducedMotion } from '../../hooks';
import { Sparkles, ShieldCheck } from 'lucide-react';
import './ClientsMarquee.css';

const CLIENTS_ROW_1 = [
  { id: 1, src: '/brands/brandlogo1.png', name: 'Partner Brand 01' },
  { id: 2, src: '/brands/brandlogo2.png', name: 'Partner Brand 02' },
  { id: 3, src: '/brands/brandlogo3.png', name: 'Partner Brand 03' },
  { id: 4, src: '/brands/brandlogo4.png', name: 'Partner Brand 04' },
  { id: 5, src: '/brands/brandlogo5.png', name: 'Partner Brand 05' },
  { id: 6, src: '/brands/brandlogo6.png', name: 'Partner Brand 06' },
  { id: 7, src: '/brands/brandlogo7.png', name: 'Partner Brand 07' },
];

const CLIENTS_ROW_2 = [
  { id: 8, src: '/brands/brandlogo8.png', name: 'Partner Brand 08' },
  { id: 9, src: '/brands/brandlogo9.png', name: 'Partner Brand 09' },
  { id: 10, src: '/brands/brandlogo10.png', name: 'Partner Brand 10' },
  { id: 11, src: '/brands/brandlogo11.png', name: 'Partner Brand 11' },
  { id: 12, src: '/brands/brandlogo12.png', name: 'Partner Brand 12' },
  { id: 13, src: '/brands/brandlogo13.png', name: 'Partner Brand 13' },
  { id: 1, src: '/brands/brandlogo1.png', name: 'Partner Brand 01' },
];

export default function ClientsMarquee() {
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.clients-marquee-header',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
          },
        }
      );
      gsap.fromTo(
        '.clients-track-wrapper',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          delay: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="clients-marquee-section" aria-label="Clients & Partners">
      {/* Background ambient radial glow */}
      <div className="clients-ambient-glow" aria-hidden="true" />

      <div className="container">
        {/* Section Header */}
        <div className="clients-marquee-header">
          <div className="clients-badge">
            <ShieldCheck size={14} />
            <span>Trusted By Branding Partner</span>
          </div>

          <h2 className="heading-md clients-title">
            Brands We’ve Brought to Life, On-Screen & On the Ground.
          </h2>

          <p className="body-sm clients-sub">
            Whether it’s custom merchandise, aerial drone shows, large-scale events, or digital marketing — we craft complete 360° brand experiences that stand out.          </p>
        </div>
      </div>

      {/* Infinite Horizontal Auto-Scrolling Tracks */}
      <div className="clients-track-wrapper">
        {/* Edge Fade Gradients for Seamless Infinity */}
        <div className="clients-fade-edge clients-fade-left" aria-hidden="true" />
        <div className="clients-fade-edge clients-fade-right" aria-hidden="true" />

        {/* Row 1 — Moving Left */}
        <div className="marquee-row marquee-row-left">
          <div className="marquee-content">
            {CLIENTS_ROW_1.map((client, idx) => (
              <div key={`c1-a-${client.id}-${idx}`} className="client-logo-card" data-cursor="explore">
                <img
                  src={client.src}
                  alt={client.name}
                  className="client-logo-img"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          {/* Duplicate set for gapless seamless loop */}
          <div className="marquee-content" aria-hidden="true">
            {CLIENTS_ROW_1.map((client, idx) => (
              <div key={`c1-b-${client.id}-${idx}`} className="client-logo-card">
                <img
                  src={client.src}
                  alt={client.name}
                  className="client-logo-img"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          {/* Triplicate for ultra-wide screen safety */}
          <div className="marquee-content" aria-hidden="true">
            {CLIENTS_ROW_1.map((client, idx) => (
              <div key={`c1-c-${client.id}-${idx}`} className="client-logo-card">
                <img
                  src={client.src}
                  alt={client.name}
                  className="client-logo-img"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — Moving Right (Counter Direction) */}
        <div className="marquee-row marquee-row-right">
          <div className="marquee-content">
            {CLIENTS_ROW_2.map((client, idx) => (
              <div key={`c2-a-${client.id}-${idx}`} className="client-logo-card" data-cursor="explore">
                <img
                  src={client.src}
                  alt={client.name}
                  className="client-logo-img"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          {/* Duplicate set for gapless loop */}
          <div className="marquee-content" aria-hidden="true">
            {CLIENTS_ROW_2.map((client, idx) => (
              <div key={`c2-b-${client.id}-${idx}`} className="client-logo-card">
                <img
                  src={client.src}
                  alt={client.name}
                  className="client-logo-img"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          {/* Triplicate for ultra-wide screen safety */}
          <div className="marquee-content" aria-hidden="true">
            {CLIENTS_ROW_2.map((client, idx) => (
              <div key={`c2-c-${client.id}-${idx}`} className="client-logo-card">
                <img
                  src={client.src}
                  alt={client.name}
                  className="client-logo-img"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
