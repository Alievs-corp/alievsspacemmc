import { useEffect } from 'react';

const HREF =
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap';

/**
 * The CRM and the admin panel keep their original Space Grotesk / Space Mono
 * type. The public site self-hosts its own fonts, so this stylesheet is only
 * requested once one of those sections is opened.
 */
export function LegacyFonts() {
  useEffect(() => {
    if (document.querySelector(`link[href="${HREF}"]`)) return;
    const pre = document.createElement('link');
    pre.rel = 'preconnect';
    pre.href = 'https://fonts.gstatic.com';
    pre.crossOrigin = '';
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = HREF;
    document.head.append(pre, link);
  }, []);
  return null;
}
