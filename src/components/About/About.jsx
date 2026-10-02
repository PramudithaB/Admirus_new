import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger } from '../../lib/animations';
import { useReducedMotion } from '../../hooks';
import { brand } from '../../data/brand';
import { ArrowUpRight } from 'lucide-react';
import './About.css';

export default function About() {
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.about-heading', { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.about-heading', start: 'top 85%' },
      });

      gsap.fromTo('.about-body', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.about-body', start: 'top 85%' },
      });

      // Why Admirus equation
      gsap.fromTo('.equation-item', { x: -30, opacity: 0 }, {
        x: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: 'power3.out',
        scrollTrigger: { trigger: '.why-equation', start: 'top 85%' },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="about section" id="about">
      <div className="container">
        {/* About heading */}
        <div className="about-top">
          <div className="about-heading">
            <span className="label label-accent">About Admirus</span>
            <h2 className="heading-lg">
              One OS.<br />
              Your Complete<br />
              <span className="text-muted-inline">Brand Legacy.</span>
            </h2>
          </div>

          <div className="about-body">
            <p className="body-lg">
              {brand.description}
            </p>
            <p className="body-md" style={{ marginTop: '16px' }}>
              At Admirus, branding is more than design — it's an experience built
              to be felt, remembered, and to create a lasting legacy.
            </p>
            <div style={{ marginTop: '24px' }}>
              <Link to="/team" className="btn btn-ghost" data-cursor="link" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span>Meet Our Team</span>
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        {/* Why Admirus - Equation */}
        <div className="why-admirus">
          <h3 className="heading-sm" style={{ marginBottom: '32px' }}>
            {brand.whyChooseHeadline}
          </h3>
          <div className="why-equation">
            {['Brand', 'Social', 'Content', 'Web', 'Video', 'Events'].map((item, i) => (
              <div key={item} className="equation-item">
                {i > 0 && <span className="equation-plus">+</span>}
                <span className="equation-label">{item}</span>
              </div>
            ))}
            <div className="equation-item equation-result">
              <span className="equation-equals">=</span>
              <span className="equation-brand">ADMIRUS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
