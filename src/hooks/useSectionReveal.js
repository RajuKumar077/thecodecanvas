import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Breakpoint conditions shared by every section's gsap.matchMedia(). */
export const MOTION_QUERIES = {
  motion: '(prefers-reduced-motion: no-preference)',
  desktop: '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
  fine: '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
};

/**
 * Standard scroll choreography for a section, scoped to `ref`:
 *  · `.section-title .at-word`  → masked word rise
 *  · `[data-reveal]`            → batched fade-up (stagger within a batch)
 *  · `[data-reveal="scale"]`    → soft scale-in, for media
 * `extra(ctx)` runs inside the same gsap.matchMedia so section-specific
 * timelines share one cleanup; it may return a cleanup function for
 * non-GSAP work (observers, listeners). Reduced motion → nothing is animated.
 */
export function useSectionReveal(ref, extra) {
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const mm = gsap.matchMedia(root);

    mm.add(MOTION_QUERIES, (ctx) => {
      const { motion, desktop } = ctx.conditions;
      if (!motion) return;
      const distance = desktop ? 36 : 20;

      root.querySelectorAll('.section-title').forEach((title) => {
        gsap.from(title.querySelectorAll('.at-word'), {
          yPercent: 110,
          duration: 1.1,
          stagger: 0.05,
          ease: 'expo.out',
          scrollTrigger: { trigger: title, start: 'top 88%', once: true },
        });
      });

      const plain = gsap.utils.toArray(root.querySelectorAll('[data-reveal]:not([data-reveal="scale"])'));
      gsap.set(plain, { autoAlpha: 0, y: distance });
      ScrollTrigger.batch(plain, {
        start: 'top 90%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08, ease: 'power3.out', overwrite: true }),
      });

      root.querySelectorAll('[data-reveal="scale"]').forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          scale: 0.94,
          duration: 1.3,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });

      return extra?.(ctx);
    });

    return () => mm.revert();
    // `extra` is intentionally excluded: sections pass a stable inline function.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
}
