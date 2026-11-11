import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTopNow } from '@/components/site/scroll';

/**
 * React Router keeps the scroll position across route changes; this resets it
 * so every page starts at the top (except in-page #anchor navigation). Goes
 * through the smooth-scroll engine when it is running, or it would ease back.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    scrollToTopNow();
  }, [pathname, hash]);

  return null;
}

export default ScrollToTop;
