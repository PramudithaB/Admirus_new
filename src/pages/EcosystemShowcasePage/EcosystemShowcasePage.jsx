import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from '../../lib/animations';
import {
  ArrowLeft, Sparkles, Filter, ExternalLink,
  Eye, X, Tag, Shirt, Navigation, Calendar, Palette, CheckCircle2, MessageSquare
} from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import './EcosystemShowcasePage.css';

// ── Interactive 3D Showcase Card ─────────────────────────────────────────────
function Showcase3DCard({ item, type, index, onSelect }) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState({
    rotX: 0,
    rotY: 0,
    transY: 0,
    transZ: 0,
    scale: 1,
    glareX: 50,
    glareY: 50,
    glareOpacity: 0,
  });

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const deltaX = (e.clientX - cx) / (rect.width / 2);
    const deltaY = (e.clientY - cy) / (rect.height / 2);

    const rotX = -deltaY * 15;
    const rotY = deltaX * 15;
    const transY = -deltaY * 8;

    const glareX = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const glareY = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    setTransform({
      rotX,
      rotY,
      transY,
      transZ: 40,
      scale: 1.03,
      glareX,
      glareY,
      glareOpacity: 0.85,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTransform({
      rotX: 0,
      rotY: 0,
      transY: 0,
      transZ: 0,
      scale: 1,
      glareX: 50,
      glareY: 50,
      glareOpacity: 0,
    });
  }, []);

  return (
    <div
      ref={cardRef}
      className={`esp-card esp-card--${type}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(item)}
      data-cursor="explore"
      style={{
        transform: `perspective(1000px) translateY(${transform.transY}px) translateZ(${transform.transZ}px) rotateX(${transform.rotX}deg) rotateY(${transform.rotY}deg) scale(${transform.scale})`,
        transition: 'transform 0.16s cubic-bezier(0.2, 0.8, 0.4, 1), box-shadow 0.2s ease',
      }}
    >
      <div className="esp-card-inner">
        {/* Dynamic Specular Light Glare */}
        <div
          className="esp-card-glare"
          style={{
            background: `radial-gradient(circle at ${transform.glareX}% ${transform.glareY}%, rgba(249, 115, 22, 0.35) 0%, rgba(250, 204, 21, 0.15) 35%, transparent 70%)`,
            opacity: transform.glareOpacity,
          }}
        />

        {/* Image Area */}
        <div className="esp-card-media" style={{ transform: 'translateZ(30px)' }}>
          <img
            src={item.image}
            alt={item.title}
            className={`esp-card-img ${item.fitMode ? `esp-card-img--${item.fitMode}` : ''}`}
            loading={index < 4 ? 'eager' : 'lazy'}
          />
          {type !== 'events' && type !== 'apparel' && <div className="esp-card-media-gradient" />}

          {/* Top Category Badge */}
          {type !== 'events' && type !== 'apparel' && (
            <div className="esp-card-badge" style={{ transform: 'translateZ(45px)' }}>
              <span>{item.category}</span>
            </div>
          )}

          {/* Type-Specific Floating Tag */}
          {type !== 'events' && type !== 'apparel' && item.fabric && (
            <div className="esp-card-spec-tag" style={{ transform: 'translateZ(45px)' }}>
              <Shirt size={12} />
              <span>{item.fabric.split(' ')[0]} {item.fabric.split(' ')[1]}</span>
            </div>
          )}
          {type !== 'events' && type !== 'apparel' && item.altitude && (
            <div className="esp-card-spec-tag" style={{ transform: 'translateZ(45px)' }}>
              <Navigation size={12} />
              <span>{item.altitude}</span>
            </div>
          )}
          {type !== 'events' && type !== 'apparel' && item.scale && (
            <div className="esp-card-spec-tag" style={{ transform: 'translateZ(45px)' }}>
              <Calendar size={12} />
              <span>{item.scale}</span>
            </div>
          )}
          {type !== 'events' && type !== 'apparel' && item.discipline && (
            <div className="esp-card-spec-tag" style={{ transform: 'translateZ(45px)' }}>
              <Palette size={12} />
              <span>{item.discipline.split('&')[0]}</span>
            </div>
          )}
        </div>

        {/* Card Content Info (Hidden for Events page to display photo only in section) */}
        {type !== 'events' && (
          <div className="esp-card-content" style={{ transform: 'translateZ(40px)' }}>
            <h3 className="esp-card-title">{item.title}</h3>
            <p className="esp-card-desc body-sm">{item.desc}</p>

            {/* Technical Spec Row */}
            <div className="esp-card-specs">
              {item.print && (
                <span className="esp-spec-pill">
                  <Tag size={11} />
                  {item.print}
                </span>
              )}
              {item.fit && (
                <span className="esp-spec-pill">{item.fit}</span>
              )}
              {item.camera && (
                <span className="esp-spec-pill">{item.camera}</span>
              )}
              {item.venue && (
                <span className="esp-spec-pill">{item.venue}</span>
              )}
              {item.client && (
                <span className="esp-spec-pill">{item.client}</span>
              )}
            </div>

            {/* Action Footer */}
            <div className="esp-card-footer">
              <span className="esp-inspect-btn">
                <span>View Full Design</span>
                <Eye size={13} />
              </span>
            </div>
          </div>
        )}

        <div className="esp-card-border-glow" />
      </div>
    </div>
  );
}

// ── Generic Showcase Page Component ──────────────────────────────────────────
export default function EcosystemShowcasePage({ data, type = 'apparel', extraContent = null }) {
  const [selectedCat, setSelectedCat] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const heroRef = useRef(null);

  const filteredItems = useMemo(() => {
    if (selectedCat === 'All') return data.items;
    return data.items.filter((i) => i.category === selectedCat);
  }, [data.items, selectedCat]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.esp-hero-line',
        { y: 70, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.12, duration: 0.9, ease: 'power3.out', delay: 0.2 }
      );
      gsap.fromTo(
        '.esp-hero-sub',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.6 }
      );
      gsap.fromTo(
        '.esp-stat-card',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out', delay: 0.8 }
      );
      gsap.fromTo(
        '.esp-filter-pill',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, stagger: 0.05, duration: 0.5, ease: 'back.out(1.5)', delay: 0.9 }
      );
    }, heroRef);

    return () => ctx.revert();
  }, [data.id]);

  // Keyboard close for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedItem(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="esp-root">
      {/* ── Navigation Bar ───────────────────────────────────────── */}
      <Navbar />

      {/* ── Hero Section ─────────────────────────────────────────── */}
      <section ref={heroRef} className="esp-hero" aria-label={data.name}>
        {/* Ambient 3D Glow Orbs */}
        <div className="esp-orb esp-orb-1" aria-hidden="true" />
        <div className="esp-orb esp-orb-2" aria-hidden="true" />

        <div className="container esp-hero-container">
          {/* Breadcrumb Back Link */}
          <Link to="/#services" className="esp-back-link" data-cursor="link">
            <ArrowLeft size={16} />
            <span>Back to Services & Ecosystem</span>
          </Link>

          <div className="esp-hero-grid">
            <div className="esp-hero-text">
              {/* Badge */}
              <div className="esp-badge">
                <Sparkles size={14} />
                <span>{data.badge}</span>
              </div>

              {/* Headline */}
              <h1 className="esp-title">
                <span className="esp-title-row"><span className="esp-hero-line">{data.name.toUpperCase()}</span></span>
                <span className="esp-title-row"><span className="esp-hero-line esp-gradient-text">{data.tagline}</span></span>
              </h1>

              {/* Subtitle */}
              <p className="esp-hero-sub body-lg">{data.subtitle}</p>

              {/* Stats Grid */}
              <div className="esp-stats-grid">
                {data.stats.map(({ value, label }) => (
                  <div key={label} className="esp-stat-card">
                    <span className="esp-stat-value">{value}</span>
                    <span className="esp-stat-label">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Module Cover Visual */}
            {data.coverImage && (
              <div className={`esp-hero-cover-wrap ${type === 'events' ? 'esp-hero-robo-wrap' : ''}`}>
                <img
                  src={data.coverImage}
                  alt={data.name}
                  className={`esp-hero-cover-img ${type === 'events' ? 'esp-hero-robo-img' : ''}`}
                />
                <div className="esp-cover-gradient" />
                {type !== 'apparel' && (
                  <div className="esp-cover-tag">
                    <CheckCircle2 size={13} />
                    <span>{type === 'events' ? 'AI Tactical Operator' : 'Verified In-House Module'}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Category Filter Bar (Hidden for Events page) */}
          {type !== 'events' && (
            <div className="esp-filter-bar">
              <div className="esp-filter-label">
                <Filter size={14} />
                <span>Filter Designs & Works:</span>
              </div>
              <div className="esp-filter-pills">
                {data.categories.map((cat) => (
                  <button
                    key={cat}
                    className={`esp-filter-pill ${selectedCat === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCat(cat)}
                    data-cursor="link"
                  >
                    {cat}
                    <span className="esp-filter-count">
                      {cat === 'All'
                        ? data.items.length
                        : data.items.filter((i) => i.category === cat).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 3D Showcase Grid ─────────────────────────────────────── */}
      <section className="esp-grid-section" aria-label="Showcase items">
        <div className="container">
          <div className="esp-grid-header">
            <div>
              <span className="label label-accent">{data.name} Showcase</span>
              <h2 className="heading-md">Explore Designs & Productions</h2>
            </div>
            <p className="body-sm esp-grid-note">
              Move cursor across cards to experience 3D perspective depth & specular light reflections. Click any photo to view full image.
            </p>
          </div>

          <div className="esp-cards-grid">
            {filteredItems.map((item, idx) => (
              <Showcase3DCard
                key={item.id}
                item={item}
                type={type}
                index={idx}
                onSelect={setSelectedItem}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Optional Extra Module Content (e.g. World Delivery Map) ── */}
      {extraContent}

      {/* ── Detail Inspection Lightbox Modal ─────────────────────── */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="esp-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            data-cursor="link"
          >
            <motion.div
              className={`esp-modal-card ${type === 'events' ? 'esp-modal-card--image-only' : ''}`}
              initial={{ scale: 0.9, y: 35, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 25, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="esp-modal-close"
                onClick={() => setSelectedItem(null)}
                aria-label="Close modal"
                data-cursor="link"
              >
                <X size={20} />
              </button>

              <div className={`esp-modal-body ${type === 'events' ? 'esp-modal-body--image-only' : ''}`}>
                {/* Media Image */}
                <div className="esp-modal-media" data-cursor="explore">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    className={`esp-modal-photo ${selectedItem.fitMode ? `esp-modal-photo--${selectedItem.fitMode}` : ''}`}
                  />
                  {type !== 'events' && type !== 'apparel' && <div className="esp-modal-badge">{selectedItem.category}</div>}
                </div>

                {/* Details (Hidden for Events page to show popup image only) */}
                {type !== 'events' && (
                  <div className="esp-modal-info">
                    <span className="esp-modal-mod-tag">{data.name}</span>
                    <h3 className="esp-modal-title">{selectedItem.title}</h3>
                    <p className="esp-modal-desc body-md">{selectedItem.desc}</p>

                    {/* Specifications Grid */}
                    <div className="esp-modal-specs-grid">
                      {selectedItem.fabric && (
                        <div className="esp-modal-spec-card">
                          <span className="esp-spec-title">Fabric Specification</span>
                          <span className="esp-spec-val">{selectedItem.fabric}</span>
                        </div>
                      )}
                      {selectedItem.print && (
                        <div className="esp-modal-spec-card">
                          <span className="esp-spec-title">Printing Method</span>
                          <span className="esp-spec-val">{selectedItem.print}</span>
                        </div>
                      )}
                      {selectedItem.fit && (
                        <div className="esp-modal-spec-card">
                          <span className="esp-spec-title">Fit & Silhouette</span>
                          <span className="esp-spec-val">{selectedItem.fit}</span>
                        </div>
                      )}
                      {selectedItem.colorway && (
                        <div className="esp-modal-spec-card">
                          <span className="esp-spec-title">Colorway Palette</span>
                          <span className="esp-spec-val">{selectedItem.colorway}</span>
                        </div>
                      )}
                      {selectedItem.altitude && (
                        <div className="esp-modal-spec-card">
                          <span className="esp-spec-title">Flight Altitude</span>
                          <span className="esp-spec-val">{selectedItem.altitude}</span>
                        </div>
                      )}
                      {selectedItem.camera && (
                        <div className="esp-modal-spec-card">
                          <span className="esp-spec-title">Camera & Drone Rig</span>
                          <span className="esp-spec-val">{selectedItem.camera}</span>
                        </div>
                      )}
                      {selectedItem.venue && (
                        <div className="esp-modal-spec-card">
                          <span className="esp-spec-title">Venue / Location</span>
                          <span className="esp-spec-val">{selectedItem.venue}</span>
                        </div>
                      )}
                      {selectedItem.scale && (
                        <div className="esp-modal-spec-card">
                          <span className="esp-spec-title">Event Scale</span>
                          <span className="esp-spec-val">{selectedItem.scale}</span>
                        </div>
                      )}
                      {selectedItem.client && (
                        <div className="esp-modal-spec-card">
                          <span className="esp-spec-title">Client / Brand</span>
                          <span className="esp-spec-val">{selectedItem.client}</span>
                        </div>
                      )}
                      {selectedItem.discipline && (
                        <div className="esp-modal-spec-card">
                          <span className="esp-spec-title">Design Discipline</span>
                          <span className="esp-spec-val">{selectedItem.discipline}</span>
                        </div>
                      )}
                    </div>

                    {/* Inquiry CTA */}
                    <div className="esp-modal-actions">
                      <Link
                        to="/#contact"
                        className="btn btn-primary esp-modal-inquire-btn"
                        data-cursor="link"
                        onClick={() => setSelectedItem(null)}
                      >
                        <MessageSquare size={16} />
                        <span>Inquire About Custom Order / Project</span>
                        <ExternalLink size={14} />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Conversion Section ───────────────────────────────────── */}
      <section className="esp-cta-section">
        <div className="container">
          <div className={`esp-cta-card ${type === 'events' ? 'esp-cta-card-events' : ''}`}>
            <div className="esp-cta-glow" />

            {type === 'events' && (
              <div className="esp-cta-robo-left">
                <img
                  src="/features/events-bottom-robo.png"
                  alt="The Events by Admirus Production Operator Robot"
                  className="esp-cta-robo-img"
                />
              </div>
            )}

            <div className="esp-cta-content">
              <span className="label label-accent">{data.name} Studio</span>
              <h2 className="heading-lg esp-cta-title">
                Ready to bring your vision to reality?
              </h2>
              <p className="body-lg esp-cta-desc">
                Connect directly with the {data.name} production team to get custom quotes, sample swatches, or production dates.
              </p>
              <div className="esp-cta-buttons">
                <Link to="/#contact" className="btn btn-primary" data-cursor="link">
                  <span>Start a Project with {data.name}</span>
                </Link>
                <Link to="/#services" className="btn btn-ghost" data-cursor="link">
                  <span>Explore Full Ecosystem</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
