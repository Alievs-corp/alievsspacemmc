import { Link } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { useContent } from '@/contexts/ContentContext';

export function Footer() {
  const { t } = useI18n();
  const { content } = useContent();
  const settings = content?.settings;

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-muted)]/50">
      <div className="container px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600"></div>
              <span className="text-xl font-bold">
                {settings?.brandName || 'Alievs Space MMC'}
              </span>
            </div>
            <p className="text-sm text-[var(--color-muted-foreground)]">{t('public.footerDesc')}</p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">{t('nav.about')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]">
                  {t('nav.services')}
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]">
                  {t('nav.projects')}
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]">
                  {t('nav.careers')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">{t('nav.contact')}</h3>
            <ul className="space-y-2 text-sm text-[var(--color-muted-foreground)]">
              <li>
                <a href={`mailto:${settings?.email || 'hello@alievsspace.com'}`}>
                  {settings?.email || 'hello@alievsspace.com'}
                </a>
              </li>
              <li>
                <a href={`tel:${settings?.phone?.replace(/\s/g, '') || ''}`}>
                  {settings?.phone || '+994 (00) 000 00 00'}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Social</h3>
            <div className="flex flex-wrap gap-2">
              {settings?.social?.instagram && (
                <a
                  href={settings.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-1.5 text-xs hover:bg-[var(--color-accent)]"
                >
                  Instagram
                </a>
              )}
              {settings?.social?.linkedin && (
                <a
                  href={settings.social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-1.5 text-xs hover:bg-[var(--color-accent)]"
                >
                  LinkedIn
                </a>
              )}
              {settings?.social?.youtube && (
                <a
                  href={settings.social.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-1.5 text-xs hover:bg-[var(--color-accent)]"
                >
                  YouTube
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--color-border)] pt-8 text-center text-sm text-[var(--color-muted-foreground)]">
          © {new Date().getFullYear()} Alievs Space MMC. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
