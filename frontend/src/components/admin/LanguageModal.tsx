import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Check, Globe, X } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { cn } from '@/lib/utils';

/** Modal list of every site language; picking one switches it and closes the window. */
export function LanguageModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { locale, setLocale, supportedLocales, t } = useI18n();
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    activeRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('ui.language')}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl border border-border bg-surface p-4 shadow-2xl sm:p-5"
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="inline-flex items-center gap-2 font-display text-base font-semibold text-text sm:text-lg">
            <Globe className="h-4 w-4 text-primary sm:h-5 sm:w-5" aria-hidden />
            {t('ui.language')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('admin.cancel')}
            className="grid h-8 w-8 place-items-center rounded-md text-text-subtle transition-colors hover:bg-surface-3 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <ul className="grid grid-cols-2 gap-2">
          {supportedLocales.map((l) => {
            const active = l.code === locale;
            return (
              <li key={l.code}>
                <button
                  type="button"
                  ref={active ? activeRef : undefined}
                  aria-pressed={active}
                  onClick={() => {
                    setLocale(l.code);
                    onClose();
                  }}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
                    active
                      ? 'border-primary bg-primary/10 text-text'
                      : 'border-border bg-surface-2 text-text-muted hover:border-border-strong hover:bg-surface-3 hover:text-text',
                  )}
                >
                  <span className="text-lg leading-none" aria-hidden>{l.flag}</span>
                  <span className="min-w-0 flex-1 truncate">{l.label}</span>
                  {active ? <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden /> : <span className="font-mono text-[10px] text-text-subtle">{l.short}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>,
    document.body,
  );
}
