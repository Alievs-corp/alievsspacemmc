import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { OrganizationSchema } from '@/components/Seo';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <OrganizationSchema />
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
