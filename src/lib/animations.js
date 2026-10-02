import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Default GSAP settings for ADMIRUS
gsap.defaults({
  ease: 'power3.out',
  duration: 0.8,
});

export const EASE = {
  out: 'power3.out',
  inOut: 'power3.inOut',
  smooth: 'power4.out',
  expo: 'expo.out',
};

export const DURATION = {
  fast: 0.3,
  base: 0.6,
  slow: 0.9,
  slower: 1.2,
  slowest: 1.8,
};

/**
 * Reveal text lines with staggered animation
 */
export function revealText(element, options = {}) {
  const { delay = 0, stagger = 0.08, y = 80 } = options;

  return gsap.fromTo(
    element,
    { y, opacity: 0, rotateX: -15 },
    {
      y: 0,
      opacity: 1,
      rotateX: 0,
      duration: DURATION.slow,
      stagger,
      delay,
      ease: EASE.smooth,
    }
  );
}

/**
 * Fade up reveal for general elements
 */
export function fadeUp(element, options = {}) {
  const { delay = 0, y = 60 } = options;

  return gsap.fromTo(
    element,
    { y, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: DURATION.base,
      delay,
      ease: EASE.out,
    }
  );
}

/**
 * Create a scroll-triggered animation
 */
export function scrollReveal(element, options = {}) {
  const {
    y = 60,
    delay = 0,
    start = 'top 85%',
    markers = false,
  } = options;

  return gsap.fromTo(
    element,
    { y, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: DURATION.slow,
      delay,
      ease: EASE.out,
      scrollTrigger: {
        trigger: element,
        start,
        markers,
        toggleActions: 'play none none none',
      },
    }
  );
}

/**
 * Horizontal scroll section
 */
export function horizontalScroll(container, wrapper) {
  const sections = wrapper.children;
  const totalWidth = wrapper.scrollWidth - window.innerWidth;

  return gsap.to(wrapper, {
    x: -totalWidth,
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      pin: true,
      scrub: 1,
      start: 'top top',
      end: () => `+=${totalWidth}`,
      invalidateOnRefresh: true,
    },
  });
}

/**
 * Parallax effect
 */
export function parallax(element, speed = 0.3) {
  return gsap.to(element, {
    yPercent: speed * 100,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
}

export { gsap, ScrollTrigger };
