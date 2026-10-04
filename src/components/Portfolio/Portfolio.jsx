import { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from '../../lib/animations';
import { useReducedMotion } from '../../hooks';
import { projects } from '../../data/projects';
import { ArrowUpRight, Sparkles, Layers, Pause, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import './Portfolio.css';

// ── Interactive 3D Card Component ──────────────────────────────────────────
function ProjectCard3D({ project, index }) {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [transform, setTransform] = useState({
    rotX: 0,
    rotY: 0,
    transZ: 0,
    scale: 1,
    glareX: 50,
    glareY: 50,
    glareOpacity: 0,
  });

  const handleCardClick = () => {
    if (project.route) {
      if (project.route.startsWith('/#')) {
        const targetId = project.route.replace('/#', '');
        const elem = document.getElementById(targetId);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate(project.route);
        window.scrollTo(0, 0);
      }
    }
  };

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);

    setTransform({
      rotX: -dy * 14,
      rotY: dx * 14,
      transZ: 35,
      scale: 1.04,
      glareX: Math.round(((e.clientX - rect.left) / rect.width) * 100),
      glareY: Math.round(((e.clientY - rect.top) / rect.height) * 100),
      glareOpacity: 0.85,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTransform({
      rotX: 0,
      rotY: 0,
      transZ: 0,
      scale: 1,
      glareX: 50,
      glareY: 50,
      glareOpacity: 0,
    });
  }, []);

  return (
    <article
      ref={cardRef}
      className="portfolio-3d-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      data-cursor="explore"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick();
        }
      }}
      style={{
        '--card-color': project.color,
        cursor: 'pointer',
        transform: `perspective(1000px) rotateX(${transform.rotX}deg) rotateY(${transform.rotY}deg) translateZ(${transform.transZ}px) scale(${transform.scale})`,
      }}
    >
      <div className="portfolio-card-inner">
        {/* Dynamic Specular Light Glare */}
        <div
          className="portfolio-card-glare"
          style={{
            background: `radial-gradient(circle at ${transform.glareX}% ${transform.glareY}%, rgba(255, 255, 255, 0.4) 0%, rgba(249, 115, 22, 0.2) 40%, transparent 70%)`,
            opacity: transform.glareOpacity,
          }}
        />

        {/* 3D Visual Media Container */}
        <div className="portfolio-visual-wrap" style={{ transform: 'translateZ(25px)' }}>
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="portfolio-card-img"
              loading="lazy"
            />
          ) : (
            <div className="portfolio-card-placeholder">
              <span className="card-number">0{index + 1}</span>
              <span className="card-cat-label">{project.category}</span>
            </div>
          )}
          <div className="portfolio-visual-gradient" />

          {/* Floating Category Pill */}
          <div className="portfolio-card-floating-badge" style={{ transform: 'translateZ(45px)' }}>
            <span>{project.category}</span>
          </div>

          {/* Module Tag */}
          {project.tag && (
            <div className="portfolio-card-floating-tag" style={{ transform: 'translateZ(45px)' }}>
              <Layers size={11} />
              <span>{project.tag}</span>
            </div>
          )}
        </div>

        {/* 3D Content Container */}
        <div className="portfolio-card-body" style={{ transform: 'translateZ(35px)' }}>
          <h3 className="portfolio-card-title">{project.title}</h3>
          <p className="portfolio-card-desc body-sm">{project.description}</p>

          <div className="portfolio-card-footer">
            <span className="portfolio-explore-text">Explore Page</span>
            <div className="portfolio-card-icon-btn">
              <ArrowUpRight size={15} />
            </div>
          </div>
        </div>

        {/* Ambient border glow */}
        <div className="portfolio-card-border-glow" />
      </div>
    </article>
  );
}

// ── Main Section ─────────────────────────────────────────────────────────────
export default function Portfolio() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const reducedMotion = useReducedMotion();

  // Stagger entrance animation on initial scroll into view
  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.portfolio-heading',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.portfolio-heading', start: 'top 85%' },
        }
      );
      gsap.fromTo(
        '.portfolio-marquee-viewport',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          delay: 0.2,
          scrollTrigger: { trigger: '.portfolio-marquee-viewport', start: 'top 85%' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Triplicate projects array for infinite seamless looping
  const marqueeItems = [...projects, ...projects, ...projects];

  return (
    <section ref={sectionRef} className="portfolio section" id="work" aria-label="Selected Work">
      {/* Background ambient lighting */}
      <div className="portfolio-ambient-glow" aria-hidden="true" />

      <div className="container portfolio-header">
        <div className="portfolio-heading">
          <div className="portfolio-badge">
            <Sparkles size={13} />
            <span>Featured Portfolio</span>
          </div>
          <h2 className="heading-lg">
            From Concept<br />
            <span className="text-muted-inline">To Iconic.</span>
          </h2>
        </div>

        {/* Controls & Status Bar */}
        <div className="portfolio-controls-bar">
          <div className="portfolio-live-indicator">
            <span className={`live-pulse-dot ${isPaused ? 'paused' : ''}`} />
            <span>{isPaused ? 'MOTION PAUSED' : 'AUTO-GLIDING 3D CARDS (HOVER TO INSPECT)'}</span>
          </div>

          <button
            className={`portfolio-play-pause-btn ${isPaused ? 'active' : ''}`}
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused ? 'Play auto motion' : 'Pause auto motion'}
            data-cursor="link"
          >
            {isPaused ? <Play size={14} /> : <Pause size={14} />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>
        </div>
      </div>

      {/* ── Auto-Moving Horizontal Marquee Viewport ──────────────── */}
      <div
        className="portfolio-marquee-viewport"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Edge Gradient Fades for Seamless Infinity */}
        <div className="portfolio-fade-edge portfolio-fade-left" aria-hidden="true" />
        <div className="portfolio-fade-edge portfolio-fade-right" aria-hidden="true" />

        <div
          ref={trackRef}
          className={`portfolio-marquee-track ${isPaused ? 'paused' : ''}`}
        >
          {marqueeItems.map((project, idx) => (
            <ProjectCard3D
              key={`${project.id}-${idx}`}
              project={project}
              index={idx % projects.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
