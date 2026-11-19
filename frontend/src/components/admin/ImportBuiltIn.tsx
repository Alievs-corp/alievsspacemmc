import { useState } from 'react';
import { Download } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/Button';
import { importBuiltInContent, type ImportKind } from '@/lib/siteContent';

/**
 * Shown on an empty admin section: the public site still runs on its built-in
 * content, so this copies it into the CMS to be viewed and managed here.
 */
export function ImportBuiltIn({ kind, onDone }: { kind: ImportKind; onDone: () => void | Promise<void> }) {
  const { t } = useI18n();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const run = async () => {
    setBusy(true);
    setError('');
    try {
      await importBuiltInContent(kind);
      await onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('admin.failedToSave'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-lg border border-primary/40 bg-primary/5 p-5">
      <h2 className="font-display text-base font-semibold text-text">{t('panel.siteImport.title')}</h2>
      <p className="mt-1 max-w-3xl text-sm text-text-subtle">{t('panel.siteImport.text')}</p>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      <Button className="mt-4" onClick={run} disabled={busy}>
        <Download className="mr-2 h-4 w-4" />
        {busy ? t('panel.siteImport.busy') : t('panel.siteImport.button')}
      </Button>
    </div>
  );
}
