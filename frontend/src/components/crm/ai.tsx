/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from 'react';
import { Copy, Check, Sparkles, X } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { CAPTION_LIMITS, type Platform } from '@/lib/crm';
import {
  AI_LANGUAGES, AI_MAX_TONE, aiErrorMessage, aiLanguageName, crmAi, type AiLanguage, type AiRewriteMode, type AiStatus, type AiUsage,
} from '@/lib/crmAi';
import { Notice, Spinner, btn } from '@/components/admin/ui';
import { PLATFORM_META } from '@/components/crm/ui';
import { cn } from '@/lib/utils';

/** Loads /ai/status once; `setUsage` updates the counter after each answer. */
export function useAiStatus() {
  const [status, setStatus] = useState<AiStatus | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let alive = true;
    crmAi.status().then((s) => { if (alive) setStatus(s); }, () => { if (alive) setError(true); });
    return () => { alive = false; };
  }, []);
  const setUsage = (usage: AiUsage) => setStatus((s) => (s ? { ...s, usage } : s));
  return { status, error, setUsage };
}

export function AiPrivacyNote() {
  const { t } = useI18n();
  return (
    <p className="text-xs text-text-subtle">
      {t('crm.ai.privacy', 'Only the text you send here is passed to Anthropic (Claude) to prepare suggestions. Nothing is saved until you insert a result and save it yourself.')}
    </p>
  );
}

export function AiNotConfigured() {
  const { t } = useI18n();
  return (
    <Notice tone="warning">
      {t('crm.ai.notConfigured', 'The AI assistant is not connected yet. An administrator needs to add the Anthropic API key on the server; until then no AI requests are made.')}
    </Notice>
  );
}

export function AiUsageText({ usage }: { usage: AiUsage }) {
  const { t } = useI18n();
  return (
    <span className={cn('text-xs tabular-nums', usage.remaining === 0 ? 'font-medium text-danger' : 'text-text-subtle')}>
      {t('crm.ai.usedToday', 'Today')}: {usage.used}/{usage.limit}
    </span>
  );
}

/** One suggestion with copy and an optional insert action. */
export function AiResult({ text, limit, onInsert, insertLabel }: { text: string; limit?: number; onInsert?: () => void; insertLabel?: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const copy = () => {
    void navigator.clipboard?.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }, () => undefined);
  };
  return (
    <li className="space-y-2 rounded-lg border border-border bg-surface p-3">
      <p className="whitespace-pre-wrap break-words text-sm text-text">{text}</p>
      <div className="flex flex-wrap items-center justify-end gap-2">
        {limit !== undefined && <span className="mr-auto text-xs tabular-nums text-text-subtle">{text.length}/{limit}</span>}
        <button type="button" onClick={copy} className={btn.ghost}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? t('crm.ai.copied', 'Copied') : t('crm.ai.copy', 'Copy')}
        </button>
        {onInsert && <button type="button" onClick={onInsert} className={btn.secondary}>{insertLabel ?? t('crm.ai.insert', 'Insert')}</button>}
      </div>
    </li>
  );
}

type Tool = 'generate' | 'adapt' | 'hashtags' | 'rewrite' | 'translate';

/**
 * AI helper inside the publication editor. It only fills the editor's fields
 * when the user clicks "Insert"; saving stays a separate, explicit step.
 */
export function AiPanel({ projectId, platform, title, brief, caption, sources, onCaption, onHashtags }: {
  projectId: string;
  platform: Platform;
  title: string;
  brief: string;
  caption: string;
  /** Captions of the content's other platforms, for "adapt". */
  sources: Array<{ platform: Platform; caption: string }>;
  onCaption: (text: string) => void;
  onHashtags: (tags: string[]) => void;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const { status, error: statusError, setUsage } = useAiStatus();
  const [tool, setTool] = useState<Tool>('generate');
  const [from, setFrom] = useState<Platform | ''>('');
  const [mode, setMode] = useState<AiRewriteMode>('shorter');
  const [tone, setTone] = useState('');
  const [lang, setLang] = useState<AiLanguage>('en');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [results, setResults] = useState<string[] | null>(null);
  const [tags, setTags] = useState<string[] | null>(null);
  const limit = CAPTION_LIMITS[platform];
  const source = sources.find((s) => s.platform === from) ?? sources[0];

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className={btn.secondary}>
        <Sparkles className="h-4 w-4 text-primary" /> {t('crm.ai.assistant', 'AI assistant')}
      </button>
    );
  }

  const hasCaption = caption.trim() !== '';
  const ready = {
    generate: title.trim() !== '' || brief.trim() !== '',
    adapt: !!source,
    hashtags: hasCaption || title.trim() !== '' || brief.trim() !== '',
    rewrite: hasCaption && (mode !== 'tone' || tone.trim() !== ''),
    translate: hasCaption,
  }[tool];
  const tooLong = (tool === 'rewrite' || tool === 'translate') && caption.length > 6000;

  const run = async () => {
    setBusy(true);
    setErr(null);
    setResults(null);
    setTags(null);
    try {
      if (tool === 'hashtags') {
        const text = hasCaption ? caption : [title, brief].filter(Boolean).join('\n\n');
        const res = await crmAi.hashtags({ projectId, platform, text });
        setTags(res.hashtags);
        setUsage(res.usage);
        return;
      }
      const res = tool === 'generate' ? await crmAi.generate({ projectId, platform, title, brief, tone: tone.trim() || undefined })
        : tool === 'adapt' ? await crmAi.adapt({ projectId, platform, fromPlatform: source!.platform, caption: source!.caption })
          : tool === 'rewrite' ? await crmAi.rewrite({ projectId, platform, text: caption, mode, tone: tone.trim() || undefined })
            : await crmAi.translate({ projectId, platform, text: caption, language: lang });
      setResults(res.results);
      setUsage(res.usage);
    } catch (e) {
      setErr(aiErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const tools: Array<{ key: Tool; label: string }> = [
    { key: 'generate', label: t('crm.ai.tool.generate', 'Write captions') },
    { key: 'adapt', label: t('crm.ai.tool.adapt', 'Adapt') },
    { key: 'hashtags', label: t('crm.ai.tool.hashtags', 'Hashtags') },
    { key: 'rewrite', label: t('crm.ai.tool.rewrite', 'Rewrite') },
    { key: 'translate', label: t('crm.ai.tool.translate', 'Translate') },
  ];
  const hint = {
    generate: t('crm.ai.hint.generate', 'Uses the content title and brief.'),
    adapt: sources.length ? t('crm.ai.hint.adapt', 'Rewrites the caption of another platform for this one.') : t('crm.ai.hint.adaptNone', 'Write a caption for another platform first.'),
    hashtags: t('crm.ai.hint.hashtags', 'Uses the caption (or the title and brief when it is empty).'),
    rewrite: hasCaption ? t('crm.ai.hint.rewrite', 'Rewrites the current caption.') : t('crm.ai.hint.needCaption', 'Write or insert a caption first.'),
    translate: hasCaption ? t('crm.ai.hint.translate', 'Translates the current caption.') : t('crm.ai.hint.needCaption', 'Write or insert a caption first.'),
  }[tool];

  return (
    <div className="space-y-3 rounded-lg border border-primary/30 bg-surface-2 p-3 sm:p-4">
      <div className="flex items-center justify-between gap-2">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-text"><Sparkles className="h-4 w-4 text-primary" /> {t('crm.ai.assistant', 'AI assistant')}</h4>
        <span className="flex items-center gap-2">
          {status?.configured && <AiUsageText usage={status.usage} />}
          <button type="button" onClick={() => setOpen(false)} className={btn.ghost} aria-label={t('crm.ai.close', 'Close')}><X className="h-4 w-4" /></button>
        </span>
      </div>

      {statusError ? <Notice>{t('crm.loadFailed', 'Could not load data.')}</Notice> : !status ? <Spinner /> : !status.configured ? <AiNotConfigured /> : (
        <>
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label={t('crm.ai.assistant', 'AI assistant')}>
            {tools.map((x) => (
              <button key={x.key} type="button" role="tab" aria-selected={tool === x.key}
                onClick={() => { setTool(x.key); setResults(null); setTags(null); setErr(null); }}
                className={cn('rounded-md border px-2.5 py-1.5 text-sm', tool === x.key ? 'border-primary bg-surface text-text shadow-sm' : 'border-border text-text-muted hover:text-text')}>
                {x.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-end gap-2">
            {tool === 'adapt' && sources.length > 0 && (
              <select value={source?.platform ?? ''} onChange={(e) => setFrom(e.target.value as Platform)} className="field w-auto py-2 text-sm" aria-label={t('crm.ai.from', 'From platform')}>
                {sources.map((s) => <option key={s.platform} value={s.platform}>{t('crm.ai.fromPrefix', 'From')} {PLATFORM_META[s.platform].label}</option>)}
              </select>
            )}
            {tool === 'rewrite' && (
              <select value={mode} onChange={(e) => setMode(e.target.value as AiRewriteMode)} className="field w-auto py-2 text-sm" aria-label={t('crm.ai.modeLabel', 'How to rewrite')}>
                <option value="shorter">{t('crm.ai.mode.shorter', 'Shorter')}</option>
                <option value="longer">{t('crm.ai.mode.longer', 'Longer')}</option>
                <option value="tone">{t('crm.ai.mode.tone', 'Change tone')}</option>
              </select>
            )}
            {(tool === 'generate' || (tool === 'rewrite' && mode === 'tone')) && (
              <input value={tone} onChange={(e) => setTone(e.target.value)} maxLength={AI_MAX_TONE} className="field min-w-0 flex-1 py-2 text-sm sm:max-w-xs"
                placeholder={tool === 'generate' ? t('crm.ai.toneOptional', 'Tone (optional), e.g. friendly') : t('crm.ai.tone', 'Tone, e.g. formal, playful')}
                aria-label={t('crm.ai.toneLabel', 'Tone of voice')} />
            )}
            {tool === 'translate' && (
              <select value={lang} onChange={(e) => setLang(e.target.value as AiLanguage)} className="field w-auto py-2 text-sm" aria-label={t('crm.ai.language', 'Language')}>
                {AI_LANGUAGES.map((l) => <option key={l} value={l}>{aiLanguageName(l)}</option>)}
              </select>
            )}
            <button type="button" disabled={busy || !ready || tooLong || status.usage.remaining === 0} onClick={run} className={btn.primary}>
              {busy ? <Spinner /> : <Sparkles className="h-4 w-4" />} {busy ? t('crm.ai.working', 'Thinking…') : t('crm.ai.run', 'Suggest')}
            </button>
          </div>
          <p className="text-xs text-text-subtle">{tooLong ? t('crm.ai.tooLong', 'The text is too long for the assistant (max 6000 characters).') : hint}</p>

          {err && <Notice>{err}</Notice>}
          {results && (
            <ul className="space-y-2">
              {results.map((r, i) => <AiResult key={i} text={r} limit={limit} onInsert={() => onCaption(r)} insertLabel={t('crm.ai.insertCaption', 'Insert into caption')} />)}
            </ul>
          )}
          {tags && (
            tags.length === 0 ? <p className="text-sm text-text-muted">{t('crm.ai.noTags', 'No hashtags suggested. Try adding more text.')}</p> : (
              <div className="space-y-2 rounded-lg border border-border bg-surface p-3">
                <p className="break-words text-sm text-primary">{tags.map((h) => `#${h}`).join(' ')}</p>
                <div className="flex justify-end">
                  <button type="button" onClick={() => onHashtags(tags)} className={btn.secondary}>{t('crm.ai.addTags', 'Add to hashtags')}</button>
                </div>
              </div>
            )
          )}
          <AiPrivacyNote />
        </>
      )}
    </div>
  );
}
