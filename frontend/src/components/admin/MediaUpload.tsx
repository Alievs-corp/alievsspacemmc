import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { api } from '@/lib/api';
import { MAX_UPLOAD_BYTES, formatBytes, isMediaOfKind } from '@/lib/media';
import { useI18n } from '@/contexts/I18nContext';
import { cn } from '@/lib/utils';

interface MediaUploadProps {
  accept: 'image' | 'video';
  onUploaded: (url: string) => void;
  label: string;
  folder?: string;
  className?: string;
}

/** A single "upload" button for a photo or a video file; hands back the public URL. */
export function MediaUpload({ accept, onUploaded, label, folder = 'marketing', className }: MediaUploadProps) {
  const { t } = useI18n();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!isMediaOfKind(file, accept)) {
      setError(t('panel.marketing.failedUpload'));
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setError(`${formatBytes(file.size)} > ${formatBytes(MAX_UPLOAD_BYTES)}`);
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await api.admin.uploadFile(file, folder, true);
      onUploaded(res.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('panel.marketing.failedUpload'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={cn('space-y-1', className)}>
      <input ref={input} type="file" accept={`${accept}/*`} onChange={onFile} className="hidden" />
      <button
        type="button"
        onClick={() => input.current?.click()}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-md border border-surface-3 bg-surface-2/50 px-3 py-2 text-sm text-text transition-colors hover:border-primary hover:text-primary disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        <Upload className="h-4 w-4" />
        {busy ? t('panel.marketing.uploading') : label}
      </button>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
