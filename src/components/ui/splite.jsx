import { Suspense, lazy } from 'react';
import './splite.css';

const Spline = lazy(() => import('@splinetool/react-spline'));

/**
 * SplineScene — lazy-loads a Spline 3D scene into a canvas.
 *
 * Props:
 *  scene     – Spline scene URL (.splinecode)
 *  className – extra CSS class passed to the Spline canvas
 */
export function SplineScene({ scene, className = '' }) {
  return (
    <Suspense
      fallback={
        <div className="spline-loader-wrap">
          <span className="spline-loader" />
        </div>
      }
    >
      <Spline scene={scene} className={`spline-canvas ${className}`} />
    </Suspense>
  );
}

export default SplineScene;
