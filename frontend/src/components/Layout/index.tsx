import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { OrganizationSchema } from '@/components/Seo';
import { ScrollProvider } from '@/components/site/scroll';

const TONES = ['var(--as-mustard)', 'var(--as-burnt)', 'var(--as-amber)', 'var(--as-rust)'];

/**
 * Route change: a plaster curtain lifts off the new page while its content
 * rises in. Nothing runs on the first load, so it never delays LCP.
 */
function RouteTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  // Counts navigations; derived during render so no effect re-renders the tree.
  const [seen, setSeen] = useState(pathname);
  const [n, setN] = useState(0);
  if (seen !== pathname) {
    setSeen(pathname);
    setN(n + 1);
  }

  return (
    <>
      {n > 0 && (
        <div
          key={`c${n}`}
          className="as-curtain as-stucco"
          style={{ '--c': TONES[n % TONES.length] } as CSSProperties}
          aria-hidden
          onAnimationEnd={(e) => (e.currentTarget.style.display = 'none')}
        />
      )}
      <div key={pathname} className={n > 0 ? 'as-page-enter' : undefined}>
        {children}
      </div>
    </>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  // Lets the root (body background, scroll padding) know a public page is up.
  useEffect(() => {
    document.documentElement.classList.add('is-site');
    return () => document.documentElement.classList.remove('is-site', 'as-header-hidden');
  }, []);

  return (
    <ScrollProvider>
      <div className="site flex min-h-dvh flex-col">
        <OrganizationSchema />
        <Header />
        <main id="main" className="flex-1">
          <RouteTransition>{children}</RouteTransition>
        </main>
        <Footer />
      </div>
    </ScrollProvider>
  );
}
