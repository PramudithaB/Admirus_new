import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from '../../lib/animations';
import {
  ArrowLeft, Share2, BarChart3, Users, Megaphone, Zap,
  X, ExternalLink
} from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import './SocialMediaPage.css';

// ── 19 Authentic Client Works & High-Performance Social Visuals ──────────────
const SOCIAL_GALLERY = [
  {
    id: 1,
    category: 'Client Works',
    title: 'Great Technology Deserves Even Better Support',
    client: 'Copymoite Pvt Ltd',
    metric: '🔥 480K+ Reach',
    engagement: '14.8%',
    desc: 'Impactful 3D conceptual social visual for Copymoite Smart Boards highlighting premier customer support, career growth, and interactive educational technology.',
    src: '/social/copymoite-tech-support.jpg',
    aspect: 'normal',
    badge: 'Verified Client Work',
  },
  {
    id: 2,
    category: 'Client Works',
    title: 'Smart Board for Modern Classrooms',
    client: 'Copymoite Pvt Ltd',
    metric: '⚡ +320% Inquiries',
    engagement: '16.4%',
    desc: 'Interactive panel campaign highlighting 4K Ultra HD smart learning displays, wireless connectivity, and active student learning engagement.',
    src: '/social/copymoite-smartboard-classroom.jpg',
    aspect: 'normal',
    badge: 'Verified Client Work',
  },
  {
    id: 3,
    category: 'Client Works',
    title: 'සන්ධි වේදනාවට දිව්‍ය ඖෂධය — Sandi Shulahara Oil',
    client: 'Suwa Arana Ayurveda Wellness',
    metric: '🌿 350K+ Views',
    engagement: '18.6%',
    desc: 'Botanical 3D composition with carved wooden hands cradling the Sandi Shulahara herbal oil in a lush forest environment for authentic Ayurvedic joint relief.',
    src: '/social/suwa-arana-ayurveda-oil.jpg',
    aspect: 'normal',
    badge: 'Verified Client Work',
  },
  {
    id: 4,
    category: 'Client Works',
    title: 'Reclaim Your Confidence — Hair Patch Solutions',
    client: 'Hair Studio (Pvt) Ltd',
    metric: '💈 850K+ Impressions',
    engagement: '17.2%',
    desc: 'Bold typographic social campaign designed to break stigmas around hair loss, inspiring men to reclaim their confidence with non-surgical hair solutions.',
    src: '/social/hair-studio-reclaim-confidence.jpg',
    aspect: 'normal',
    badge: 'Verified Client Work',
  },
  {
    id: 5,
    category: 'Client Works',
    title: 'Hair Back. Confidence On — New Look',
    client: 'Hair Studio (Pvt) Ltd',
    metric: '✨ 4.2× Conversion',
    engagement: '19.1%',
    desc: 'High-contrast editorial portrait capturing the before-and-after transformation of non-surgical hair replacement in Ja-Ela.',
    src: '/social/hair-studio-new-look.jpg',
    aspect: 'normal',
    badge: 'Verified Client Work',
  },
  {
    id: 6,
    category: 'Client Works',
    title: 'Your Trusted Packaging Partner — Custom Branded Solutions',
    client: 'Rithu International Pvt Ltd',
    metric: '📦 +380% B2B Inquiries',
    engagement: '15.8%',
    desc: 'Commercial packaging showcase highlighting in-house 6-color printing, custom corporate poly bags, serviettes, and factory direct pricing.',
    src: '/social/rithu-packaging-partner.jpg',
    aspect: 'normal',
    badge: 'Verified Client Work',
  },
  {
    id: 7,
    category: 'Client Works',
    title: 'Crystal-Clear Glass — Hydrophobic Sensha Coating',
    client: 'Taiyo Carepoint',
    metric: '💎 520K+ Views',
    engagement: '18.2%',
    desc: 'Dynamic before-and-after split visual demonstrating high-durability self-cleaning protective glass coating for luxury automobiles in Mount Lavinia.',
    src: '/social/taiyo-carepoint-glass-coating.jpg',
    aspect: 'normal',
    badge: 'Verified Client Work',
  },
  {
    id: 8,
    category: 'Client Works',
    title: 'ශක්තිමත් වහලයක් — Unmatched Heavy-Duty Roofing Strength',
    client: 'Radex Zinc Aluminum',
    metric: '🐘 920K+ Reach',
    engagement: '21.4%',
    desc: 'Viral conceptual visual featuring a majestic full-grown elephant atop an industrial Radex roofing sheet structure, demonstrating supreme load-bearing resilience.',
    src: '/social/radex-roofing-sheet-strength.jpg',
    aspect: 'normal',
    badge: 'Verified Client Work',
  },
  {
    id: 9,
    category: 'Client Works',
    title: 'සබැඳි පුදුම — Heartfelt Moments & Distance Celebrations',
    client: 'Sabendi Suwa — Serenity Bridge',
    metric: '💜 640K+ Reach',
    engagement: '19.7%',
    desc: 'Emotional storytelling campaign connecting Sri Lankan expats worldwide with surprise birthday cakes, floral bouquets, and live streaming moments for elderly parents.',
    src: '/social/sabendi-surprise-delivery.jpg',
    aspect: 'normal',
    badge: 'Verified Client Work',
  },
  {
    id: 10,
    category: 'Client Works',
    title: 'Heavy-Duty Industrial Poly Rolls & Sheets',
    client: 'Rithu International Pvt Ltd',
    metric: '🏭 4.6× Orders',
    engagement: '14.5%',
    desc: 'Industrial B2B visual presentation of high-transparency, superior tensile strength poly rolls for factories, warehouses, and global exporters.',
    src: '/social/rithu-industrial-poly-rolls.jpg',
    aspect: 'normal',
    badge: 'Verified Client Work',
  },
  {
    id: 11,
    category: 'Client Works',
    title: 'Happy Children’s Day — Fashion Collection',
    client: 'Adole Fashion',
    metric: '👗 410K+ Reach',
    engagement: '17.8%',
    desc: 'Vibrant kids apparel showcase celebrating Children’s Day with joyful pastel silhouettes, playful aesthetics, and comfortable fashion styles.',
    src: '/social/adole-fashion-childrens-day.jpg',
    aspect: 'normal',
    badge: 'Verified Client Work',
  },
  {
    id: 12,
    category: 'Client Works',
    title: 'Eine neue Sprache, eine neue Welt — German Academy',
    client: 'Learn German with Mandakini',
    metric: '🎓 290K+ Views',
    engagement: '16.5%',
    desc: 'Inspiring educational campaign featuring a young student soaring across European landmarks on giant open book wings, promoting beginner German mastery.',
    src: '/social/learn-german-mandakini.jpg',
    aspect: 'normal',
    badge: 'Verified Client Work',
  },
  {
    id: 13,
    category: 'Client Works',
    title: 'පිට්ටු Craving එකට උණු උණු ගැමි රස',
    client: 'Athugalpura Gami Gedara',
    metric: '🍲 680K+ Views',
    engagement: '22.4%',
    desc: 'Mouthwatering traditional culinary social visual showcasing hot steamed red and white rice flour pittu with spicy curries, coconut milk, and lunumiris in Kurunegala.',
    src: '/social/gami-gedara-pittu-craving.jpg',
    aspect: 'normal',
    badge: 'Verified Client Work',
  },
  {
    id: 14,
    category: 'Client Works',
    title: 'A Little Chai, A Lot of Comfort — Chai Break එක',
    client: 'Athugalpura Gami Gedara',
    metric: '☕ 450K+ Reach',
    engagement: '18.9%',
    desc: 'Warm nostalgic visual storytelling illustrating a soothing hot chai break on a traditional village verandah in Kurunegala.',
    src: '/social/gami-gedara-chai-break.jpg',
    aspect: 'normal',
    badge: 'Verified Client Work',
  },
  {
    id: 15,
    category: 'Client Works',
    title: 'Beat The Warm Afternoon — Ice-Cold Mint Drink',
    client: 'CeylonLagos',
    metric: '🍹 520K+ Views',
    engagement: '20.1%',
    desc: 'Invigorating beverage creative featuring vibrant lime slices, ice splashes, and fresh mint leaves for lakeside Kurunegala & Kaduwela cafes.',
    src: '/social/ceylon-lagos-mint-drink.jpg',
    aspect: 'normal',
    badge: 'Verified Client Work',
  },
  {
    id: 16,
    category: 'Client Works',
    title: 'Gleamz Professional Cleaning Services',
    client: 'Gleamz (Australia)',
    metric: '✨ 380K+ Reach',
    engagement: '18.4%',
    desc: 'Comprehensive commercial & residential cleaning services campaign in Australia, featuring full-spectrum service listings, team presentation, and direct contact CTAs.',
    src: '/social/gleamz-cleaning-our-services.jpg',
    aspect: 'normal',
    badge: 'Verified Client Work',
  },
  {
    id: 17,
    category: 'Client Works',
    title: 'Friday Chaos to Monday Magic — Commercial Reset',
    client: 'Gleamz (Australia)',
    metric: '🚀 510K+ Impressions',
    engagement: '20.6%',
    desc: 'High-concept B2B office cleaning visual emphasizing seamless weekend office transformations for a fresh start on Monday mornings.',
    src: '/social/gleamz-friday-chaos-monday-magic.jpg',
    aspect: 'normal',
    badge: 'Verified Client Work',
  },
  {
    id: 18,
    category: 'Client Works',
    title: 'ස්වභාවික ශක්තියේ දේශීය බලය — Holistic Diabetes & Nerve Care',
    client: 'Suwa Arana Ayurveda Wellness',
    metric: '🌿 620K+ Views',
    engagement: '21.8%',
    desc: 'Authentic Ayurvedic healthcare visual addressing diabetes management, nervous vitality, and natural healing treatments in Horana & Dompe.',
    src: '/social/suwa-arana-diabetes-nerve-treatment.jpg',
    aspect: 'normal',
    badge: 'Verified Client Work',
  },
  {
    id: 19,
    category: 'Client Works',
    title: 'සුව අරණට පැමිණෙන්න පෙර සහ පසු — Mobility Transformation',
    client: 'Suwa Arana Ayurveda Wellness',
    metric: '🌟 740K+ Reach',
    engagement: '23.5%',
    desc: 'Compelling high-contrast before-and-after mobility campaign illustrating restoration of walking freedom and pain relief through traditional Ayurvedic medicine.',
    src: '/social/suwa-arana-before-after-recovery.jpg',
    aspect: 'normal',
    badge: 'Verified Client Work',
  },
  {
    id: 20,
    category: 'Client Works',
    title: 'Gift of Nature — Herbal Body Wash',
    client: 'Suwa Arana Ayurveda Wellness',
    metric: '🌿 590K+ Views',
    engagement: '21.2%',
    desc: 'Gentle on skin, tough on impurities. Sensory botanical visual featuring natural waterfall freshness and pure herbal skincare experience.',
    src: '/social/suwa-arana-herbal-body-wash.jpg',
    aspect: 'normal',
    badge: 'Verified Client Work',
  },
  {
    id: 21,
    category: 'Client Works',
    title: 'You Dream It. We Bake It. — Custom Cakes',
    client: 'Ministry Of Cakes & Bakes',
    metric: '🎂 480K+ Reach',
    engagement: '19.8%',
    desc: 'Artisanal cake craft showcase with chocolate drips, edible gold spheres, and fresh strawberries for weddings, birthdays, and celebrations in Kurunegala & Kaduwela.',
    src: '/social/ministry-of-cakes-you-dream-we-bake.jpg',
    aspect: 'normal',
    badge: 'Verified Client Work',
  },
  {
    id: 22,
    category: 'Client Works',
    title: 'One Bite, Instant Happiness — Gourmet Pastries',
    client: 'Ministry Of Cakes & Bakes',
    metric: '✨ 670K+ Views',
    engagement: '22.9%',
    desc: 'Vibrant, joyful celebration of fresh bakery delicacies and instant sweetness crafted with love for Kurunegala and Kaduwela dessert lovers.',
    src: '/social/ministry-of-cakes-instant-happiness.jpg',
    aspect: 'normal',
    badge: 'Verified Client Work',
  },
];

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

        {/* Clean, un-obscured campaign artwork */}
        <img
          src={item.src}
          alt={item.title}
          className="vac-card-image"
          loading={index < 6 ? 'eager' : 'lazy'}
        />

        {/* Subtle border glow */}
        <div className="vac-card-border-glow" />
      </div>
    </div>
  );
}

// ── Main Page Component ──────────────────────────────────────────────────────
export default function SocialMediaPage() {
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

  // Distribute items into dynamic vertical columns for genuine vertical attraction flow
  const columns = useMemo(() => {
    const cols = Array.from({ length: columnCount }, () => []);
    SOCIAL_GALLERY.forEach((item, i) => {
      cols[i % columnCount].push(item);
    });
    return cols;
  }, [columnCount]);

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
