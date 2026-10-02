import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap } from './lib/animations';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './hooks';

// Critical components
import Loader      from './components/Loader/Loader';
import CustomCursor from './components/CustomCursor/CustomCursor';
import Navbar      from './components/Navbar/Navbar';
import ScrollProgress from './components/ScrollProgress/ScrollProgress';
import Hero        from './components/Hero/Hero';

// Lazy sections — home page
const BrandStatement   = lazy(() => import('./components/BrandStatement/BrandStatement'));
const ServicesEcosystem = lazy(() => import('./components/ServicesEcosystem/ServicesEcosystem'));
const ClientsMarquee    = lazy(() => import('./components/ClientsMarquee/ClientsMarquee'));
const Portfolio        = lazy(() => import('./components/Portfolio/Portfolio'));
const SphereGallery    = lazy(() => import('./components/SphereGallery/SphereGallery'));
const About            = lazy(() => import('./components/About/About'));
const Contact          = lazy(() => import('./components/Contact/Contact'));
const Footer           = lazy(() => import('./components/Footer/Footer'));

// Lazy pages — sub routes
const SocialMediaPage  = lazy(() => import('./pages/SocialMediaPage/SocialMediaPage'));
const TeamPage         = lazy(() => import('./pages/TeamPage/TeamPage'));
const HiClothPage      = lazy(() => import('./pages/HiClothPage/HiClothPage'));
const DronePage        = lazy(() => import('./pages/DronePage/DronePage'));
const EventsPage       = lazy(() => import('./pages/EventsPage/EventsPage'));
const SugarPixelPage   = lazy(() => import('./pages/SugarPixelPage/SugarPixelPage'));

import './styles/globals.css';

function SectionFallback() {
  return <div style={{ minHeight: '50vh' }} />;
}

// ── Home page layout ──────────────────────────────────────────────────────────
function HomePage() {
  const [loading, setLoading] = useState(true);
  const reducedMotion = useReducedMotion();

  const handleLoadComplete = useCallback(() => setLoading(false), []);

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => lenis.destroy();
  }, [reducedMotion]);

  return (
    <>
      {loading && <Loader onComplete={handleLoadComplete} />}
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={<SectionFallback />}>
          <BrandStatement />
          <ServicesEcosystem />
          <ClientsMarquee />
          <Portfolio />
          <SphereGallery />
          <About />
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={<SectionFallback />}>
        <Footer />
      </Suspense>
    </>
  );
}

// ── Root App with routing ─────────────────────────────────────────────────────
function App() {
  return (
    <>
      <CustomCursor />
      <div className="grain-overlay" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/social-media"
          element={
            <Suspense fallback={<SectionFallback />}>
              <SocialMediaPage />
            </Suspense>
          }
        />
        <Route
          path="/team"
          element={
            <Suspense fallback={<SectionFallback />}>
              <TeamPage />
            </Suspense>
          }
        />
        <Route
          path="/hi-cloth"
          element={
            <Suspense fallback={<SectionFallback />}>
              <HiClothPage />
            </Suspense>
          }
        />
        <Route
          path="/drone-mahaththaya"
          element={
            <Suspense fallback={<SectionFallback />}>
              <DronePage />
            </Suspense>
          }
        />
        <Route
          path="/drone"
          element={
            <Suspense fallback={<SectionFallback />}>
              <DronePage />
            </Suspense>
          }
        />
        <Route
          path="/the-events-by-admirus"
          element={
            <Suspense fallback={<SectionFallback />}>
              <EventsPage />
            </Suspense>
          }
        />
        <Route
          path="/events"
          element={
            <Suspense fallback={<SectionFallback />}>
              <EventsPage />
            </Suspense>
          }
        />
        <Route
          path="/sugar-pixel-studio"
          element={
            <Suspense fallback={<SectionFallback />}>
              <SugarPixelPage />
            </Suspense>
          }
        />
        <Route
          path="/sugar-pixel"
          element={
            <Suspense fallback={<SectionFallback />}>
              <SugarPixelPage />
            </Suspense>
          }
        />
      </Routes>
    </>
  );
}

export default App;
