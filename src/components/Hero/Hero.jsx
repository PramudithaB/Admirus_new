import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { SplineScene } from '../ui/splite';
import { Spotlight } from '../ui/spotlight';
import { useReducedMotion } from '../../hooks';
import { ArrowUpRight, ArrowDown } from 'lucide-react';
import './Hero.css';

export default function Hero() {
  const reducedMotion = useReducedMotion();
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const tagRef = useRef(null);

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 2.2 });

      // Tag badge
      tl.fromTo(
        tagRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
      );

      // Headline lines
      tl.fromTo(
        '.hero-line',
        { y: 110, opacity: 0, rotateX: -18 },
        { y: 0, opacity: 1, rotateX: 0, stagger: 0.08, duration: 1, ease: 'power4.out' },
        '-=0.3'
      );

      // Sub + CTA
      tl.fromTo(
        '.hero-sub',
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
        '-=0.4'
      );
      tl.fromTo(
        '.hero-cta',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.3'
      );

      // Stats row
      tl.fromTo(
        '.hero-stat',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power3.out' },
        '-=0.3'
      );

      // Right panel
      tl.fromTo(
        rightRef.current,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 1, ease: 'power3.out' },
        '-=0.8'
      );

      // Scroll cue
      tl.fromTo(
        '.hero-scroll-indicator',
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        '-=0.3'
      );
    });

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section className="hero" id="hero" aria-label="Hero — ADMIRUS Creative Brand OS">

      {/* ── Spotlight that follows the mouse ─────────────────────── */}
      <Spotlight size={500} color="rgba(249,115,22,0.18)" />

      {/* ── Ambient bottom glow ──────────────────────────────────── */}
      <div className="hero-ambient" aria-hidden="true" />

      {/* ── Layout: two-column split ─────────────────────────────── */}
      <div className="hero-inner">

        {/* Left — copy ─────────────────────────────────────────── */}
        <div ref={leftRef} className="hero-left">

          <div ref={tagRef} className="hero-tag">
            <span className="hero-tag-dot" aria-hidden="true" />
            <span className="label label-accent">Integrated Creative Brand OS</span>
          </div>

          <h1 className="hero-headline">
            <span className="hero-line-wrap">
              <span className="hero-line">CONCEPT</span>
            </span>
            <span className="hero-line-wrap">
              <span className="hero-line">INTO</span>
            </span>
            <span className="hero-line-wrap">
              <span className="hero-line hero-line-accent">ICONIC.</span>
            </span>
          </h1>

          <p className="hero-sub body-lg">
            Social media, Digital experiences, and Web Development
            built to make brands impossible to ignore.
          </p>

          <div className="hero-cta">
            <a href="#contact" className="btn btn-primary" data-cursor="link">
              <span>Start a Project</span>
              <ArrowUpRight size={16} className="btn-icon" />
            </a>
            <a href="#work" className="btn btn-ghost" data-cursor="link">
              <span>See Our Companies</span>
            </a>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            {[
              { value: '200+', label: 'Brands Built' },
              { value: '5+', label: 'Years Creative' },
              { value: '98%', label: 'Client Rate' },
            ].map((s) => (
              <div key={s.label} className="hero-stat">
                <span className="hero-stat-value">{s.value}</span>
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — 3D Spline scene ──────────────────────────────── */}
        <div ref={rightRef} className="hero-right">
          {/* Card frame with orange border glow */}
          <div className="hero-scene-card">
            {/* Corner accents */}
            <span className="hero-corner hero-corner-tl" aria-hidden="true" />
            <span className="hero-corner hero-corner-br" aria-hidden="true" />

            {/* Spline canvas */}
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="hero-spline"
            />

            {/* Overlay label */}
            <div className="hero-scene-label">
              <span className="label">Interactive 3D</span>
              <span className="hero-scene-dot" aria-hidden="true" />
              <span className="label">Drag to explore</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Scroll cue ───────────────────────────────────────────── */}
      <div className="hero-scroll-indicator" aria-hidden="true">
        <span className="label">Scroll</span>
        <ArrowDown size={13} className="scroll-arrow" />
      </div>

    </section>
  );
}
