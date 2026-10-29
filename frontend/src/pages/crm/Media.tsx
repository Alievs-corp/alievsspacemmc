import { useEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink, FileText, Film, Folder, FolderOpen, Image, Images, LayoutGrid, Search, Trash2, Upload } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useCrm } from '@/contexts/CrmContext';
import { ApiError } from '@/lib/api';
import { crm, fileUrl, scopeCan, type MediaFile, type Project } from '@/lib/crm';
import { EmptyState, ErrorState, LoadingRows, Notice, PageHeader, Spinner, btn, errorMessage, formatDate } from '@/components/admin/ui';
import { Drawer, Field, Segmented } from '@/components/crm/ui';
import { ACCEPT_MEDIA, MediaThumb, UploadButton, formatBytes, uploadError as describeUploadError } from '@/components/crm/content';
import { useLoad } from '@/components/crm/useLoad';
import { cn } from '@/lib/utils';

export function CrmMedia() {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <PageHeader title={t('crm.nav.media', 'Media Library')}
        subtitle={t('crm.media.subtitle', 'Photos, videos and documents of each project. Files are private and open only for people with access to the project.')} />
      <MediaLibrary />
    </div>
  );
}

type Kind = '' | 'image' | 'video' | 'document';

/** Media of one project; without projectId the user picks the project. */
export function MediaLibrary({ projectId }: { projectId?: string }) {
  const { t } = useI18n();
  const { readOnly } = useCrm();
  const { data: projects } = useLoad<Project[]>(() => crm.projects(), []);
  const mediaProjects = useMemo(() => (projects ?? []).filter((p) => scopeCan(p.scope, 'media.view')), [projects]);
  const [chosen, setChosen] = useState('');
  const pid = projectId || chosen || mediaProjects[0]?.id || '';
  const project = (projects ?? []).find((p) => p.id === pid);
  const canManage = !readOnly && !!project && scopeCan(project.scope, 'media.manage');

  const [folder, setFolder] = useState<string | null>(null);
  const [kind, setKind] = useState<Kind>('');
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(0);

  useEffect(() => { const id = setTimeout(() => setQuery(q.trim()), 250); return () => clearTimeout(id); }, [q]);

  const { data: folders, reload: reloadFolders } = useLoad(() => (pid ? crm.mediaFolders(pid) : Promise.resolve([])), [pid]);
  const { data: files, setData: setFiles, error, reload } = useLoad<MediaFile[]>(
    () => (pid ? crm.media({ projectId: pid, folder: folder ?? undefined, kind: kind || undefined, q: query || undefined }) : Promise.resolve([])),
    [pid, folder, kind, query],
  );

  const added = (m: MediaFile) => { setFiles((l) => [m, ...(l ?? [])]); reloadFolders(); };

  const drop = async (list: FileList) => {
    if (!canManage) return;
    setUploadError(null);
    const all = Array.from(list);
    setUploading(all.length);
    for (const f of all) {
      try { added(await crm.uploadMedia(pid, f, folder ?? '')); } catch (err) { setUploadError(`${f.name}: ${describeUploadError(err)}`); }
      setUploading((n) => n - 1);
    }
  };

  if (projects && mediaProjects.length === 0 && !projectId) {
    return <EmptyState icon={<Images className="h-12 w-12" />} title={t('crm.media.noProjects', 'You have no projects with access to the media library')} />;
  }

  const open = (files ?? []).find((m) => m.id === openId) ?? null;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {!projectId && (
          <select value={pid} onChange={(e) => { setChosen(e.target.value); setFolder(null); }} className="field w-auto py-2 text-sm" aria-label={t('crm.project', 'Project')}>
            {mediaProjects.map((p) => <option key={p.id} value={p.id}>{p.companyName} · {p.name}</option>)}
          </select>
        )}
        <Segmented<Kind> value={kind} onChange={setKind} label={t('crm.media.kind', 'File type')} options={[
          { value: '', label: t('crm.media.all', 'All'), icon: <LayoutGrid className="h-4 w-4" /> },
          { value: 'image', label: t('crm.media.images', 'Images'), icon: <Image className="h-4 w-4" /> },
          { value: 'video', label: t('crm.media.videos', 'Videos'), icon: <Film className="h-4 w-4" /> },
          { value: 'document', label: t('crm.media.documents', 'Documents'), icon: <FileText className="h-4 w-4" /> },
        ]} />
        <div className="relative min-w-[160px] flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} className="field py-2 pl-9 text-sm"
            placeholder={t('crm.media.search', 'Search files')} aria-label={t('crm.media.search', 'Search files')} />
        </div>
        {canManage && pid && (
          <span className="ml-auto"><UploadButton projectId={pid} folder={folder ?? ''} onUploaded={added} /></span>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <nav aria-label={t('crm.media.folders', 'Folders')} className="flex gap-1 overflow-x-auto lg:flex-col">
          <FolderButton active={folder === null} onClick={() => setFolder(null)} label={t('crm.media.allFiles', 'All files')} icon={<Images className="h-4 w-4" />} />
          {(folders ?? []).map((f) => (
            <FolderButton key={f.name} active={folder === f.name} onClick={() => setFolder(f.name)}
              label={f.name || t('crm.media.noFolder', 'Not in a folder')} count={f.count}
              icon={folder === f.name ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />} />
          ))}
        </nav>

        <div
          onDragOver={(e) => { if (canManage && e.dataTransfer.types.includes('Files')) { e.preventDefault(); setDragging(true); } }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files.length) void drop(e.dataTransfer.files); }}
          className={cn('min-h-[240px] rounded-xl border border-dashed p-3 transition-colors', dragging ? 'border-primary bg-primary/5' : 'border-transparent')}
        >
          {uploadError && <div className="mb-3"><Notice>{uploadError}</Notice></div>}
          {uploading > 0 && <p className="mb-3 flex items-center gap-2 text-sm text-text-muted"><Spinner /> {t('crm.media.uploading', 'Uploading…')} {uploading}</p>}
          {error ? <ErrorState message={error} onRetry={reload} /> : !files ? <LoadingRows /> : files.length === 0 ? (
            <EmptyState icon={<Upload className="h-12 w-12" />} title={t('crm.media.empty', 'No files in this project yet')}
              hint={canManage ? t('crm.media.dropHint', 'Drop files here or use Upload. JPEG, PNG, WebP, GIF, MP4, WebM, MOV and PDF.') : undefined} />
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
              {files.map((m) => (
                <li key={m.id}>
                  <button type="button" onClick={() => setOpenId(m.id)}
                    className="group w-full overflow-hidden rounded-lg border border-border bg-surface text-left hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                    <MediaThumb media={m} className="aspect-square w-full" />
                    <div className="px-2 py-1.5">
                      <p className="truncate text-xs font-medium text-text">{m.name}</p>
                      <p className="text-[11px] text-text-subtle">{formatBytes(m.size)}{m.version > 1 && ` · v${m.version}`}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <MediaDrawer media={open} canManage={canManage} onClose={() => setOpenId(null)}
        onChanged={(m) => { setFiles((l) => l?.map((x) => (x.rootId === m.rootId ? m : x)) ?? null); setOpenId(m.id); reloadFolders(); }}
        onDeleted={(m) => { setFiles((l) => l?.filter((x) => x.rootId !== m.rootId) ?? null); setOpenId(null); reloadFolders(); }} />
    </section>
  );
}

function FolderButton({ active, onClick, label, icon, count }: { active: boolean; onClick: () => void; label: string; icon: React.ReactNode; count?: number }) {
  return (
    <button type="button" onClick={onClick}
      className={cn('flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm', active ? 'bg-primary/10 font-medium text-primary' : 'text-text-muted hover:bg-surface-3 hover:text-text')}>
      {icon}<span className="min-w-0 flex-1 truncate">{label}</span>
      {count !== undefined && <span className="text-xs tabular-nums text-text-subtle">{count}</span>}
    </button>
  );
}

function MediaDrawer({ media, canManage, onClose, onChanged, onDeleted }: {
  media: MediaFile | null; canManage: boolean; onClose: () => void; onChanged: (m: MediaFile) => void; onDeleted: (m: MediaFile) => void;
}) {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [folder, setFolder] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shown, setShown] = useState<string | null>(null);
  const versionInput = useRef<HTMLInputElement>(null);
  if ((media?.id ?? null) !== shown) {
    setShown(media?.id ?? null);
    setName(media?.name ?? '');
    setFolder(media?.folder ?? '');
    setError(null);
  }
  const { data: versions } = useLoad<MediaFile[]>(() => (media ? crm.mediaVersions(media.id) : Promise.resolve([])), [media?.id]);

  if (!media) return null;

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try { await fn(); } catch (err) {
      setError(err instanceof ApiError && err.code === 'media_in_use'
        ? t('crm.media.inUse', 'This file is used in content. Remove it from the content first.')
        : errorMessage(err, t('crm.saveFailed', 'Could not save.')));
    } finally { setBusy(false); }
  };

  return (
    <Drawer open onClose={onClose} wide title={media.name}
      footer={canManage ? <>
        <button disabled={busy} onClick={() => { if (window.confirm(t('crm.media.confirmDelete', 'Delete this file and all its versions?'))) void run(async () => { await crm.deleteMedia(media.id); onDeleted(media); }); }}
          className={cn(btn.danger, 'mr-auto')}><Trash2 className="h-4 w-4" /> {t('panel.users.delete', 'Delete')}</button>
        <button disabled={busy || (name === media.name && folder === media.folder)} onClick={() => run(async () => onChanged(await crm.updateMedia(media.id, { name, folder })))}
          className={btn.primary}>{busy && <Spinner />} {t('crm.save', 'Save')}</button>
      </> : undefined}>
      <div className="space-y-5">
        {error && <Notice>{error}</Notice>}
        <div className="overflow-hidden rounded-lg border border-border bg-black/80">
          {media.kind === 'image' && <img src={fileUrl(media)} alt={media.name} className="mx-auto max-h-[50vh] object-contain" />}
          {media.kind === 'video' && <video src={fileUrl(media)} controls playsInline className="mx-auto max-h-[50vh] w-full" />}
          {media.kind === 'document' && <MediaThumb media={media} className="h-48 w-full" />}
        </div>
        <a href={fileUrl(media)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-hover">
          <ExternalLink className="h-4 w-4" /> {t('crm.media.openOriginal', 'Open original')}
        </a>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="text-text-muted">{t('crm.media.size', 'Size')}</dt><dd className="text-text">{formatBytes(media.size)}</dd>
          <dt className="text-text-muted">{t('crm.media.type', 'Type')}</dt><dd className="text-text">{media.contentType}</dd>
          <dt className="text-text-muted">{t('crm.media.uploadedBy', 'Uploaded by')}</dt><dd className="text-text">{media.uploader?.name || media.uploader?.email || '—'}</dd>
          <dt className="text-text-muted">{t('crm.fields.created', 'Created')}</dt><dd className="text-text">{formatDate(media.createdAt, true)}</dd>
        </dl>
        {canManage && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t('crm.media.name', 'Name')} htmlFor="media-name">
              <input id="media-name" value={name} onChange={(e) => setName(e.target.value)} className="field" maxLength={200} />
            </Field>
            <Field label={t('crm.media.folder', 'Folder')} htmlFor="media-folder" hint={t('crm.media.folderHint', 'Use / for subfolders, e.g. Brand/Logos')}>
              <input id="media-folder" value={folder} onChange={(e) => setFolder(e.target.value)} className="field" maxLength={200} />
            </Field>
          </div>
        )}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-text">{t('crm.versions', 'Versions')}</h3>
            {canManage && (
              <>
                <input ref={versionInput} type="file" accept={ACCEPT_MEDIA} className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) void run(async () => onChanged(await crm.uploadMediaVersion(media.id, f))); e.target.value = ''; }} />
                <button disabled={busy} onClick={() => versionInput.current?.click()} className={btn.secondary}><Upload className="h-4 w-4" /> {t('crm.media.newVersion', 'Upload new version')}</button>
              </>
            )}
          </div>
          <p className="text-xs text-text-subtle">{t('crm.media.versionsHint', 'Content that uses this file always shows the latest version.')}</p>
          <ul className="divide-y divide-border rounded-lg border border-border">
            {(versions ?? []).map((v) => (
              <li key={v.id} className="flex items-center gap-3 px-3 py-2 text-sm">
                <span className="font-mono text-xs text-text-subtle">v{v.version}</span>
                <span className="min-w-0 flex-1 truncate text-text-muted">{formatDate(v.createdAt, true)} · {v.uploader?.name || v.uploader?.email || '—'} · {formatBytes(v.size)}</span>
                <a href={fileUrl(v)} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-hover" aria-label={t('crm.media.openOriginal', 'Open original')}><ExternalLink className="h-4 w-4" /></a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Drawer>
  );
}
