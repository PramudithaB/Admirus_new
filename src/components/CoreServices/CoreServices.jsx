import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '../../lib/animations';
import { useReducedMotion } from '../../hooks';
import { services } from '../../data/services';
import { ArrowUpRight, Share2, Globe, Palette, Code2, BarChart3, Users, Megaphone, Search, Smartphone, Layout, Zap } from 'lucide-react';
import './CoreServices.css';

const iconMap = {
  'Social Media Strategy': Megaphone,
  'Content Creation': Palette,
  'Creative Campaigns': Zap,
  'Social Media Design': Layout,
  'Brand Communication': Users,
  'Community Management': Users,
  'Performance Marketing': BarChart3,
  'Influencer Strategy': Share2,
  'Website Design': Globe,
  'Frontend Development': Code2,
  'Web Applications': Smartphone,
  'UI/UX Design': Layout,
  'E-commerce': BarChart3,
  'SEO Optimization': Search,
  'Performance': Zap,
  'Custom Solutions': Code2,
};

export default function CoreServices() {
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      // Section heading
      gsap.fromTo('.core-heading', { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.core-heading', start: 'top 85%' },
      });

      // Pillar cards
      gsap.fromTo('.service-pillar', { y: 80, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.2, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.service-pillars', start: 'top 80%' },
      });

      // Capability items
      gsap.fromTo('.capability-item', { x: -20, opacity: 0 }, {
        x: 0, opacity: 1, stagger: 0.05, duration: 0.5, ease: 'power3.out',
        scrollTrigger: { trigger: '.service-pillars', start: 'top 60%' },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="core-services section" id="services">
      <div className="container">
        <div className="core-heading">
          <span className="label label-accent">What We Build</span>
          <h2 className="heading-lg">
            .<br />
            <span className="text-muted-inline">One creative system.</span>
          </h2>
        </div>

        <div className="service-pillars">
          {services.primary.map((service) => (
            <div
              key={service.id}
              className="service-pillar"
              style={{ '--pillar-color': service.color }}
              data-cursor="explore"
            >
              <div className="pillar-header">
                <span className="pillar-number">{service.number}</span>
                <div className="pillar-badge">
                  {service.id === 'social-media' ? (
                    <Share2 size={18} />
                  ) : (
                    <Globe size={18} />
                  )}
                </div>
              </div>

              <h3 className="pillar-title heading-xl">
                {service.title.split(' ').map((word, i) => (
                  <span key={i} className="pillar-title-word">{word}</span>
                ))}
              </h3>

              <p className="pillar-subtitle body-lg">{service.subtitle}</p>
              <p className="pillar-description body-md">{service.description}</p>

              <div className="pillar-capabilities">
                {service.capabilities.map((cap) => {
                  const Icon = iconMap[cap] || Zap;
                  return (
                    <div key={cap} className="capability-item">
                      <Icon size={14} />
                      <span>{cap}</span>
                    </div>
                  );
                })}
              </div>

              <a href="#contact" className="pillar-cta" data-cursor="link">
                <span>Learn More</span>
                <ArrowUpRight size={16} />
              </a>

              <div className="pillar-glow" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
