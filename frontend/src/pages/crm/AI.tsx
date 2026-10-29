import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, Plus, Sparkles, Wand2 } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useCrm } from '@/contexts/CrmContext';
import { crm, scopeCan, type Platform, type Project } from '@/lib/crm';
import {
  AI_LANGUAGES, AI_MAX_TEXT, AI_MAX_TONE, AI_MAX_TOPIC, aiErrorMessage, aiLanguageName, crmAi,
  type AiIdea, type AiLanguage, type AiRewriteMode, type AiUsage,
} from '@/lib/crmAi';
import { EmptyState, ErrorState, LoadingRows, Notice, PageHeader, Spinner, btn, errorMessage } from '@/components/admin/ui';
import { Field, PLATFORM_META, StatCard } from '@/components/crm/ui';
import { formatLabel } from '@/components/crm/content';
import { AiNotConfigured, AiPrivacyNote, AiResult, useAiStatus } from '@/components/crm/ai';
import { useLoad } from '@/components/crm/useLoad';
import { cn } from '@/lib/utils';

const writable = (p: Project) => p.status !== 'archived' && (scopeCan(p.scope, 'content.create') || scopeCan(p.scope, 'content.edit'));

export function CrmAI() {
  const { t } = useI18n();
  const { readOnly } = useCrm();
  const { status, error: statusError, setUsage } = useAiStatus();
  const { data: projects, error, reload } = useLoad<Project[]>(() => crm.projects(), []);
  const list = useMemo(() => (projects ?? []).filter(writable), [projects]);
  const [chosen, setChosen] = useState('');
  const project = list.find((p) => p.id === chosen) ?? list[0];

  const header = (
    <PageHeader title={t('crm.nav.ai', 'AI Assistant')}
      subtitle={t('crm.ai.subtitle', 'Content ideas, rewrites and translations with Claude. Results are suggestions: you decide what to use.')} />
  );
  if (error) return <div className="space-y-6">{header}<ErrorState message={error} onRetry={reload} /></div>;
  if (!projects || (!status && !statusError)) return <div className="space-y-6">{header}<LoadingRows rows={3} /></div>;

  return (
    <div className="space-y-6">
      {header}
      {statusError && <Notice>{t('crm.loadFailed', 'Could not load data.')}</Notice>}
      {status && !status.configured && <AiNotConfigured />}
      {readOnly && <Notice tone="warning">{t('crm.ai.err.viewAs', 'The AI assistant is not available in view-as mode.')}</Notice>}

      {list.length === 0 ? (
        <EmptyState icon={<Sparkles className="h-12 w-12" />} title={t('crm.ai.noProjects', 'You have no projects where you can write content')}
          hint={t('crm.ai.noProjectsHint', 'The assistant works inside projects where you may create or edit content.')} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="card space-y-1.5 p-4 sm:col-span-2">
              <label htmlFor="ai-project" className="block text-sm text-text-muted">{t('crm.project', 'Project')}</label>
              <select id="ai-project" value={project?.id ?? ''} onChange={(e) => setChosen(e.target.value)} className="field py-2 text-sm">
                {list.map((p) => <option key={p.id} value={p.id}>{p.companyName} · {p.name}</option>)}
              </select>
            </div>
            {status?.configured ? (
              <StatCard label={t('crm.ai.usage', 'AI requests today')} value={`${status.usage.used} / ${status.usage.limit}`}
                tone={status.usage.remaining === 0 ? 'danger' : undefined}
                hint={t('crm.ai.usageHint', 'Per person, resets at midnight (UTC).')} icon={<Sparkles className="h-4 w-4" />} />
            ) : (
              <StatCard label={t('crm.ai.usage', 'AI requests today')} value="—" hint={t('crm.ai.off', 'Assistant is off')} icon={<Sparkles className="h-4 w-4" />} />
            )}
          </div>
          {project && (
            <div className="grid gap-6 xl:grid-cols-2">
              <Ideas key={`i-${project.id}`} project={project} enabled={!!status?.configured && !readOnly && status.usage.remaining > 0} onUsage={setUsage} />
              <TextTool key={`t-${project.id}`} project={project} enabled={!!status?.configured && !readOnly && status.usage.remaining > 0} onUsage={setUsage} />
            </div>
          )}
          <AiPrivacyNote />
        </>
      )}
    </div>
  );
}

function PlatformSelect({ project, value, onChange, id, any }: { project: Project; value: Platform | ''; onChange: (p: Platform | '') => void; id: string; any: string }) {
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value as Platform | '')} className="field py-2 text-sm">
      <option value="">{any}</option>
      {project.platforms.map((p) => <option key={p} value={p}>{PLATFORM_META[p].label}</option>)}
    </select>
  );
}

function LanguageSelect({ value, onChange, id, auto }: { value: AiLanguage | ''; onChange: (l: AiLanguage | '') => void; id: string; auto?: string }) {
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value as AiLanguage | '')} className="field py-2 text-sm">
      {auto && <option value="">{auto}</option>}
      {AI_LANGUAGES.map((l) => <option key={l} value={l}>{aiLanguageName(l)}</option>)}
    </select>
  );
}

/** Content ideas from the project's name, description and platforms. */
function Ideas({ project, enabled, onUsage }: { project: Project; enabled: boolean; onUsage: (u: AiUsage) => void }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [platform, setPlatform] = useState<Platform | ''>('');
  const [topic, setTopic] = useState('');
  const [lang, setLang] = useState<AiLanguage | ''>('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<AiIdea[] | null>(null);
  const [creating, setCreating] = useState<number | null>(null);
  const canCreate = scopeCan(project.scope, 'content.create');

  const run = async () => {
    setBusy(true);
    setErr(null);
    try {
      const res = await crmAi.ideas({ projectId: project.id, platform, topic: topic.trim() || undefined, language: lang });
      setIdeas(res.ideas);
      onUsage(res.usage);
    } catch (e) {
      setErr(aiErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  // Turning an idea into a draft is the user's explicit choice.
  const create = async (idea: AiIdea, i: number) => {
    setCreating(i);
    setErr(null);
    try {
      const item = await crm.createContent({ projectId: project.id, title: idea.title, brief: idea.brief, format: idea.format, platforms: [idea.platform] });
      navigate(`/crm/studio/${item.id}`);
    } catch (e) {
      setErr(errorMessage(e, t('crm.saveFailed', 'Could not save.')));
      setCreating(null);
    }
  };

  return (
    <section className="card space-y-4 p-5">
      <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-text"><Lightbulb className="h-5 w-5 text-primary" /> {t('crm.ai.ideas', 'Content ideas')}</h2>
      <p className="text-sm text-text-muted">{t('crm.ai.ideasHint', "Based on the project's name, description and platforms.")}</p>
      {!project.description.trim() && <p className="text-xs text-text-subtle">{t('crm.ai.noDescription', 'Tip: a project description gives the assistant much better ideas.')}</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={t('crm.ai.platform', 'Platform')} htmlFor="ai-ideas-platform">
          <PlatformSelect id="ai-ideas-platform" project={project} value={platform} onChange={setPlatform} any={t('crm.ai.anyPlatform', 'All project platforms')} />
        </Field>
        <Field label={t('crm.ai.language', 'Language')} htmlFor="ai-ideas-lang">
          <LanguageSelect id="ai-ideas-lang" value={lang} onChange={setLang} auto={t('crm.ai.langAuto', 'Like the project description')} />
        </Field>
      </div>
      <Field label={t('crm.ai.topic', 'Topic or focus (optional)')} htmlFor="ai-ideas-topic" hint={`${topic.length}/${AI_MAX_TOPIC}`}>
        <input id="ai-ideas-topic" value={topic} onChange={(e) => setTopic(e.target.value)} maxLength={AI_MAX_TOPIC} className="field"
          placeholder={t('crm.ai.topicPlaceholder', 'e.g. summer sale, behind the scenes')} />
      </Field>
      <div className="flex justify-end">
        <button type="button" disabled={!enabled || busy} onClick={run} className={btn.primary}>
          {busy ? <Spinner /> : <Sparkles className="h-4 w-4" />} {busy ? t('crm.ai.working', 'Thinking…') : t('crm.ai.suggestIdeas', 'Suggest ideas')}
        </button>
      </div>
      {err && <Notice>{err}</Notice>}
      {ideas && (
        <ul className="space-y-2">
          {ideas.map((idea, i) => {
            const m = PLATFORM_META[idea.platform];
            return (
              <li key={i} className="space-y-1.5 rounded-lg border border-border bg-surface-2 p-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-text-subtle">
                  <m.Icon className={cn('h-3.5 w-3.5', m.color)} /> {m.label} · {formatLabel(idea.format)}
                </div>
                <p className="break-words font-medium text-text">{idea.title}</p>
                <p className="whitespace-pre-wrap break-words text-sm text-text-muted">{idea.brief}</p>
                {canCreate && (
                  <div className="flex justify-end">
                    <button type="button" disabled={creating !== null} onClick={() => create(idea, i)} className={btn.secondary}>
                      {creating === i ? <Spinner /> : <Plus className="h-4 w-4" />} {t('crm.ai.createDraft', 'Create content')}
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

type Action = 'shorter' | 'longer' | 'tone' | 'translate';

/** Free rewrite / translate tool; results can be copied anywhere. */
function TextTool({ project, enabled, onUsage }: { project: Project; enabled: boolean; onUsage: (u: AiUsage) => void }) {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [action, setAction] = useState<Action>('shorter');
  const [tone, setTone] = useState('');
  const [lang, setLang] = useState<AiLanguage | ''>('en');
  const [platform, setPlatform] = useState<Platform | ''>('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [results, setResults] = useState<string[] | null>(null);

  const ready = text.trim() !== '' && text.length <= AI_MAX_TEXT && (action !== 'tone' || tone.trim() !== '');
  const run = async () => {
    setBusy(true);
    setErr(null);
    try {
      const res = action === 'translate'
        ? await crmAi.translate({ projectId: project.id, platform, text, language: (lang || 'en') as AiLanguage })
        : await crmAi.rewrite({ projectId: project.id, platform, text, mode: action as AiRewriteMode, tone: tone.trim() || undefined });
      setResults(res.results);
      onUsage(res.usage);
    } catch (e) {
      setErr(aiErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="card space-y-4 p-5">
      <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-text"><Wand2 className="h-5 w-5 text-primary" /> {t('crm.ai.textTool', 'Rewrite or translate')}</h2>
      <Field label={t('crm.ai.text', 'Text')} htmlFor="ai-text" hint={`${text.length}/${AI_MAX_TEXT}`}>
        <textarea id="ai-text" rows={6} value={text} onChange={(e) => setText(e.target.value)} className="field font-[inherit]"
          placeholder={t('crm.ai.textPlaceholder', 'Paste a caption or any text')} />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={t('crm.ai.action', 'What to do')} htmlFor="ai-action">
          <select id="ai-action" value={action} onChange={(e) => setAction(e.target.value as Action)} className="field py-2 text-sm">
            <option value="shorter">{t('crm.ai.mode.shorter', 'Shorter')}</option>
            <option value="longer">{t('crm.ai.mode.longer', 'Longer')}</option>
            <option value="tone">{t('crm.ai.mode.tone', 'Change tone')}</option>
            <option value="translate">{t('crm.ai.tool.translate', 'Translate')}</option>
          </select>
        </Field>
        {action === 'translate' ? (
          <Field label={t('crm.ai.language', 'Language')} htmlFor="ai-lang">
            <LanguageSelect id="ai-lang" value={lang} onChange={setLang} />
          </Field>
        ) : (
          <Field label={t('crm.ai.platform', 'Platform')} htmlFor="ai-text-platform">
            <PlatformSelect id="ai-text-platform" project={project} value={platform} onChange={setPlatform} any={t('crm.ai.noPlatform', 'Any')} />
          </Field>
        )}
      </div>
      {action === 'tone' && (
        <Field label={t('crm.ai.toneLabel', 'Tone of voice')} htmlFor="ai-tone">
          <input id="ai-tone" value={tone} onChange={(e) => setTone(e.target.value)} maxLength={AI_MAX_TONE} className="field"
            placeholder={t('crm.ai.tone', 'Tone, e.g. formal, playful')} />
        </Field>
      )}
      <div className="flex justify-end">
        <button type="button" disabled={!enabled || busy || !ready} onClick={run} className={btn.primary}>
          {busy ? <Spinner /> : <Sparkles className="h-4 w-4" />} {busy ? t('crm.ai.working', 'Thinking…') : t('crm.ai.run', 'Suggest')}
        </button>
      </div>
      {err && <Notice>{err}</Notice>}
      {results && <ul className="space-y-2">{results.map((r, i) => <AiResult key={i} text={r} />)}</ul>}
    </section>
  );
}
