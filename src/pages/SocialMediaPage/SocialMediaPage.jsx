import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from '../../lib/animations';
import {
  ArrowLeft, Share2, BarChart3, Users, Megaphone, Zap,
  X, ExternalLink, Sparkles, Filter, Eye
} from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import './SocialMediaPage.css';

// ── 24 Curated High-Aesthetic Social Media Images ────────────────────────────
const SOCIAL_GALLERY = [
  {
    id: 1,
    category: 'Campaigns',
    title: 'Neon Horizon Campaign',
    client: 'AURA Cyberwear',
    metric: '🔥 4.8M Views',
    engagement: '14.2%',
    desc: 'Viral multi-platform campaign targeting Gen-Z futurists with 3D kinetic visuals and interactive AR filters.',
    src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80&fit=crop',
    aspect: 'tall',
  },
  {
    id: 2,
    category: '3D & Motion',
    title: 'Kinetic Liquid Bloom',
    client: 'HyperSound Audio',
    metric: '⚡ +340% CTR',
    engagement: '11.8%',
    desc: 'Mesmerizing 3D fluid simulations synchronized to sub-bass frequencies for Instagram Reels and TikTok.',
    src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80&fit=crop',
    aspect: 'normal',
  },
  {
    id: 3,
    category: 'Visual Identity',
    title: 'Chromatic Geometry',
    client: 'Prism Cosmetics',
    metric: '✨ 9.6% Eng.',
    engagement: '9.6%',
    desc: 'Editorial grid system and high-contrast social cards designed for luxury cosmetic product rollouts.',
    src: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80&fit=crop',
    aspect: 'wide',
  },
  {
    id: 4,
    category: 'Reels & Shorts',
    title: 'Urban Velocity Teasers',
    client: 'Pulse Activewear',
    metric: '📈 2.2M Reach',
    engagement: '16.4%',
    desc: 'High-octane fast-paced video edits optimized for vertical retention and instant conversion.',
    src: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&q=80&fit=crop',
    aspect: 'tall',
  },
  {
    id: 5,
    category: 'Campaigns',
    title: 'Midnight Oasis Launch',
    client: 'Veloce Fragrances',
    metric: '💎 $480K Sales',
    engagement: '13.1%',
    desc: 'Dark moody aesthetic storytelling that elevated luxury lifestyle positioning across Instagram.',
    src: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80&fit=crop',
    aspect: 'normal',
  },
  {
    id: 6,
    category: 'Visual Identity',
    title: 'Editorial Typography System',
    client: 'Monolith Magazine',
    metric: '👁️ 850k Imp.',
    engagement: '10.5%',
    desc: 'Custom Swiss-inspired social typography templates driving 3x saves and bookmark metrics.',
    src: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&q=80&fit=crop',
    aspect: 'tall',
  },
  {
    id: 7,
    category: '3D & Motion',
    title: 'Glassmorphic Orb Showcase',
    client: 'Quantum Protocol',
    metric: '⚡ 3.1M Views',
    engagement: '15.8%',
    desc: 'Interactive 3D glass product renders showcasing holographic UI elements and futuristic shaders.',
    src: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&q=80&fit=crop',
    aspect: 'normal',
  },
  {
    id: 8,
    category: 'Campaigns',
    title: 'Solaris Energy Rebrand',
    client: 'Solaris Global',
    metric: '🔥 +420% Followers',
    engagement: '18.9%',
    desc: 'Comprehensive social rebranding that repositioned green tech as the undisputed modern standard.',
    src: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80&fit=crop',
    aspect: 'tall',
  },
  {
    id: 9,
    category: 'Reels & Shorts',
    title: 'Street Culture Capsule',
    client: 'Nomad Supply Co.',
    metric: '📈 6.8M Views',
    engagement: '19.2%',
    desc: 'Candid urban snapshots and micro-interviews establishing an authentic subcultural community.',
    src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80&fit=crop',
    aspect: 'normal',
  },
  {
    id: 10,
    category: 'Visual Identity',
    title: 'Minimalist Monochrome',
    client: 'Architectural Digest',
    metric: '✨ 12.4% Eng.',
    engagement: '12.4%',
    desc: 'Architectural minimalism translated into cohesive, high-conversion Instagram carousel stories.',
    src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&fit=crop',
    aspect: 'wide',
  },
  {
    id: 11,
    category: '3D & Motion',
    title: 'Voxel Hologram Series',
    client: 'Arcade X',
    metric: '⚡ 1.9M Plays',
    engagement: '14.0%',
    desc: 'Cyberpunk voxel animations created for viral TikTok teasers and community engagement drops.',
    src: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80&fit=crop',
    aspect: 'tall',
  },
  {
    id: 12,
    category: 'Campaigns',
    title: 'Elysian Summer Drop',
    client: 'Elysian Swimwear',
    metric: '💎 $720K Rev.',
    engagement: '17.3%',
    desc: 'Golden-hour visual campaign engineered for high ROAS on Meta and Pinterest social ads.',
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80&fit=crop',
    aspect: 'normal',
  },
  {
    id: 13,
    category: 'Reels & Shorts',
    title: 'Studio Process Chronicles',
    client: 'Craftsman Watchmakers',
    metric: '🔥 8.4M Views',
    engagement: '21.5%',
    desc: 'Mesmerizing macro ASMR footage of artisan watchmaking that captivated millions on YouTube Shorts.',
    src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80&fit=crop',
    aspect: 'tall',
  },
  {
    id: 14,
    category: 'Visual Identity',
    title: 'Cyberpunk Editorial',
    client: 'Kinetix Wear',
    metric: '👁️ 1.4M Imp.',
    engagement: '11.2%',
    desc: 'Futuristic fashion lookbook crafted for TikTok stories and immersive Pinterest moodboards.',
    src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80&fit=crop',
    aspect: 'normal',
  },
  {
    id: 15,
    category: '3D & Motion',
    title: 'Prismatic Light Refraction',
    client: 'Spectra Optics',
    metric: '⚡ 4.1M Views',
    engagement: '16.7%',
    desc: 'Optical raymarching visuals used as viral motion backdrops for luxury hardware announcements.',
    src: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80&fit=crop',
    aspect: 'normal',
  },
  {
    id: 16,
    category: 'Campaigns',
    title: 'Zero Waste Vanguard',
    client: 'EcoThread Collective',
    metric: '🌿 92K Shares',
    engagement: '18.4%',
    desc: 'Empowering community movement campaign that trended worldwide on Earth Day.',
    src: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80&fit=crop',
    aspect: 'wide',
  },
  {
    id: 17,
    category: 'Visual Identity',
    title: 'Sonic Waveforms & Vinyl',
    client: 'SubLow Records',
    metric: '✨ 750K Streams',
    engagement: '15.6%',
    desc: 'Music artist release assets featuring dynamic audio-reactive typography and tactile textures.',
    src: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80&fit=crop',
    aspect: 'tall',
  },
  {
    id: 18,
    category: 'Reels & Shorts',
    title: 'Culinary Alchemy Reels',
    client: 'L’Atelier Gourmet',
    metric: '🔥 5.6M Views',
    engagement: '22.1%',
    desc: 'Sensory gastronomy video snippets achieving a 48% viral bookmark rate on Instagram.',
    src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80&fit=crop',
    aspect: 'normal',
  },
  {
    id: 19,
    category: '3D & Motion',
    title: 'Metallic Metamorphosis',
    client: 'Titanium Labs',
    metric: '⚡ 2.8M Views',
    engagement: '13.9%',
    desc: 'Molten chrome physics simulation created for tech brand reveal teaser reels.',
    src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80&fit=crop',
    aspect: 'tall',
  },
  {
    id: 20,
    category: 'Campaigns',
    title: 'Night Runner Odyssey',
    client: 'Apex Athletic',
    metric: '💎 +260% ROAS',
    engagement: '14.8%',
    desc: 'Reflective apparel campaign designed for dark mode feeds with high visual contrast.',
    src: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&fit=crop',
    aspect: 'normal',
  },
  {
    id: 21,
    category: 'Visual Identity',
    title: 'Neo-Tokyo Editorial',
    client: 'Shibuya Sound',
    metric: '👁️ 1.8M Imp.',
    engagement: '13.5%',
    desc: 'Bilingual typography cards featuring street photography and neon gradient overlays.',
    src: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80&fit=crop',
    aspect: 'tall',
  },
  {
    id: 22,
    category: 'Reels & Shorts',
    title: 'Aerial Horizon Escapes',
    client: 'Wanderlust Journeys',
    metric: '📈 11.2M Views',
    engagement: '24.0%',
    desc: 'Breathtaking 4K vertical drone perspectives that sparked global travel trends.',
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80&fit=crop',
    aspect: 'normal',
  },
  {
    id: 23,
    category: '3D & Motion',
    title: 'Gravity Defiance Render',
    client: 'Aero Sneakers',
    metric: '⚡ 3.9M Views',
    engagement: '17.8%',
    desc: 'Floating footwear exploded-view animation created in Cinema4D for social hype drops.',
    src: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80&fit=crop',
    aspect: 'wide',
  },
  {
    id: 24,
    category: 'Campaigns',
    title: 'Luminescence Beauty Drop',
    client: 'Glow Aesthetics',
    metric: '✨ 380K Saves',
    engagement: '16.9%',
    desc: 'Iridescent macro beauty campaign turning routine skincare posts into viral art.',
    src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80&fit=crop',
    aspect: 'tall',
  },
];

const CATEGORIES = ['All', 'Campaigns', '3D & Motion', 'Visual Identity', 'Reels & Shorts'];

const STATS = [
  { icon: Megaphone, value: '250+', label: 'Campaigns Executed' },
  { icon: Users, value: '65M+', label: 'Organic Impressions' },
  { icon: BarChart3, value: '4.2×', label: 'Average ROAS' },
  { icon: Zap, value: '98.4%', label: 'Client Retention' },
];

// ── Vertical Attraction 3D Card Component ─────────────────────────────────────
function VerticalAttractionCard({ item, index, onSelect }) {
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

  // Calculate vertical attraction when mouse moves near this card
  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - cardCenterX) / (rect.width / 2); // -1 to 1
    const deltaY = (e.clientY - cardCenterY) / (rect.height / 2); // -1 to 1

    // Vertical attraction pulling card towards mouse in 3D
    const pullY = deltaY * 16;
    const rotX = -deltaY * 18;
    const rotY = deltaX * 18;

    const glareX = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const glareY = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    setTransform({
      rotX,
      rotY,
      transY: pullY,
      transZ: 45,
      scale: 1.035,
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
      className={`vac-card vac-card--${item.aspect}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(item)}
      data-cursor="explore"
      style={{
        transform: `perspective(1000px) translateY(${transform.transY}px) translateZ(${transform.transZ}px) rotateX(${transform.rotX}deg) rotateY(${transform.rotY}deg) scale(${transform.scale})`,
        transition: 'transform 0.18s cubic-bezier(0.2, 0.8, 0.4, 1), box-shadow 0.2s ease',
      }}
    >
      <div className="vac-card-inner">
        {/* Dynamic Specular Glare */}
        <div
          className="vac-card-glare"
          style={{
            background: `radial-gradient(circle at ${transform.glareX}% ${transform.glareY}%, rgba(249, 115, 22, 0.35) 0%, rgba(250, 204, 21, 0.15) 30%, transparent 70%)`,
            opacity: transform.glareOpacity,
          }}
        />

        {/* Image */}
        <img
          src={item.src}
          alt={item.title}
          className="vac-card-image"
          loading={index < 6 ? 'eager' : 'lazy'}
        />

        {/* Ambient Gradient Overlay */}
        <div className="vac-card-gradient" />

        {/* Floating Top Badges */}
        <div className="vac-card-top-badges">
          <span className="vac-category-badge">{item.category}</span>
          <span className="vac-metric-badge">{item.metric}</span>
        </div>

        {/* Floating Bottom Info */}
        <div className="vac-card-content">
          <span className="vac-client-tag">{item.client}</span>
          <h3 className="vac-card-title">{item.title}</h3>
          <div className="vac-card-footer">
            <span className="vac-eng-rate">
              <Sparkles size={12} />
              {item.engagement} Eng.
            </span>
            <span className="vac-view-btn">
              <Eye size={13} />
              View
            </span>
          </div>
        </div>

        {/* Border glow */}
        <div className="vac-card-border-glow" />
      </div>
    </div>
  );
}

// ── Main Page Component ──────────────────────────────────────────────────────
export default function SocialMediaPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [columnCount, setColumnCount] = useState(3);
  const heroRef = useRef(null);

  useEffect(() => {
    const updateCols = () => {
      if (window.innerWidth < 640) {
        setColumnCount(1);
      } else if (window.innerWidth < 1024) {
        setColumnCount(2);
      } else {
        setColumnCount(3);
      }
    };
    updateCols();
    window.addEventListener('resize', updateCols);
    return () => window.removeEventListener('resize', updateCols);
  }, []);

  // Filter gallery items
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return SOCIAL_GALLERY;
    return SOCIAL_GALLERY.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  // Distribute items into dynamic vertical columns for genuine vertical attraction flow
  const columns = useMemo(() => {
    const cols = Array.from({ length: columnCount }, () => []);
    filteredItems.forEach((item, i) => {
      cols[i % columnCount].push(item);
    });
    return cols;
  }, [filteredItems, columnCount]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.smp-hero-line',
        { y: 70, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.12, duration: 0.9, ease: 'power3.out', delay: 0.2 }
      );
      gsap.fromTo(
        '.smp-hero-sub',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.6 }
      );
      gsap.fromTo(
        '.smp-stat-box',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out', delay: 0.8 }
      );
      gsap.fromTo(
        '.vac-filter-pill',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, stagger: 0.05, duration: 0.5, ease: 'back.out(1.5)', delay: 0.9 }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Keyboard close for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedItem(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="smp-root">
      {/* ── Navigation Bar ───────────────────────────────────────── */}
      <Navbar />

      {/* ── Hero Section ─────────────────────────────────────────── */}
      <section ref={heroRef} className="smp-hero" aria-label="Social Media Services">
        {/* Background glow orbs */}
        <div className="smp-orb smp-orb-1" aria-hidden="true" />
        <div className="smp-orb smp-orb-2" aria-hidden="true" />

        <div className="container smp-hero-container">
          {/* Breadcrumb Back Link */}
          <Link to="/#services" className="smp-back-link" data-cursor="link">
            <ArrowLeft size={16} />
            <span>Back to Services</span>
          </Link>

          {/* Section Badge */}
          <div className="smp-badge">
            <Share2 size={15} />
            <span>Services & Showcase</span>
          </div>

          {/* Headline */}
          <h1 className="smp-title">
            <span className="smp-title-row"><span className="smp-hero-line">MAGNETIC SOCIAL.</span></span>
            <span className="smp-title-row"><span className="smp-hero-line smp-gradient-text">EXPONENTIAL REACH.</span></span>
          </h1>

          {/* Description */}
          <p className="smp-hero-sub body-lg">
            We architect high-impact social media narratives, 3D kinetic visuals, and viral
            campaign systems engineered to dominate feeds and turn casual scrollers into devoted brand advocates.
          </p>

          {/* Stats Grid */}
          <div className="smp-stats-grid">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="smp-stat-box">
                <div className="smp-stat-icon-wrap">
                  <Icon size={18} />
                </div>
                <div className="smp-stat-content">
                  <span className="smp-stat-number">{value}</span>
                  <span className="smp-stat-tag">{label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Category Filters */}
          <div className="vac-filter-bar">
            <div className="vac-filter-label">
              <Filter size={14} />
              <span>Filter Works:</span>
            </div>
            <div className="vac-filter-pills">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`vac-filter-pill ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                  data-cursor="link"
                >
                  {cat}
                  <span className="vac-pill-count">
                    {cat === 'All'
                      ? SOCIAL_GALLERY.length
                      : SOCIAL_GALLERY.filter((i) => i.category === cat).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Vertical Attraction 3D Grid Section ───────────────────── */}
      <section className="vac-grid-section" aria-label="3D Vertical Attraction Gallery">
        <div className="container vac-grid-container">
          <div className="vac-grid-intro">
            <div>
              <span className="label label-accent">3D Vertical Attraction Showcase</span>
              <h2 className="heading-md">Explore Our Creative Vault</h2>
            </div>
            <p className="body-sm vac-intro-note">
              Move cursor across cards to trigger vertical magnetic depth & 3D tilt. Click any card for project details.
            </p>
          </div>

          {/* 3-Column Vertical Attraction Stream */}
          <div
            className="vac-columns-wrapper"
            style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
          >
            {columns.map((columnItems, colIdx) => (
              <div
                key={`col-${colIdx}`}
                className={`vac-vertical-column vac-column-${colIdx + 1}`}
              >
                {columnItems.map((item, idx) => (
                  <VerticalAttractionCard
                    key={item.id}
                    item={item}
                    index={idx}
                    onSelect={setSelectedItem}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interactive Modal / Lightbox ─────────────────────────── */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="vac-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              className="vac-modal-card"
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="vac-modal-close"
                onClick={() => setSelectedItem(null)}
                aria-label="Close modal"
                data-cursor="link"
              >
                <X size={20} />
              </button>

              <div className="vac-modal-body">
                <div className="vac-modal-image-wrap">
                  <img
                    src={selectedItem.src}
                    alt={selectedItem.title}
                    className="vac-modal-image"
                  />
                  <div className="vac-modal-badge">{selectedItem.category}</div>
                </div>

                <div className="vac-modal-details">
                  <span className="vac-modal-client">{selectedItem.client}</span>
                  <h3 className="vac-modal-title">{selectedItem.title}</h3>
                  <p className="vac-modal-desc body-md">{selectedItem.desc}</p>

                  <div className="vac-modal-metrics">
                    <div className="vac-modal-metric-card">
                      <span className="vac-metric-label">Performance</span>
                      <span className="vac-metric-value">{selectedItem.metric}</span>
                    </div>
                    <div className="vac-modal-metric-card">
                      <span className="vac-metric-label">Avg. Engagement</span>
                      <span className="vac-metric-value">{selectedItem.engagement}</span>
                    </div>
                  </div>

                  <div className="vac-modal-actions">
                    <Link
                      to="/#contact"
                      className="btn btn-primary"
                      data-cursor="link"
                      onClick={() => setSelectedItem(null)}
                    >
                      <span>Inquire About Similar Project</span>
                      <ExternalLink size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Conversion Section ───────────────────────────────────── */}
      <section className="smp-cta-section">
        <div className="container">
          <div className="smp-cta-box">
            <div className="smp-cta-glow" />
            <span className="label label-accent">Ready To Go Exponential?</span>
            <h2 className="heading-lg smp-cta-title">
              Let's engineer your brand's next viral breakthrough.
            </h2>
            <p className="body-lg smp-cta-desc">
              From creative direction to full-funnel content production, our team turns social channels into high-converting revenue drivers.
            </p>
            <div className="smp-cta-buttons">
              <Link to="/#contact" className="btn btn-primary" data-cursor="link">
                <span>Start a Project</span>
              </Link>
              <Link to="/#work" className="btn btn-ghost" data-cursor="link">
                <span>View Full Portfolio</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
