import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useFinePointer, useReducedMotion } from '../../hooks/useReducedMotion';
import SpiralGalaxy from './SpiralGalaxy';

// Capability keywords taken from the existing hero copy (LLM agents, RAG search, analytics).
const CHIPS = [
  { label: 'LLM', pos: { left: '4%', top: '14%' }, depth: 1.4, tone: 'accent' },
  { label: 'RAG', pos: { right: '2%', top: '26%' }, depth: 1.1, tone: 'ink' },
  { label: 'Agents', pos: { left: '0%', top: '70%' }, depth: 0.9, tone: 'ink' },
  { label: 'Analytics', pos: { right: '6%', bottom: '6%' }, depth: 1.6, tone: 'accent' },
];

/**
 * "AI world" visual: a tilted spiral galaxy (SpiralGalaxy, canvas) with
 * capability chips floating around it. Layers carry data-depth and drift with
 * the cursor (fine pointers only); the galaxy itself also tilts toward it.
 * Class hooks for the parent's intro timeline:
 * .viz-aura · .viz-galaxy · .viz-chip
 */
export default function InteractiveVisual() {
  const rootRef = useRef(null);
  const finePointer = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = finePointer && !reduced;

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return undefined;

    const layers = [...root.querySelectorAll('[data-depth]')].map((el) => ({
      depth: Number(el.dataset.depth),
      x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3.out' }),
    }));

    const onMove = (e) => {
      if (window.scrollY > window.innerHeight) return; // hero off-screen
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      layers.forEach((l) => {
        l.x(nx * 18 * l.depth);
        l.y(ny * 14 * l.depth);
      });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled]);

  return (
    <div ref={rootRef} className="viz" aria-hidden="true">
      <div className="viz-aura viz-aura--gold" data-depth="0.4" />
      <div className="viz-aura viz-aura--tan" data-depth="0.6" />

      <div className="viz-galaxy" data-depth="0.5">
        <SpiralGalaxy />
      </div>

      {CHIPS.map(({ label, pos, depth, tone }) => (
        <div key={label} className="viz-chip-wrap" style={pos} data-depth={depth}>
          <span className={`viz-chip viz-chip--${tone}`}>
            <i />
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
