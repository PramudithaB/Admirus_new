import { useRef, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { gsap } from '../../lib/animations';
import { useReducedMotion } from '../../hooks';
import { services } from '../../data/services';
import { ecosystem } from '../../data/brand';
import {
  Palette, PenTool, Layers, Video, Navigation, Calendar, Shirt,
  Share2, Globe, ArrowUpRight, Zap, BarChart3, Users, Megaphone,
  Search, Smartphone, Layout, Code2,
} from 'lucide-react';
import './ServicesEcosystem.css';

// ── Icon maps ─────────────────────────────────────────────────────────────────
const ecosystemIcons = {
  dmp: Megaphone,
  events: Calendar,
  drone: Navigation,
  sugar: Palette,
  hicloth: Shirt,
};

const capabilityIcons = {
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

// ── Component ─────────────────────────────────────────────────────────────────
export default function ServicesEcosystem() {
  const sectionRef = useRef(null);
  const [activeService, setActiveService] = useState(null);
  const reducedMotion = useReducedMotion();
  const navigate = useNavigate();

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      // Section heading
      gsap.fromTo('.svc-heading', { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.svc-heading', start: 'top 85%' },
      });

      // Primary pillars
      gsap.fromTo('.svc-pillar', { y: 80, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.15, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: '.svc-pillars', start: 'top 80%' },
      });

      // Supporting nodes
      gsap.fromTo('.ecosystem-node', { scale: 0.6, opacity: 0 }, {
        scale: 1, opacity: 1, stagger: 0.07, duration: 0.55, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: '.ecosystem-grid', start: 'top 80%' },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="services-section section"
      id="services"
      aria-label="Services"
    >
      <div className="container">

        {/* ── Section heading ────────────────────────────────────── */}
        <div className="svc-heading">
          <span className="label label-accent">What We Do</span>
          <h2 className="heading-lg">
            Two forces.<br />
            <span className="text-muted-inline">One creative system.</span>
          </h2>
        </div>

        {/* ── Primary pillars (Social + Web) ─────────────────────── */}
        <div className="svc-pillars">
          {services.primary.map((service) => {
            const isSocial = service.id === 'social-media';

            return (
              <div
                key={service.id}
                className={`svc-pillar ${isSocial ? 'svc-pillar-clickable' : ''}`}
                style={{
                  '--pillar-color': service.color,
                  cursor: isSocial ? 'pointer' : 'default',
                }}
                data-cursor={isSocial ? 'explore' : 'explore'}
                onClick={() => {
                  if (isSocial) {
                    navigate('/social-media');
                  }
                }}
              >
                {/* Header row */}
                <div className="svc-pillar-header">
                  <span className="svc-pillar-num">{service.number}</span>
                  <div className="svc-pillar-badge">
                    {isSocial
                      ? <Share2 size={16} />
                      : <Globe size={16} />}
                  </div>
                </div>

                <h3 className="svc-pillar-title">{service.title}</h3>
                <p className="svc-pillar-sub">{service.subtitle}</p>
                <p className="svc-pillar-desc body-md">{service.description}</p>

                {/* Capability chips */}
                <div className="svc-capabilities">
                  {service.capabilities.map((cap) => {
                    const Icon = capabilityIcons[cap] || Zap;
                    return (
                      <div key={cap} className="svc-chip">
                        <Icon size={12} />
                        <span>{cap}</span>
                      </div>
                    );
                  })}
                </div>

                {isSocial ? (
                  <Link
                    to="/social-media"
                    className="svc-pillar-cta svc-pillar-cta-highlight"
                    data-cursor="explore"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>Explore Social Media</span>
                    <ArrowUpRight size={14} />
                  </Link>
                ) : (
                  <a
                    href="#contact"
                    className="svc-pillar-cta"
                    data-cursor="link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>Get Started</span>
                    <ArrowUpRight size={14} />
                  </a>
                )}

                {/* Ambient glow */}
                <div className="svc-pillar-glow" />
              </div>
            );
          })}
        </div>

        {/* ── The Admirus Ecosystem ───────────────────────────────── */}
        <div className="ecosystem-divider">
          <span className="label label-accent">The Admirus Ecosystem</span>
        </div>

        <div className="ecosystem-grid">
          {ecosystem.map((item, idx) => {
            const Icon = ecosystemIcons[item.id] || Palette;
            const isActive = activeService === item.id;
            const ecosystemRoutes = {
              dmp: '/social-media',
              events: '/the-events-by-admirus',
              drone: '/drone-mahaththaya',
              sugar: '/sugar-pixel-studio',
              hicloth: '/hi-cloth',
            };
            const route = ecosystemRoutes[item.id];

            return (
              <div
                key={item.id}
                className={`ecosystem-node ${isActive ? 'active' : ''}`}
                onMouseEnter={() => setActiveService(item.id)}
                onMouseLeave={() => setActiveService(null)}
                onClick={() => {
                  if (route) navigate(route);
                }}
                data-cursor="explore"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    if (route) navigate(route);
                  }
                }}
              >
                <div className="node-top-row">
                  <div className="node-icon">
                    <Icon size={18} />
                  </div>
                  <div className="node-action-indicator">
                    <span className="node-num">0{idx + 1}</span>
                    <ArrowUpRight size={14} className="node-arrow" />
                  </div>
                </div>
                <h4 className="node-title">{item.name}</h4>
                <p className="node-description body-sm">{item.description}</p>
                <div className="node-explore-link">
                  <span>Explore Showcase</span>
                  <ArrowUpRight size={12} />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
