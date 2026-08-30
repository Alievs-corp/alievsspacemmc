import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger, in milliseconds, applied when the element enters the viewport. */
  delay?: number;
  as?: 'div' | 'section' | 'li' | 'article';
}

/**
 * Fades content in the first time it scrolls into view. Falls back to visible
 * immediately when IntersectionObserver is unavailable or motion is reduced,
 * so nothing can ever be permanently hidden.
 */
/** Nothing to observe, or the visitor asked for less motion — render as-is. */
function skipAnimation(): boolean {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return true;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export function Reveal({ children, className, delay = 0, as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(skipAnimation);

  useEffect(() => {
    const node = ref.current;
    if (!node || skipAnimation()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    );
    observer.observe(node);

    // Safety net: content must never stay hidden because the observer did not
    // fire (headless renderers, print, unusual scroll containers).
    const failsafe = window.setTimeout(() => {
      setVisible(true);
      observer.disconnect();
    }, 1500);

    return () => {
      window.clearTimeout(failsafe);
      observer.disconnect();
    };
  }, []);

  return (
    <Tag
      ref={ref as never}
      style={visible && delay ? { animationDelay: `${delay}ms` } : undefined}
      className={cn(visible ? 'animate-reveal' : 'opacity-0', className)}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
