import { useCallback, useEffect, useSyncExternalStore } from 'react';

/**
 * Theme = a user PREFERENCE ('light' | 'dark' | 'system') resolved to a THEME
 * ('light' | 'dark') that is written to <html data-theme>. The preference is
 * persisted; 'system' follows the OS live. The first paint is handled by the
 * inline script in index.html, which uses the same storage key and rules.
 */
const KEY = 'tcc-theme';
const listeners = new Set();
const mql = () => window.matchMedia('(prefers-color-scheme: dark)');

const readPref = () => {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : 'system';
  } catch {
    return 'system';
  }
};
const resolve = (pref) => (pref === 'system' ? (mql().matches ? 'dark' : 'light') : pref);
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let pref = typeof window === 'undefined' ? 'system' : readPref();

function apply({ animate }) {
  const root = document.documentElement;
  const theme = resolve(pref);
  if (animate && !reducedMotion()) {
    root.classList.add('theme-switching');
    window.setTimeout(() => root.classList.remove('theme-switching'), 450);
  }
  root.dataset.theme = theme;
  root.dataset.themePref = pref;
  // Browser chrome follows the canvas colour straight from the token.
  const canvas = getComputedStyle(root).getPropertyValue('--color-background').trim();
  if (canvas) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', canvas);
  listeners.forEach((l) => l());
}

function setPref(next) {
  if (next === pref) return;
  pref = next;
  try {
    if (next === 'system') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, next);
  } catch {
    /* storage unavailable (private mode): the choice just won't persist */
  }
  // A soft cross-fade where View Transitions exist, a CSS colour fade elsewhere.
  if (document.startViewTransition && !reducedMotion()) document.startViewTransition(() => apply({ animate: false }));
  else apply({ animate: true });
}

const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useTheme() {
  const preference = useSyncExternalStore(subscribe, () => pref, () => 'system');
  const theme = useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.theme || resolve(pref),
    () => 'light',
  );

  useEffect(() => {
    apply({ animate: false });
    const m = mql();
    const onSystem = () => pref === 'system' && apply({ animate: true });
    // Keep several open tabs in step.
    const onStorage = (e) => {
      if (e.key !== KEY && e.key !== null) return;
      pref = readPref();
      apply({ animate: true });
    };
    m.addEventListener('change', onSystem);
    window.addEventListener('storage', onStorage);
    return () => {
      m.removeEventListener('change', onSystem);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const setPreference = useCallback((next) => setPref(next), []);
  return { preference, theme, setPreference };
}
