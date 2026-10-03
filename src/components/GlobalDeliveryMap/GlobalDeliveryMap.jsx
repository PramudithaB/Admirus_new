import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe2, Plane, Package, Clock, ShieldCheck,
  CheckCircle2, Sparkles, Navigation, ArrowUpRight,
  TrendingUp, MapPin, Truck
} from 'lucide-react';
import {
  srilankaOrigin,
  deliveryDestinations,
  worldContinentDots,
  calculateFlightPath
} from './worldDotsData';
import './GlobalDeliveryMap.css';

export default function GlobalDeliveryMap() {
  const [activeDestination, setActiveDestination] = useState(deliveryDestinations[0]); // default to UK
  const [hoveredDest, setHoveredDest] = useState(null);
  const [filterRegion, setFilterRegion] = useState('All');
  const mapContainerRef = useRef(null);

  // Group destinations by region for tab filtering
  const regions = useMemo(() => ['All', 'Americas', 'Europe', 'Asia & Middle East', 'Oceania'], []);

  const filteredDestinations = useMemo(() => {
    if (filterRegion === 'All') return deliveryDestinations;
    if (filterRegion === 'Americas') {
      return deliveryDestinations.filter(d => ['United States', 'Canada'].includes(d.country));
    }
    if (filterRegion === 'Europe') {
      return deliveryDestinations.filter(d => ['United Kingdom', 'Germany', 'France', 'Italy'].includes(d.country));
    }
    if (filterRegion === 'Asia & Middle East') {
      return deliveryDestinations.filter(d => ['United Arab Emirates', 'Singapore', 'Japan', 'Maldives', 'Qatar'].includes(d.country));
    }
    if (filterRegion === 'Oceania') {
      return deliveryDestinations.filter(d => ['Australia'].includes(d.country));
    }
    return deliveryDestinations;
  }, [filterRegion]);

  const currentSelection = hoveredDest || activeDestination;

  return (
    <section className="gdm-section" aria-label="Global Delivery Network">
      <div className="container">
        {/* ── Section Header ────────────────────────────────────── */}
        <div className="gdm-header">
          <div className="gdm-badge">
            <Globe2 size={15} />
            <span>Global Export & Worldwide Delivery Network</span>
          </div>

          <h2 className="heading-lg gdm-title">
            Crafted in Sri Lanka.<br />
            <span className="gdm-gradient-text">Delivered to the World.</span>
          </h2>

          <p className="body-lg gdm-sub">
            From our dedicated apparel manufacturing and screen-printing facilities in Colombo, <strong>Sri Lanka</strong>,
            Hi Cloth produces and exports custom streetwear, premium oversized tees, and bespoke merchandise to premier brands across 38+ countries worldwide.
          </p>

          {/* Quick Metrics Bar */}
          <div className="gdm-metrics-bar">
            <div className="gdm-metric-item">
              <span className="gdm-metric-num">38+</span>
              <span className="gdm-metric-lbl">Export Countries</span>
            </div>
            <div className="gdm-metric-divider" />
            <div className="gdm-metric-item">
              <span className="gdm-metric-num">120K+</span>
              <span className="gdm-metric-lbl">T-Shirts Dispatched</span>
            </div>
            <div className="gdm-metric-divider" />
            <div className="gdm-metric-item">
              <span className="gdm-metric-num">3-5 Days</span>
              <span className="gdm-metric-lbl">DHL Express Air Transit</span>
            </div>
            <div className="gdm-metric-divider" />
            <div className="gdm-metric-item">
              <span className="gdm-metric-num">100%</span>
              <span className="gdm-metric-lbl">Sri Lankan Craftsmanship</span>
            </div>
          </div>
        </div>

        {/* ── Region Filter Tabs ─────────────────────────────────── */}
        <div className="gdm-region-tabs">
          <span className="gdm-tabs-label">Filter Delivery Hubs:</span>
          <div className="gdm-tabs-group">
            {regions.map((reg) => (
              <button
                key={reg}
                className={`gdm-tab-btn ${filterRegion === reg ? 'active' : ''}`}
                onClick={() => setFilterRegion(reg)}
                data-cursor="link"
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        {/* ── Dotted World Map Visual Card ────────────────────────── */}
        <div className="gdm-map-card" ref={mapContainerRef}>
          {/* Ambient card glows */}
          <div className="gdm-card-glow gdm-card-glow-1" />
          <div className="gdm-card-glow gdm-card-glow-2" />

          {/* Top Status Bar on Map */}
          <div className="gdm-map-status-bar">
            <div className="gdm-status-live">
              <span className="gdm-live-indicator" />
              <span>LIVE GLOBAL SHIPPING MATRIX & ACTIVE DISPATCH ROUTES</span>
            </div>
            <div className="gdm-origin-pill">
              <MapPin size={13} className="gdm-pin-icon" />
              <span>Origin Hub: <strong>Colombo, Sri Lanka</strong></span>
            </div>
          </div>

          {/* ── SVG Dotted World Map ─────────────────────────────── */}
          <div className="gdm-svg-wrapper">
            <svg
              viewBox="0 0 1000 500"
              className="gdm-world-svg"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Neon Glow Filters */}
                <filter id="gdm-glow-orange" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <filter id="gdm-glow-gold" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Linear Gradients for Delivery Paths */}
                <linearGradient id="gdm-path-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#facc15" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.7" />
                </linearGradient>

                <linearGradient id="gdm-active-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="1" />
                  <stop offset="50%" stopColor="#facc15" stopOpacity="1" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="1" />
                </linearGradient>

                {/* Radar Gradient for Sri Lanka Origin */}
                <radialGradient id="gdm-origin-radar" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.6" />
                  <stop offset="60%" stopColor="#facc15" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Background Lat/Long Grid Parallels */}
              <g className="gdm-grid-lines" opacity="0.12">
                <line x1="0" y1="125" x2="1000" y2="125" stroke="#ffffff" strokeDasharray="3 6" />
                <line x1="0" y1="250" x2="1000" y2="250" stroke="#f97316" strokeDasharray="4 6" opacity="0.3" />
                <line x1="0" y1="375" x2="1000" y2="375" stroke="#ffffff" strokeDasharray="3 6" />
                <line x1="250" y1="0" x2="250" y2="500" stroke="#ffffff" strokeDasharray="3 6" />
                <line x1="500" y1="0" x2="500" y2="500" stroke="#ffffff" strokeDasharray="3 6" />
                <line x1="750" y1="0" x2="750" y2="500" stroke="#ffffff" strokeDasharray="3 6" />
              </g>

              {/* ── 1. Dotted World Map Continents ─────────────────── */}
              <g className="gdm-continent-dots">
                {worldContinentDots.map((dot, i) => (
                  <circle
                    key={i}
                    cx={dot.x}
                    cy={dot.y}
                    r={i % 7 === 0 ? 1.7 : 1.3}
                    className="gdm-matrix-dot"
                    opacity={i % 5 === 0 ? 0.35 : 0.22}
                  />
                ))}
              </g>

              {/* ── 2. Curved Delivery Lines from Sri Lanka ────────── */}
              <g className="gdm-flight-paths">
                {deliveryDestinations.map((dest, idx) => {
                  const isSelected = currentSelection?.id === dest.id;
                  const isFiltered = filteredDestinations.some(d => d.id === dest.id);
                  const pathD = calculateFlightPath(srilankaOrigin.coords, dest.coords, dest.arcHeight || 1);

                  return (
                    <g key={dest.id} className={`gdm-path-group ${isSelected ? 'active' : ''}`}>
                      {/* Base static faint path */}
                      <path
                        d={pathD}
                        fill="none"
                        className="gdm-base-curve"
                        stroke={isSelected ? 'rgba(250, 204, 21, 0.4)' : isFiltered ? 'rgba(249, 115, 22, 0.18)' : 'rgba(255, 255, 255, 0.05)'}
                        strokeWidth={isSelected ? 2 : 1}
                      />

                      {/* Animated dashed delivery stream */}
                      {isFiltered && (
                        <path
                          d={pathD}
                          fill="none"
                          className="gdm-flow-curve"
                          stroke={isSelected ? 'url(#gdm-active-grad)' : 'url(#gdm-path-grad)'}
                          strokeWidth={isSelected ? 2.4 : 1.2}
                          strokeDasharray="6 8"
                          strokeLinecap="round"
                          filter={isSelected ? 'url(#gdm-glow-gold)' : undefined}
                        />
                      )}

                      {/* Moving light pulse packet along curve */}
                      {isFiltered && (
                        <circle
                          r={isSelected ? 3.5 : 2.2}
                          fill={isSelected ? '#38bdf8' : '#facc15'}
                          filter="url(#gdm-glow-orange)"
                        >
                          <animateMotion
                            path={pathD}
                            dur={`${2.6 + (idx % 4) * 0.5}s`}
                            repeatCount="indefinite"
                            begin={`${(idx * 0.25) % 2.5}s`}
                          />
                        </circle>
                      )}
                    </g>
                  );
                })}
              </g>

              {/* ── 3. Destination City Nodes ───────────────────────── */}
              <g className="gdm-destinations">
                {deliveryDestinations.map((dest) => {
                  const isSelected = currentSelection?.id === dest.id;
                  const isFiltered = filteredDestinations.some(d => d.id === dest.id);

                  return (
                    <g
                      key={dest.id}
                      transform={`translate(${dest.coords.x}, ${dest.coords.y})`}
                      className={`gdm-dest-node ${isSelected ? 'selected' : ''}`}
                      onClick={() => setActiveDestination(dest)}
                      onMouseEnter={() => setHoveredDest(dest)}
                      onMouseLeave={() => setHoveredDest(null)}
                      data-cursor="explore"
                      style={{ cursor: 'pointer', opacity: isFiltered ? 1 : 0.25 }}
                    >
                      {/* Pulse sonar wave */}
                      <circle
                        r="3.5"
                        fill="none"
                        stroke={isSelected ? '#38bdf8' : '#f97316'}
                        strokeWidth="1.5"
                        className="gdm-ping-ring"
                      />

                      {/* Glow halo */}
                      <circle
                        r={isSelected ? 8 : 5}
                        fill={isSelected ? 'rgba(56, 189, 248, 0.35)' : 'rgba(249, 115, 22, 0.22)'}
                      />

                      {/* Core node dot */}
                      <circle
                        r={isSelected ? 4 : 2.8}
                        fill={isSelected ? '#ffffff' : '#f97316'}
                        stroke={isSelected ? '#38bdf8' : '#fed7aa'}
                        strokeWidth="1"
                        filter="url(#gdm-glow-orange)"
                      />

                      {/* City label text (visible for highlights or selected) */}
                      {(dest.highlight || isSelected) && (
                        <text
                          y="-9"
                          textAnchor="middle"
                          className="gdm-dest-label"
                          fill={isSelected ? '#ffffff' : '#a1a1aa'}
                        >
                          {dest.city}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>

              {/* ── 4. Sri Lanka Hub Origin Beacon ───────────────────── */}
              <g
                transform={`translate(${srilankaOrigin.coords.x}, ${srilankaOrigin.coords.y})`}
                className="gdm-origin-beacon"
              >
                {/* Multi-tier expanding radar ripples */}
                <circle r="6" fill="none" stroke="#f97316" strokeWidth="1.5" className="gdm-radar-1" />
                <circle r="12" fill="none" stroke="#facc15" strokeWidth="1.2" className="gdm-radar-2" />
                <circle r="20" fill="none" stroke="#f97316" strokeWidth="0.8" className="gdm-radar-3" />

                {/* Radar background aura */}
                <circle r="22" fill="url(#gdm-origin-radar)" />

                {/* Central beacon center */}
                <circle r="5" fill="#facc15" filter="url(#gdm-glow-gold)" />
                <circle r="2.8" fill="#ffffff" />

                {/* Origin Pin Banner Label */}
                <g transform="translate(0, 18)">
                  <rect
                    x="-55"
                    y="0"
                    width="110"
                    height="18"
                    rx="9"
                    fill="rgba(249, 115, 22, 0.25)"
                    stroke="rgba(249, 115, 22, 0.6)"
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y="12"
                    textAnchor="middle"
                    fill="#facc15"
                    fontSize="9.5"
                    fontWeight="700"
                    letterSpacing="0.05em"
                  >
                    ★ SRI LANKA (HQ)
                  </text>
                </g>
              </g>
            </svg>
          </div>

          {/* ── Interactive Info Card for Selected Destination ───── */}
          <div className="gdm-active-detail-card">
            <div className="gdm-detail-header">
              <div className="gdm-detail-flag-wrap">
                <span className="gdm-flag-icon">{currentSelection.flag}</span>
                <div>
                  <h4 className="gdm-dest-country-title">
                    {currentSelection.city}, {currentSelection.country}
                  </h4>
                  <span className="gdm-dest-route-tag">
                    Route: Colombo, Sri Lanka ➔ {currentSelection.city}
                  </span>
                </div>
              </div>

              <div className="gdm-detail-transit-badge">
                <Clock size={13} />
                <span>{currentSelection.transitTime} Air Transit</span>
              </div>
            </div>

            <div className="gdm-detail-grid">
              <div className="gdm-detail-stat">
                <span className="gdm-detail-stat-lbl">Dispatched Quantity</span>
                <span className="gdm-detail-stat-val gdm-color-accent">
                  <Package size={14} />
                  {currentSelection.volume}
                </span>
              </div>

              <div className="gdm-detail-stat">
                <span className="gdm-detail-stat-lbl">International Carrier</span>
                <span className="gdm-detail-stat-val">
                  <Truck size={14} />
                  {currentSelection.courier}
                </span>
              </div>

              <div className="gdm-detail-stat gdm-stat-full">
                <span className="gdm-detail-stat-lbl">Popular Order Specifications in {currentSelection.country}</span>
                <span className="gdm-detail-stat-val">
                  <Sparkles size={14} className="gdm-sparkle-icon" />
                  {currentSelection.popularStyle}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Quick Destination Selector Cards Carousel ──────────── */}
        <div className="gdm-dest-cards-wrap">
          <div className="gdm-dest-cards-header">
            <span className="label label-accent">Worldwide Export Destinations</span>
            <p className="body-sm">Click any destination to illuminate its direct air delivery line from Sri Lanka:</p>
          </div>

          <div className="gdm-dest-cards-scroll">
            {filteredDestinations.map((dest) => {
              const isSelected = currentSelection.id === dest.id;

              return (
                <button
                  key={dest.id}
                  className={`gdm-dest-pill-card ${isSelected ? 'active' : ''}`}
                  onClick={() => setActiveDestination(dest)}
                  onMouseEnter={() => setHoveredDest(dest)}
                  onMouseLeave={() => setHoveredDest(null)}
                  data-cursor="explore"
                >
                  <span className="gdm-card-flag">{dest.flag}</span>
                  <div className="gdm-card-text">
                    <span className="gdm-card-city">{dest.city}</span>
                    <span className="gdm-card-country">{dest.country}</span>
                  </div>
                  <span className="gdm-card-transit">{dest.transitTime}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Logistics Assurance Badges ──────────────────────────── */}
        <div className="gdm-logistics-strip">
          <div className="gdm-logistics-card">
            <ShieldCheck size={22} className="gdm-log-icon" />
            <div>
              <h5 className="gdm-log-title">100% Insured Worldwide Transit</h5>
              <p className="body-sm">All global shipments are covered with door-to-door cargo insurance & real-time tracking.</p>
            </div>
          </div>

          <div className="gdm-logistics-card">
            <Package size={22} className="gdm-log-icon" />
            <div>
              <h5 className="gdm-log-title">Bespoke Poly & Carton Packaging</h5>
              <p className="body-sm">Individual barcode poly-bagging, size stickers, and heavy-duty moisture-sealed export cartons.</p>
            </div>
          </div>

          <div className="gdm-logistics-card">
            <Plane size={22} className="gdm-log-icon" />
            <div>
              <h5 className="gdm-log-title">DHL Express & Air Freight Partners</h5>
              <p className="body-sm">Direct daily cargo departures from Bandaranaike International Airport (CMB) to major world hubs.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
