import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import "./collection-surfer.css";

// ── Default item set (overridden by Gallery with Admirus-themed images) ──────
const DEFAULT_ITEMS = [
  { id: 1,  image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&fit=crop", title: "BRAND 01" },
  { id: 2,  image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80&fit=crop", title: "DESIGN 02" },
  { id: 3,  image: "https://images.unsplash.com/photo-1536240478-09878b9e060d?w=400&q=80&fit=crop", title: "SOCIAL 03" },
  { id: 4,  image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80&fit=crop", title: "WEB 04" },
  { id: 5,  image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&q=80&fit=crop", title: "MOBILE 05" },
  { id: 6,  image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&q=80&fit=crop", title: "TECH 06" },
  { id: 7,  image: "https://images.unsplash.com/photo-1542744094-24638eff58bb?w=400&q=80&fit=crop", title: "CONTENT 07" },
  { id: 8,  image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&q=80&fit=crop", title: "EVENT 08" },
  { id: 9,  image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80&fit=crop", title: "IDENTITY 09" },
  { id: 10, image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80&fit=crop", title: "CAMPAIGN 10" },
  { id: 11, image: "https://images.unsplash.com/photo-1493119508027-2b584f234d6c?w=400&q=80&fit=crop", title: "VISUAL 11" },
  { id: 12, image: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=400&q=80&fit=crop", title: "AERIAL 12" },
];

/**
 * CollectionSurfer
 *
 * Props:
 *  items           – array of { id, image, title }
 *  variant         – "magnetic" | "uplift" | "simple"
 *  externalScrollY – optional MotionValue<number> from a parent section.
 *                    When supplied the component uses it instead of window scrollY,
 *                    enabling section-scoped scroll (sticky pattern).
 *  heading         – title line 1
 *  subheading      – title line 2
 *  count           – override count badge (default items.length)
 */
export function CollectionSurfer({
  items = DEFAULT_ITEMS,
  variant = "magnetic",
  externalScrollY,
  heading = "SELECTED",
  subheading = "WORKS",
  showHeading = true,
}) {
  const duplicatedItems = [...items, ...items];

  // How many scroll-pixels correspond to one item advancing in the 3D track.
  // Smaller = faster animation for section-embedded use.
  const scrollPerItem = 400;
  const loopDistance = items.length * scrollPerItem;

  // ── Scroll source ────────────────────────────────────────────────────────
  // Fall back to window scroll when no external value is provided (standalone).
  const { scrollY: windowScrollY } = useScroll();
  const scrollY = externalScrollY ?? windowScrollY;

  const smoothScroll = useSpring(scrollY, {
    mass: 0.1,
    stiffness: 100,
    damping: 20,
  });

  // Loop the scroll offset so the track cycles endlessly
  const loopedProgress = useTransform(
    smoothScroll,
    (v) => v % loopDistance
  );

  // ── 3-D track translation ────────────────────────────────────────────────
  const stepX = 240;
  const stepY = -84;
  const stepZ = -288;

  const x = useTransform(loopedProgress, [0, loopDistance], [0, -items.length * stepX]);
  const y = useTransform(loopedProgress, [0, loopDistance], [0, -items.length * stepY]);
  const z = useTransform(loopedProgress, [0, loopDistance], [0, -items.length * stepZ]);

  // ── Mouse tracking for magnetic / uplift variants ────────────────────────
  const mouseX = useMotionValue(-10000);
  const mouseY = useMotionValue(-10000);

  const handleMouseMove = (e) => {
    if (variant === "simple") return;
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const handleMouseLeave = () => {
    if (variant === "simple") return;
    mouseX.set(-10000);
    mouseY.set(-10000);
  };

  return (
    <div className="cs-root">
      {/* Fixed / sticky viewport — parent controls positioning */}
      <div
        className="cs-viewport"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* UI overlay – top-left heading */}
        {showHeading && (
          <div className="cs-heading-wrap">
            <h2 className="cs-heading-line cs-heading-indent">{heading}</h2>
            <h2 className="cs-heading-line">
              {subheading}
              <span className="cs-count">({items.length})</span>
            </h2>
          </div>
        )}

        {/* UI overlay – bottom-right hint */}
        <div className="cs-scroll-hint">scroll to surf</div>

        {/* 3-D Scene */}
        <div className="cs-scene">
          <motion.div
            className="cs-track"
            style={{ x, y, z, transformStyle: "preserve-3d" }}
          >
            {duplicatedItems.map((item, i) => (
              <Card
                key={`${item.id}-${i}`}
                item={item}
                i={i}
                totalOriginal={items.length}
                stepX={stepX}
                stepY={stepY}
                stepZ={stepZ}
                mouseX={mouseX}
                mouseY={mouseY}
                scrollSpring={smoothScroll}
                variant={variant}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ── Card ─────────────────────────────────────────────────────────────────────

function Card({
  item,
  i,
  totalOriginal,
  stepX,
  stepY,
  stepZ,
  mouseX,
  mouseY,
  scrollSpring,
  variant,
}) {
  const ref = useRef(null);

  // Distance from mouse → interactive effect strength
  const distance = useTransform([mouseX, mouseY, scrollSpring], ([mx, my]) => {
    if (!ref.current || variant === "simple") return 400;
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    return Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2);
  });

  // Magnetic: closer = larger scale
  const targetScale  = useTransform(distance, [0, 400], [1.5, 1]);
  const springScale  = useSpring(targetScale,  { mass: 0.5, stiffness: 300, damping: 20 });

  // Uplift: closer = rise upward
  const targetUplift = useTransform(distance, [0, 400], [-100, 0]);
  const springUplift = useSpring(targetUplift, { mass: 0.5, stiffness: 300, damping: 20 });

  // Combine into a single transform string
  const transform = useTransform([springScale, springUplift], ([s, u]) => {
    const baseX = i * stepX;
    const baseY = i * stepY;
    const baseZ = i * stepZ;
    const scale  = variant === "magnetic" ? Number(s) : 1;
    const uplift = variant === "uplift"   ? Number(u) : 0;
    return `translate3d(${baseX}px, ${baseY + uplift}px, ${baseZ}px) rotateY(-50deg) scale(${scale})`;
  });

  return (
    <motion.div ref={ref} className="cs-card" style={{ transform, transformStyle: "preserve-3d" }}>
      {/* Index badge */}
      <span className="cs-card-index">
        {String((i % totalOriginal) + 1).padStart(2, "0")}
      </span>

      {/* Image */}
      <div className="cs-card-img-wrap">
        <img src={item.image} alt={item.title} className="cs-card-img" loading="lazy" />
      </div>

      {/* Title overlay (bottom) */}
      <div className="cs-card-title">{item.title}</div>

      {/* Gradient overlay */}
      <div className="cs-card-overlay" />
    </motion.div>
  );
}

export default CollectionSurfer;
