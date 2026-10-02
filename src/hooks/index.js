import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Track mouse position with smooth interpolation
 */
export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [normalized, setNormalized] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouse = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setNormalized({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return { position, normalized };
}

/**
 * Track scroll progress (0 to 1)
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? window.scrollY / total : 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}

/**
 * Responsive media query hook
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);

    const handler = (e) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/**
 * Detect prefers-reduced-motion
 */
export function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/**
 * Detect device performance level
 */
export function useDevicePerformance() {
  const [level, setLevel] = useState('high');

  useEffect(() => {
    const cores = navigator.hardwareConcurrency || 4;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const dpr = window.devicePixelRatio || 1;

    if (isMobile || cores <= 2 || dpr > 2.5) {
      setLevel('low');
    } else if (cores <= 4) {
      setLevel('medium');
    } else {
      setLevel('high');
    }
  }, []);

  return level;
}

/**
 * Intersection observer hook
 */
export function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (options.once !== false) {
            observer.unobserve(el);
          }
        } else if (options.once === false) {
          setInView(false);
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin, options.once]);

  return [ref, inView];
}

/**
 * Detect touch device
 */
export function useTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0
    );
  }, []);

  return isTouch;
}
