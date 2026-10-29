/* eslint-disable react-refresh/only-export-components */
import { useRef, useState } from 'react';
import { Check, FileText, Film, Upload } from 'lucide-react';
import { t } from '@/lib/i18n';
import { ApiError } from '@/lib/api';
import { cn } from '@/lib/utils';
import { crm, fileUrl, type ContentFormat, type EffectiveStatus, type MediaFile } from '@/lib/crm';
import { EmptyState, LoadingRows, Notice, Spinner, btn, errorMessage } from '@/components/admin/ui';
import { Drawer } from './ui';
import { useLoad } from './useLoad';

/** Content Studio, Calendar and Approvals building blocks. */

export function contentStatusLabel(s: EffectiveStatus): string {
  return {
    idea: t('crm.cstatus.idea', 'Idea'),
    in_progress: t('crm.cstatus.in_progress', 'In Progress'),
    ready_for_review: t('crm.cstatus.ready_for_review', 'Ready for Review'),
    changes_requested: t('crm.cstatus.changes_requested', 'Changes Requested'),
    rejected: t('crm.cstatus.rejected', 'Rejected'),
    approved: t('crm.cstatus.approved', 'Approved'),
    scheduled: t('crm.cstatus.scheduled', 'Scheduled'),
    published: t('crm.cstatus.published', 'Published'),
    failed: t('crm.cstatus.failed', 'Failed'),
  }[s] ?? s;
}

export const CONTENT_STATUS_DOT: Record<EffectiveStatus, string> = {
  idea: 'bg-text-subtle',
  in_progress: 'bg-info',
  ready_for_review: 'bg-warning',
  changes_requested: 'bg-[#f97316]',
  rejected: 'bg-danger',
  approved: 'bg-success',
  scheduled: 'bg-primary',
  published: 'bg-[#16a34a]',
  failed: 'bg-danger',
};

const CONTENT_STATUS_STYLE: Record<EffectiveStatus, string> = {
  idea: 'bg-surface-3 text-text-muted',
  in_progress: 'bg-info/15 text-info',
  ready_for_review: 'bg-warning/15 text-warning',
  changes_requested: 'bg-[#f97316]/15 text-[#f97316]',
  rejected: 'bg-danger/15 text-danger',
  approved: 'bg-success/15 text-success',
  scheduled: 'bg-primary/15 text-primary',
  published: 'bg-success/20 text-success',
  failed: 'bg-danger/15 text-danger',
};

export function ContentStatusBadge({ status }: { status: EffectiveStatus }) {
  return <span className={cn('inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium', CONTENT_STATUS_STYLE[status])}>{contentStatusLabel(status)}</span>;
}

export function formatLabel(f: ContentFormat): string {
  return {
    post: t('crm.format.post', 'Post'),
    reel: t('crm.format.reel', 'Reel'),
    story: t('crm.format.story', 'Story'),
    carousel: t('crm.format.carousel', 'Carousel'),
    video: t('crm.format.video', 'Video'),
    short: t('crm.format.short', 'Short'),
    article: t('crm.format.article', 'Article'),
  }[f] ?? f;
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

/** Square preview of a media file. Videos show their first frame. */
export function MediaThumb({ media, className }: { media: MediaFile | null | undefined; className?: string }) {
  if (!media) return <div className={cn('bg-surface-3', className)} />;
  if (media.kind === 'image') {
    return <img src={fileUrl(media)} alt={media.name} loading="lazy" className={cn('bg-surface-3 object-cover', className)} />;
  }
  if (media.kind === 'video') {
    return (
      <div className={cn('relative bg-black', className)}>
        <video src={`${fileUrl(media)}#t=0.1`} preload="metadata" muted playsInline className="h-full w-full object-cover" />
        <Film className="absolute bottom-1 right-1 h-4 w-4 text-white drop-shadow" aria-hidden />
      </div>
    );
  }
  return (
    <div className={cn('flex flex-col items-center justify-center gap-1 bg-surface-3 p-2 text-text-muted', className)}>
      <FileText className="h-6 w-6" aria-hidden />
      <span className="w-full truncate text-center text-[10px]">{media.name}</span>
    </div>
  );
}

export const ACCEPT_MEDIA = 'image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime,application/pdf';

/** Upload button that sends files one by one and reports each result. */
export function UploadButton({ projectId, folder, onUploaded, disabled, label }: {
  projectId: string; folder?: string; onUploaded: (m: MediaFile) => void; disabled?: boolean; label?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const send = async (files: FileList | null) => {
    if (!files?.length) return;
    setError(null);
    const list = Array.from(files);
    setBusy(list.length);
    for (const f of list) {
      try {
        onUploaded(await crm.uploadMedia(projectId, f, folder));
      } catch (err) {
        setError(`${f.name}: ${uploadError(err)}`);
      }
      setBusy((n) => n - 1);
    }
    if (input.current) input.current.value = '';
  };

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <input ref={input} type="file" multiple accept={ACCEPT_MEDIA} className="hidden" onChange={(e) => send(e.target.files)} />
      <button type="button" disabled={disabled || busy > 0} onClick={() => input.current?.click()} className={btn.primary}>
        {busy > 0 ? <Spinner /> : <Upload className="h-4 w-4" />} {label ?? t('crm.media.upload', 'Upload')}
      </button>
      {error && <span className="max-w-xs text-right text-xs text-danger">{error}</span>}
    </span>
  );
}

/** Picks media files of one project; `multiple` keeps the chosen order. */
export function MediaPicker({ open, onClose, projectId, selected, multiple, onPick, canUpload }: {
  open: boolean; onClose: () => void; projectId: string; selected: string[]; multiple: boolean;
  onPick: (rootIds: string[], files: MediaFile[]) => void; canUpload: boolean;
}) {
  const [picked, setPicked] = useState<string[]>(selected);
  const [opened, setOpened] = useState(open);
  if (open !== opened) { setOpened(open); if (open) setPicked(selected); }
  const { data, error, setData } = useLoad<MediaFile[]>(() => (open ? crm.media({ projectId }) : Promise.resolve([])), [open, projectId]);

  const toggle = (id: string) => {
    if (!multiple) { setPicked([id]); return; }
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };

  return (
    <Drawer open={open} onClose={onClose} wide title={t('crm.media.pick', 'Choose from media library')}
      footer={<>
        <button onClick={onClose} className={btn.secondary}>{t('admin.cancel', 'Cancel')}</button>
        <button onClick={() => { onPick(picked, (data ?? []).filter((m) => picked.includes(m.rootId))); onClose(); }} className={btn.primary}>
          {t('crm.media.usePicked', 'Use selected')} {multiple && picked.length > 0 && `(${picked.length})`}
        </button>
      </>}>
      <div className="space-y-4">
        {canUpload && (
          <div className="flex justify-end">
            <UploadButton projectId={projectId} onUploaded={(m) => { setData((l) => [m, ...(l ?? [])]); toggle(m.rootId); }} />
          </div>
        )}
        {error ? <Notice>{error}</Notice> : !data ? <LoadingRows /> : data.length === 0 ? (
          <EmptyState icon={<Upload className="h-10 w-10" />} title={t('crm.media.empty', 'No files in this project yet')} />
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {data.map((m) => {
              const idx = picked.indexOf(m.rootId);
              return (
                <button key={m.id} type="button" onClick={() => toggle(m.rootId)} title={m.name}
                  className={cn('relative overflow-hidden rounded-lg border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus', idx >= 0 ? 'border-primary' : 'border-transparent')}>
                  <MediaThumb media={m} className="aspect-square w-full" />
                  {idx >= 0 && (
                    <span className="absolute right-1 top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-on-primary">
                      {multiple ? idx + 1 : <Check className="h-3 w-3" />}
                    </span>
                  )}
                  <span className="block truncate px-1 py-0.5 text-left text-[11px] text-text-muted">{m.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Drawer>
  );
}

/** The server names the default step and automatic versions in English. */
export function stepLabel(name: string): string {
  return name === 'Review' ? t('crm.flow.defaultStep', 'Review') : name;
}

export function versionNote(note: string): string {
  if (note === 'Submitted for review') return t('crm.studio.noteSubmitted', 'Submitted for review');
  if (note === 'Before restoring version') return t('crm.studio.noteBeforeRestore', 'Before restoring a version');
  return note;
}

/** Upload errors by server code, in the interface language. */
export function uploadError(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.code === 'file_type_not_allowed') return t('crm.media.typeNotAllowed', 'Only JPEG, PNG, WebP, GIF, MP4, WebM, MOV and PDF files are allowed.');
    if (err.code === 'file_too_large') return `${t('crm.media.tooLarge', 'The file is too large.')} ${err.message}`;
  }
  return errorMessage(err, t('crm.media.uploadFailed', 'Upload failed.'));
}

/** Local datetime-local value from an ISO timestamp. */
export function toDateTimeInput(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fromDateTimeInput(v: string): string {
  if (!v) return '';
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString();
}
