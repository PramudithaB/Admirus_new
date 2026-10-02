import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from '../../lib/animations';
import {
  ArrowLeft, Users, Sparkles, Filter,
  ArrowUpRight, X, Briefcase, Award, MessageSquare
} from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import { teamMembers, teamDepartments } from '../../data/team';
import './TeamPage.css';

function LinkedinIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.66 1.66 0 0 0-1.66 1.66 1.66 1.66 0 0 0 1.66 1.66 1.66 1.66 0 0 0 1.66-1.66 1.66 1.66 0 0 0-1.66-1.66Z" />
    </svg>
  );
}

function TwitterIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

// ── Interactive 3D Holographic Team Member Card ─────────────────────────────
function TeamMember3DCard({ member, index, onSelect }) {
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

    const deltaX = (e.clientX - cx) / (rect.width / 2); // -1 to 1
    const deltaY = (e.clientY - cy) / (rect.height / 2); // -1 to 1

    const rotX = -deltaY * 16;
    const rotY = deltaX * 16;
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
      className={`team-3d-card ${member.featured ? 'team-card-featured' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(member)}
      data-cursor="explore"
      style={{
        transform: `perspective(1000px) translateY(${transform.transY}px) translateZ(${transform.transZ}px) rotateX(${transform.rotX}deg) rotateY(${transform.rotY}deg) scale(${transform.scale})`,
        transition: 'transform 0.16s cubic-bezier(0.2, 0.8, 0.4, 1), box-shadow 0.2s ease',
      }}
    >
      <div className="team-card-inner">
        {/* Dynamic Specular Light Glare */}
        <div
          className="team-card-glare"
          style={{
            background: `radial-gradient(circle at ${transform.glareX}% ${transform.glareY}%, rgba(249, 115, 22, 0.35) 0%, rgba(250, 204, 21, 0.15) 35%, transparent 70%)`,
            opacity: transform.glareOpacity,
          }}
        />

        {/* 3D Floating Avatar Frame */}
        <div className="team-card-media" style={{ transform: 'translateZ(30px)' }}>
          <img
            src={member.image}
            alt={member.name}
            className="team-card-photo"
            loading={index < 4 ? 'eager' : 'lazy'}
          />
          <div className="team-card-media-gradient" />

          {/* Experience Badge */}
          <div className="team-card-exp-badge" style={{ transform: 'translateZ(45px)' }}>
            <Award size={12} />
            <span>{member.experience}</span>
          </div>

          {/* Social Quick-Actions in 3D */}
          <div className="team-card-socials" style={{ transform: 'translateZ(50px)' }}>
            <a
              href={member.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="team-social-btn"
              onClick={(e) => e.stopPropagation()}
              aria-label="LinkedIn"
              data-cursor="link"
            >
              <LinkedinIcon size={13} />
            </a>
            <a
              href={member.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="team-social-btn"
              onClick={(e) => e.stopPropagation()}
              aria-label="Twitter"
              data-cursor="link"
            >
              <TwitterIcon size={13} />
            </a>
            <a
              href={member.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="team-social-btn"
              onClick={(e) => e.stopPropagation()}
              aria-label="Instagram"
              data-cursor="link"
            >
              <InstagramIcon size={13} />
            </a>
          </div>
        </div>

        {/* Card Body Info in 3D */}
        <div className="team-card-content" style={{ transform: 'translateZ(40px)' }}>
          <span className="team-card-dept">{member.department}</span>
          <h3 className="team-card-name">{member.name}</h3>
          <p className="team-card-role">{member.role}</p>

          <p className="team-card-bio body-sm">{member.bio}</p>

          {/* Skills Chips */}
          <div className="team-card-skills" style={{ transform: 'translateZ(25px)' }}>
            {member.skills.slice(0, 3).map((skill) => (
              <span key={skill} className="team-skill-tag">
                {skill}
              </span>
            ))}
          </div>

          {/* Card Footer action */}
          <div className="team-card-footer">
            <span className="team-inspect-btn">
              <span>View Profile</span>
              <ArrowUpRight size={13} />
            </span>
          </div>
        </div>

        {/* Ambient border glow */}
        <div className="team-card-border-glow" />
      </div>
    </div>
  );
}

// ── Main Team Page Component ────────────────────────────────────────────────
export default function TeamPage() {
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedMember, setSelectedMember] = useState(null);
  const heroRef = useRef(null);

  // Filter team members based on department
  const filteredTeam = useMemo(() => {
    if (selectedDept === 'All') return teamMembers;
    return teamMembers.filter((m) => m.department === selectedDept);
  }, [selectedDept]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.team-hero-line',
        { y: 70, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.12, duration: 0.9, ease: 'power3.out', delay: 0.2 }
      );
      gsap.fromTo(
        '.team-hero-sub',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.6 }
      );
      gsap.fromTo(
        '.team-stat-card',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out', delay: 0.8 }
      );
      gsap.fromTo(
        '.team-filter-pill',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, stagger: 0.05, duration: 0.5, ease: 'back.out(1.5)', delay: 0.9 }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Keyboard close for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedMember(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="team-page-root">
      {/* ── Navigation Bar ───────────────────────────────────────── */}
      <Navbar />

      {/* ── Hero Section ─────────────────────────────────────────── */}
      <section ref={heroRef} className="team-hero" aria-label="Admirus Team">
        {/* Ambient 3D Glow Orbs */}
        <div className="team-orb team-orb-1" aria-hidden="true" />
        <div className="team-orb team-orb-2" aria-hidden="true" />

        <div className="container team-hero-container">
          {/* Breadcrumb Back Link */}
          <Link to="/" className="team-back-link" data-cursor="link">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>

          {/* Section Badge */}
          <div className="team-badge">
            <Users size={15} />
            <span>The Collective</span>
          </div>

          {/* Headline */}
          <h1 className="team-title">
            <span className="team-title-row"><span className="team-hero-line">ARCHITECTS OF</span></span>
            <span className="team-title-row"><span className="team-hero-line team-gradient-text">THE BRAND UNIVERSE.</span></span>
          </h1>

          {/* Subtitle */}
          <p className="team-hero-sub body-lg">
            We are brand strategists, 3D interactive developers, aerial drone pioneers, and visual artists.
            United by a single obsession: creating high-performance digital legacies that dominate cultures.
          </p>

          {/* Key Metrics Row */}
          <div className="team-stats-grid">
            <div className="team-stat-card">
              <span className="team-stat-value">15+</span>
              <span className="team-stat-label">Visionary Specialists</span>
            </div>
            <div className="team-stat-card">
              <span className="team-stat-value">135+</span>
              <span className="team-stat-label">Iconic Projects Built</span>
            </div>
            <div className="team-stat-card">
              <span className="team-stat-value">99.8%</span>
              <span className="team-stat-label">Strategic Success Rate</span>
            </div>
            <div className="team-stat-card">
              <span className="team-stat-value">1,200+</span>
              <span className="team-stat-label">Aerial Flight Hours</span>
            </div>
          </div>

          {/* Department Filter Bar */}
          <div className="team-filter-bar">
            <div className="team-filter-label">
              <Filter size={14} />
              <span>Filter by Department:</span>
            </div>
            <div className="team-filter-pills">
              {teamDepartments.map((dept) => (
                <button
                  key={dept}
                  className={`team-filter-pill ${selectedDept === dept ? 'active' : ''}`}
                  onClick={() => setSelectedDept(dept)}
                  data-cursor="link"
                >
                  {dept}
                  <span className="team-filter-count">
                    {dept === 'All'
                      ? teamMembers.length
                      : teamMembers.filter((m) => m.department === dept).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3D Team Grid Section ─────────────────────────────────── */}
      <section className="team-grid-section" aria-label="Team Members Grid">
        <div className="container">
          <div className="team-grid-header">
            <div>
              <span className="label label-accent">Meet Our Specialists</span>
              <h2 className="heading-md">Minds Behind the Magic</h2>
            </div>
            <p className="body-sm team-grid-note">
              Hover over each profile to experience 3D depth tilt & holographic reflections. Click to view full dossier.
            </p>
          </div>

          <div className="team-cards-grid">
            {filteredTeam.map((member, idx) => (
              <TeamMember3DCard
                key={member.id}
                member={member}
                index={idx}
                onSelect={setSelectedMember}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Interactive 3D Member Dossier Modal ──────────────────── */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            className="team-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              className="team-modal-card"
              initial={{ scale: 0.9, y: 35, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 25, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="team-modal-close"
                onClick={() => setSelectedMember(null)}
                aria-label="Close modal"
                data-cursor="link"
              >
                <X size={20} />
              </button>

              <div className="team-modal-body">
                {/* Left Side: Photo & Quote */}
                <div className="team-modal-media">
                  <img
                    src={selectedMember.image}
                    alt={selectedMember.name}
                    className="team-modal-photo"
                  />
                  <div className="team-modal-media-overlay" />
                  <div className="team-modal-quote-box">
                    <Sparkles size={16} className="team-modal-quote-icon" />
                    <p className="team-modal-quote">"{selectedMember.quote}"</p>
                  </div>
                </div>

                {/* Right Side: Details & Skills */}
                <div className="team-modal-info">
                  <span className="team-modal-dept">{selectedMember.department}</span>
                  <h3 className="team-modal-name">{selectedMember.name}</h3>
                  <p className="team-modal-role">{selectedMember.role}</p>

                  <div className="team-modal-exp-tag">
                    <Briefcase size={14} />
                    <span>{selectedMember.experience}</span>
                  </div>

                  <p className="team-modal-bio body-md">{selectedMember.bio}</p>

                  <div className="team-modal-skills-section">
                    <span className="team-modal-section-title">Core Competencies</span>
                    <div className="team-modal-skills-grid">
                      {selectedMember.skills.map((skill) => (
                        <div key={skill} className="team-modal-skill-chip">
                          <Sparkles size={11} />
                          <span>{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Social Buttons & Contact */}
                  <div className="team-modal-actions">
                    <div className="team-modal-socials">
                      <a
                        href={selectedMember.socials.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="team-modal-social-btn"
                        data-cursor="link"
                      >
                        <LinkedinIcon size={15} />
                        <span>LinkedIn</span>
                      </a>
                      <a
                        href={selectedMember.socials.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="team-modal-social-btn"
                        data-cursor="link"
                      >
                        <TwitterIcon size={15} />
                        <span>Twitter</span>
                      </a>
                      <a
                        href={selectedMember.socials.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="team-modal-social-btn"
                        data-cursor="link"
                      >
                        <InstagramIcon size={15} />
                        <span>Instagram</span>
                      </a>
                    </div>

                    <Link
                      to="/#contact"
                      className="btn btn-primary team-modal-contact-btn"
                      data-cursor="link"
                      onClick={() => setSelectedMember(null)}
                    >
                      <MessageSquare size={16} />
                      <span>Start a Project with Our Team</span>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom Call To Action ─────────────────────────────────── */}
      <section className="team-cta-section">
        <div className="container">
          <div className="team-cta-card">
            <div className="team-cta-glow" />
            <span className="label label-accent">Join The Circle</span>
            <h2 className="heading-lg team-cta-title">
              Ready to create something legendary together?
            </h2>
            <p className="body-lg team-cta-desc">
              Whether you're looking for high-performance brand engineering or want to join our creative roster, our team is ready to talk.
            </p>
            <div className="team-cta-buttons">
              <Link to="/#contact" className="btn btn-primary" data-cursor="link">
                <span>Start a Project</span>
              </Link>
              <Link to="/services" className="btn btn-ghost" data-cursor="link">
                <span>Explore All Services</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
