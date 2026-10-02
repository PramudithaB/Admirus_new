import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './Loader.css';

export default function Loader({ onComplete }) {
  const loaderRef = useRef(null);
  const progressRef = useRef(null);
  const numberRef = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(loaderRef.current, {
            clipPath: 'inset(0 0 100% 0)',
            duration: 0.8,
            ease: 'power4.inOut',
            onComplete: () => onComplete?.(),
          });
        },
      });

      // Count up
      tl.to({}, {
        duration: 1.8,
        onUpdate: function () {
          const val = Math.round(this.progress() * 100);
          setCount(val);
        },
      });

      // Progress bar
      tl.to(progressRef.current, {
        scaleX: 1,
        duration: 1.8,
        ease: 'power2.inOut',
      }, 0);

      // Pause before exit
      tl.to({}, { duration: 0.3 });
    }, loaderRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div ref={loaderRef} className="loader" aria-label="Loading ADMIRUS">
      <div className="loader-inner">
        <div className="loader-brand">
          <span className="loader-name">ADMIRUS</span>
          <span className="loader-tagline">Concept Into Iconic.</span>
        </div>
        <div className="loader-progress-wrap">
          <div className="loader-progress-bar">
            <div ref={progressRef} className="loader-progress-fill" />
          </div>
          <span ref={numberRef} className="loader-count">{count}</span>
        </div>
      </div>
    </div>
  );
}
