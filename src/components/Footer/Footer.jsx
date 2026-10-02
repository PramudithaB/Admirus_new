import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from '../../lib/animations';
import { useReducedMotion, useMousePosition } from '../../hooks';
import { navigation } from '../../data/navigation';
import { brand } from '../../data/brand';
import { ArrowUpRight } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const footerRef = useRef(null);
  const wordmarkRef = useRef(null);
  const { normalized } = useMousePosition();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.footer-wordmark', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.footer-wordmark', start: 'top 90%' },
      });
    }, footerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <footer ref={footerRef} className="footer">
      <div className="container">
        {/* Large wordmark */}
        <div className="footer-wordmark" ref={wordmarkRef}>
          <span className="footer-wordmark-text" data-cursor="link">ADMIRUS</span>
        </div>

        <div className="footer-content">
          <div className="footer-col">
            <span className="footer-tagline">{brand.tagline}</span>
            <p className="body-sm">{brand.positioning}</p>
          </div>

          <div className="footer-col">
            <span className="label" style={{ marginBottom: '16px', display: 'block' }}>Navigation</span>
            <div className="footer-links">
              {navigation.map((item) =>
                item.href.startsWith('/') ? (
                  <Link key={item.label} to={item.href} className="footer-link" data-cursor="link">
                    {item.label}
                  </Link>
                ) : (
                  <a key={item.label} href={item.href} className="footer-link" data-cursor="link">
                    {item.label}
                  </a>
                )
              )}
            </div>
          </div>

          <div className="footer-col">
            <span className="label" style={{ marginBottom: '16px', display: 'block' }}>Contact</span>
            <div className="footer-links">
              <a href={`tel:${brand.phone.replace(/\s/g, '')}`} className="footer-link">{brand.phone}</a>
              <a href={brand.whatsapp} target="_blank" rel="noopener noreferrer" className="footer-link">
                WhatsApp <ArrowUpRight size={12} style={{ display: 'inline' }} />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <span className="label" style={{ marginBottom: '16px', display: 'block' }}>Social</span>
            <div className="footer-links">
              <a href="#" className="footer-link">Facebook</a>
              <a href="#" className="footer-link">Instagram</a>
              <a href="#" className="footer-link">LinkedIn</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="body-sm">
            © {new Date().getFullYear()} {brand.fullName}. All rights reserved.
          </span>
          <a href="#hero" className="footer-back-top" data-cursor="link">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
