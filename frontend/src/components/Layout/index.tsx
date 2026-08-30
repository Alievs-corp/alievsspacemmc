import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileTabBar } from './MobileTabBar';
import { OrganizationSchema } from '@/components/Seo';

export function Layout({ children }: { children: ReactNode }) {
  return (
    /* The bottom padding keeps the footer clear of the fixed mobile tab bar. */
    <div className="flex min-h-dvh flex-col pb-[calc(env(safe-area-inset-bottom)+4rem)] lg:pb-0">
      <OrganizationSchema />
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <MobileTabBar />
    </div>
  );
}
