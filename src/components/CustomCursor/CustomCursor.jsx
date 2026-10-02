import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useTouchDevice } from '../../hooks';
import './CustomCursor.css';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const textRef = useRef(null);
  const isTouch = useTouchDevice();
  const [cursorText, setCursorText] = useState('');
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isTouch) return;

    const cursor = cursorRef.current;
    const dot = cursorDotRef.current;

    const handleMouse = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.15;
      pos.current.y += (target.current.y - pos.current.y) * 0.15;

      if (cursor) {
        cursor.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (dot) {
        dot.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0) translate(-50%, -50%)`;
      }

      requestAnimationFrame(animate);
    };

    const handleEnterInteractive = (e) => {
      const el = e.target.closest('[data-cursor]');
      if (!el) return;
      const type = el.getAttribute('data-cursor');
      gsap.to(cursor, { scale: 2.5, duration: 0.3, ease: 'power3.out' });

      if (type === 'view') setCursorText('VIEW');
      else if (type === 'explore') setCursorText('EXPLORE');
      else if (type === 'drag') setCursorText('DRAG');
      else setCursorText('');
    };

    const handleLeaveInteractive = () => {
      gsap.to(cursor, { scale: 1, duration: 0.3, ease: 'power3.out' });
      setCursorText('');
    };

    const handleMouseDown = () => {
      gsap.to(cursor, { scale: 0.8, duration: 0.15 });
    };

    const handleMouseUp = () => {
      gsap.to(cursor, { scale: 1, duration: 0.3, ease: 'power3.out' });
    };

    window.addEventListener('mousemove', handleMouse);
    document.addEventListener('mouseenter', handleEnterInteractive, true);
    document.addEventListener('mouseleave', handleLeaveInteractive, true);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      document.removeEventListener('mouseenter', handleEnterInteractive, true);
      document.removeEventListener('mouseleave', handleLeaveInteractive, true);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" aria-hidden="true">
        {cursorText && <span ref={textRef} className="cursor-text">{cursorText}</span>}
      </div>
      <div ref={cursorDotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
