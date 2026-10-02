import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

/**
 * Spotlight — a radial glow that follows the mouse within its parent container.
 * The component attaches event listeners to its own parentElement so it requires
 * no wrapper changes — just drop it inside any positioned container.
 *
 * Props:
 *  size          – diameter of the spotlight circle in px (default 300)
 *  color         – CSS colour string for the centre of the radial (default pumpkin orange)
 *  springOptions – framer-motion spring config (default: no bounce)
 *  className     – extra classes applied to the motion div
 */
export function Spotlight({
  size = 300,
  color = 'rgba(249, 115, 22, 0.35)',
  springOptions = { bounce: 0 },
  className = '',
}) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [parentElement, setParentElement] = useState(null);

  const mouseX = useSpring(0, springOptions);
  const mouseY = useSpring(0, springOptions);

  const spotlightLeft = useTransform(mouseX, (x) => `${x - size / 2}px`);
  const spotlightTop  = useTransform(mouseY, (y) => `${y - size / 2}px`);

  // Grab the parent once mounted and make it positioned
  useEffect(() => {
    if (containerRef.current) {
      const parent = containerRef.current.parentElement;
      if (parent) {
        parent.style.position = 'relative';
        parent.style.overflow = 'hidden';
        setParentElement(parent);
      }
    }
  }, []);

  const handleMouseMove = useCallback(
    (event) => {
      if (!parentElement) return;
      const { left, top } = parentElement.getBoundingClientRect();
      mouseX.set(event.clientX - left);
      mouseY.set(event.clientY - top);
    },
    [mouseX, mouseY, parentElement]
  );

  useEffect(() => {
    if (!parentElement) return;

    const onEnter = () => setIsHovered(true);
    const onLeave = () => setIsHovered(false);

    parentElement.addEventListener('mousemove', handleMouseMove);
    parentElement.addEventListener('mouseenter', onEnter);
    parentElement.addEventListener('mouseleave', onLeave);

    return () => {
      parentElement.removeEventListener('mousemove', handleMouseMove);
      parentElement.removeEventListener('mouseenter', onEnter);
      parentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [parentElement, handleMouseMove]);

  return (
    <motion.div
      ref={containerRef}
      className={`spotlight ${className}`}
      animate={{ opacity: isHovered ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      style={{
        width: size,
        height: size,
        left: spotlightLeft,
        top: spotlightTop,
        background: `radial-gradient(circle at center, ${color}, transparent 80%)`,
        filter: 'blur(32px)',
        position: 'absolute',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}

export default Spotlight;
