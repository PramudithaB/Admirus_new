import { useRef } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import { CollectionSurfer } from '../ui/collection-surfer';
import './Gallery.css';

// Default item count from CollectionSurfer's built-in ITEMS (12)
const DEFAULT_ITEM_COUNT = 12;
const SCROLL_PER_ITEM    = 400;

export default function Gallery() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const loopDistance    = DEFAULT_ITEM_COUNT * SCROLL_PER_ITEM;
  const externalScrollY = useTransform(scrollYProgress, [0, 1], [0, loopDistance]);

  return (
    <section
      ref={sectionRef}
      className="gallery-section"
      id="gallery"
      aria-label="Gallery"
      style={{ height: `calc(${loopDistance}px + 100vh)` }}
    >
      <div className="gallery-sticky">
        <CollectionSurfer
          variant="magnetic"
          externalScrollY={externalScrollY}
          heading="SELECTED"
          subheading="WORKS"
        />
      </div>
    </section>
  );
}
