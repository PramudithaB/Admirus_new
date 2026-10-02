import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { navigation } from '../../data/navigation';
import { ArrowUpRight } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const menuRef = useRef(null);
  const menuItemsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      const ctx = gsap.context(() => {
        gsap.fromTo(
          menuRef.current,
          { clipPath: 'inset(0 0 100% 0)' },
          { clipPath: 'inset(0 0 0% 0)', duration: 0.6, ease: 'power4.inOut' }
        );
        gsap.fromTo(
          menuItemsRef.current,
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.06, duration: 0.6, delay: 0.2, ease: 'power3.out' }
        );
      });
      return () => ctx.revert();
    } else {
      document.body.style.overflow = '';
    }
  }, [menuOpen]);

  const handleNavClick = (href) => {
    setMenuOpen(false);
    if (href.startsWith('/')) {
      navigate(href);
      window.scrollTo(0, 0);
      return;
    }
    if (location.pathname !== '/') {
      navigate('/' + href);
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 400);
      return;
    }
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 250);
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo" aria-label="ADMIRUS Home" data-cursor="link">
            <span className="logo-text">ADMIRUS</span>
          </Link>

          <div className="navbar-links">
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="navbar-link"
                data-cursor="link"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="navbar-actions">
            <a
              href="#contact"
              className="navbar-cta"
              data-cursor="link"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#contact');
              }}
            >
              <span>Start a Project</span>
              <ArrowUpRight size={14} />
            </a>

            <button
              className={`navbar-menu-btn ${menuOpen ? 'active' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              data-cursor="link"
            >
              <span className="menu-line" />
              <span className="menu-line" />
            </button>
          </div>
        </div>
      </nav>

      {/* Fullscreen menu overlay */}
      <div
        ref={menuRef}
        className={`menu-overlay ${menuOpen ? 'active' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="menu-overlay-inner">
          <div className="menu-items">
            {navigation.map((item, i) => (
              <a
                key={item.label}
                ref={(el) => (menuItemsRef.current[i] = el)}
                href={item.href}
                className="menu-item"
                data-cursor="link"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
              >
                <span className="menu-item-number">0{i + 1}</span>
                <span className="menu-item-text">{item.label}</span>
              </a>
            ))}
            <a
              ref={(el) => (menuItemsRef.current[navigation.length] = el)}
              href="#contact"
              className="menu-item"
              data-cursor="link"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#contact');
              }}
            >
              <span className="menu-item-number">0{navigation.length + 1}</span>
              <span className="menu-item-text">Contact</span>
            </a>
          </div>

          <div className="menu-footer">
            <div className="menu-footer-info">
              <span className="label">Phone</span>
              <a href="tel:+94765334413">+94 76 533 4413</a>
            </div>
            <div className="menu-footer-info">
              <span className="label">WhatsApp</span>
              <a href="https://wa.me/94765334413" target="_blank" rel="noopener noreferrer">Message Us</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
