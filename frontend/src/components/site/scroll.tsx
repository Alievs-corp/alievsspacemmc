/* eslint-disable react-refresh/only-export-components -- the provider ships with its hooks */
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useSyncExternalStore } from 'react';
import Lenis from 'lenis';

type Listener = (y: number) => void;

interface ScrollApi {
  subscribe: (fn: Listener) => () => void;
}

const listeners = new Set<Listener>();
let active: Lenis | null = null;

function subscribe(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

const ScrollContext = createContext<ScrollApi>({ subscribe });
const API: ScrollApi = { subscribe };

/* The live Lenis instance, readable from components as an external store. */
const engineListeners = new Set<() => void>();
function setActive(l: Lenis | null) {
  active = l;
  engineListeners.forEach((fn) => fn());
}
function subscribeEngine(fn: () => void) {
  engineListeners.add(fn);
  return () => {
    engineListeners.delete(fn);
  };
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
}

/** Jump without easing — used on route changes so a new page always opens at the top. */
export function scrollToTopNow() {
  if (active) active.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
}

export function scrollToTarget(target: string | HTMLElement | number) {
  if (active) active.scrollTo(target, { duration: 1.4, offset: typeof target === 'number' ? 0 : -16 });
  else if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' });
  else (typeof target === 'string' ? document.querySelector(target) : target)?.scrollIntoView({ behavior: 'smooth' });
}

/**
 * One smooth-scroll engine for the public site. Wheel scrolling is eased with
 * Lenis (touch keeps the native feel), and every scroll-linked effect reads
 * from the same per-frame callback instead of adding its own listener.
 * Reduced-motion visitors get plain native scrolling.
 */
export function ScrollProvider({ children }: { children: ReactNode }) {

  useEffect(() => {
    const emit = (y: number) => listeners.forEach((fn) => fn(y));

    if (prefersReducedMotion()) {
      // Scroll events are dispatched once per rendered frame already.
      const onScroll = () => emit(window.scrollY);
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }

    const instance = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
      autoRaf: true,
      anchors: { offset: -16 },
      // Menus, sheets and scrollable panels keep their own native scrolling.
      prevent: (node: HTMLElement) =>
        !!node.closest?.('[data-lenis-prevent],[role="dialog"],[role="listbox"],[role="menu"],textarea,.overflow-y-auto,.overflow-auto'),
    });
    instance.on('scroll', (l: Lenis) => emit(l.scroll));
    setActive(instance);
    return () => {
      instance.destroy();
      if (active === instance) setActive(null);
    };
  }, []);

  return <ScrollContext.Provider value={API}>{children}</ScrollContext.Provider>;
}

export function useLenis() {
  return useSyncExternalStore(subscribeEngine, () => active, () => null);
}

/**
 * Calls `fn(scrollY)` on every scroll frame and once on mount/resize.
 * `fn` may change between renders; the latest one is always used.
 */
export function useScrollFrame(fn: Listener) {
  const { subscribe } = useContext(ScrollContext);
  const ref = useRef(fn);
  useLayoutEffect(() => {
    ref.current = fn;
  });
  useEffect(() => {
    const call = (y: number) => ref.current(y);
    const unsub = subscribe(call);
    let rt = 0;
    const onResize = () => {
      clearTimeout(rt);
      rt = window.setTimeout(() => call(window.scrollY), 80);
    };
    window.addEventListener('resize', onResize);
    call(window.scrollY);
    return () => {
      unsub();
      clearTimeout(rt);
      window.removeEventListener('resize', onResize);
    };
  }, [subscribe]);
}
