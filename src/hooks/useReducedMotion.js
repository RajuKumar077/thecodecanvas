import { useSyncExternalStore } from 'react';

const subscribeTo = (query) => (onChange) => {
  const mql = window.matchMedia(query);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
};

/** Reactive matchMedia; SSR-safe (returns false on the server). */
export function useMediaQuery(query) {
  return useSyncExternalStore(
    subscribeTo(query),
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** True when the OS asks for reduced motion. */
export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');

/** True on mouse/trackpad devices — gate pointer-follow effects on this. */
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)');
