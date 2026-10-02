import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '../../lib/animations';
import { useReducedMotion } from '../../hooks';
import { ArrowDown } from 'lucide-react';
import './FlowSection.css';

const flowSteps = [
  { label: 'SOCIAL MEDIA', description: 'Brings people in', accent: '#F97316' },
  { label: 'DIGITAL EXPERIENCE', description: 'Keeps them engaged', accent: '#FB923C' },
  { label: 'WEB DEVELOPMENT', description: 'Converts the experience', accent: '#FACC15' },
  { label: 'BRAND', description: 'Becomes memorable', accent: '#F97316' },
];

export default function FlowSection() {
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.flow-heading', { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.flow-heading', start: 'top 85%' },
      });

      gsap.fromTo('.flow-step', { x: -40, opacity: 0 }, {
        x: 0, opacity: 1, stagger: 0.15, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.flow-steps', start: 'top 80%' },
      });

      gsap.fromTo('.flow-connector', { scaleY: 0 }, {
        scaleY: 1, stagger: 0.15, duration: 0.5, ease: 'power3.out',
        scrollTrigger: { trigger: '.flow-steps', start: 'top 75%' },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="flow-section section">
      <div className="container">
        <div className="flow-heading">
          <span className="label label-accent">The Admirus Method</span>
          <h2 className="heading-md">
            How everything<br />
            <span className="text-muted-inline">connects.</span>
          </h2>
        </div>

        <div className="flow-steps">
          {flowSteps.map((step, i) => (
            <div key={step.label} className="flow-step-wrap">
              <div className="flow-step" style={{ '--step-accent': step.accent }}>
                <div className="flow-step-number">0{i + 1}</div>
                <div className="flow-step-content">
                  <h3 className="flow-step-label">{step.label}</h3>
                  <p className="flow-step-desc body-md">{step.description}</p>
                </div>
                <div className="flow-step-dot" />
              </div>
              {i < flowSteps.length - 1 && (
                <div className="flow-connector">
                  <ArrowDown size={16} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
