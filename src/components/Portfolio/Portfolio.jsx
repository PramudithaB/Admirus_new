import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '../../lib/animations';
import { useReducedMotion, useMediaQuery } from '../../hooks';
import { projects } from '../../data/projects';
import { ArrowUpRight } from 'lucide-react';
import './Portfolio.css';

export default function Portfolio() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (reducedMotion || isMobile) return;

    const ctx = gsap.context(() => {
      // Heading
      gsap.fromTo('.portfolio-heading', { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.portfolio-heading', start: 'top 85%' },
      });

      // Horizontal scroll
      if (trackRef.current) {
        const totalWidth = trackRef.current.scrollWidth - window.innerWidth + 200;

        gsap.to(trackRef.current, {
          x: -totalWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${totalWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion, isMobile]);

  return (
    <section ref={sectionRef} className={`portfolio section ${isMobile ? 'portfolio-mobile' : ''}`} id="work">
      <div className="container portfolio-header">
        <div className="portfolio-heading">
          <span className="label label-accent">Selected Work</span>
          <h2 className="heading-lg">
            From Concept<br />
            <span className="text-muted-inline">To Iconic.</span>
          </h2>
        </div>
      </div>

      <div ref={trackRef} className="portfolio-track">
        {projects.map((project, i) => (
          <article
            key={project.id}
            className="portfolio-card"
            style={{ '--card-color': project.color }}
            data-cursor="view"
          >
            <div className="card-visual">
              <div className="card-placeholder">
                <span className="card-placeholder-number">0{i + 1}</span>
                <span className="card-placeholder-cat">{project.category}</span>
              </div>
            </div>

            <div className="card-info">
              <div className="card-meta">
                <span className="label">{project.category}</span>
                <span className="label">{project.year}</span>
              </div>
              <h3 className="card-title heading-sm">{project.title}</h3>
              <p className="card-desc body-sm">{project.description}</p>
            </div>

            <div className="card-hover-indicator">
              <ArrowUpRight size={20} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
