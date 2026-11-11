import { forwardRef, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useFinePointer, useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Pill button that leans toward the cursor and springs back on leave.
 * Renders <a> when `href` is supplied, otherwise <button>.
 * The effect is disabled on touch devices and under reduced motion.
 */
const MagneticButton = forwardRef(function MagneticButton(
  { href, variant = 'primary', strength = 0.35, className = '', children, ...rest },
  forwardedRef,
) {
  const localRef = useRef(null);
  const labelRef = useRef(null);
  const finePointer = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = finePointer && !reduced;

  useEffect(() => {
    const el = localRef.current;
    const label = labelRef.current;
    if (!el || !label || !enabled) return undefined;

    const opts = { duration: 0.6, ease: 'power3.out' };
    const xTo = gsap.quickTo(el, 'x', opts);
    const yTo = gsap.quickTo(el, 'y', opts);
    const lxTo = gsap.quickTo(label, 'x', opts);
    const lyTo = gsap.quickTo(label, 'y', opts);

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      xTo(dx * strength);
      yTo(dy * strength);
      lxTo(dx * strength * 0.35);
      lyTo(dy * strength * 0.35);
    };
    const onLeave = () => {
      gsap.to([el, label], { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' });
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf([el, label]);
      gsap.set([el, label], { clearProps: 'transform' });
    };
  }, [enabled, strength]);

  const setRefs = (node) => {
    localRef.current = node;
    if (typeof forwardedRef === 'function') forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };

  const Tag = href ? 'a' : 'button';
  return (
    <Tag
      ref={setRefs}
      href={href}
      type={href ? undefined : 'button'}
      className={`btn btn--${variant} ${className}`.trim()}
      {...rest}
    >
      <span ref={labelRef} className="btn-label">
        {children}
      </span>
    </Tag>
  );
});

export default MagneticButton;
