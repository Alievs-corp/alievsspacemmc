import { ApiError } from './api';
import { crmRequest as request, type ContentFormat, type Platform } from './crm';
import { t } from './i18n';

/**
 * AI Assistant client. Requests go to our server, which calls Claude; the API
 * key never reaches the browser. Answers are suggestions only — nothing is
 * saved until the user inserts a result and saves it.
 */

export type AiLanguage = 'ru' | 'az' | 'en';
export const AI_LANGUAGES: AiLanguage[] = ['ru', 'az', 'en'];
export type AiRewriteMode = 'shorter' | 'longer' | 'tone';
export type AiFeature = 'generate' | 'adapt' | 'hashtags' | 'rewrite' | 'translate' | 'ideas';

/** Input caps, mirroring the server. */
export const AI_MAX_TEXT = 6000;
export const AI_MAX_TOPIC = 500;
export const AI_MAX_TONE = 60;

export interface AiUsage { limit: number; used: number; remaining: number }
export interface AiStatus { configured: boolean; model?: string; usage: AiUsage }
export interface AiIdea { title: string; brief: string; format: ContentFormat; platform: Platform }

type Texts = { results: string[]; usage: AiUsage };

export const crmAi = {
  status: () => request<AiStatus>('GET', '/ai/status'),
  generate: (data: { projectId: string; platform: Platform; title: string; brief: string; tone?: string; language?: AiLanguage | ''; count?: number }) =>
    request<Texts>('POST', '/ai/generate', data),
  adapt: (data: { projectId: string; platform: Platform; fromPlatform?: Platform; caption: string; count?: number }) =>
    request<Texts>('POST', '/ai/adapt', data),
  hashtags: (data: { projectId: string; platform?: Platform | ''; text: string; count?: number }) =>
    request<{ hashtags: string[]; usage: AiUsage }>('POST', '/ai/hashtags', data),
  rewrite: (data: { projectId: string; platform?: Platform | ''; text: string; mode: AiRewriteMode; tone?: string }) =>
    request<Texts>('POST', '/ai/rewrite', data),
  translate: (data: { projectId: string; platform?: Platform | ''; text: string; language: AiLanguage }) =>
    request<Texts>('POST', '/ai/translate', data),
  ideas: (data: { projectId: string; platform?: Platform | ''; topic?: string; language?: AiLanguage | ''; count?: number }) =>
    request<{ ideas: AiIdea[]; usage: AiUsage }>('POST', '/ai/ideas', data),
};

export function aiLanguageName(l: AiLanguage): string {
  return { ru: t('crm.ai.lang.ru', 'Russian'), az: t('crm.ai.lang.az', 'Azerbaijani'), en: t('crm.ai.lang.en', 'English') }[l];
}

export function aiFeatureName(f: string): string {
  const names: Record<AiFeature, string> = {
    generate: t('crm.ai.feature.generate', 'caption variants'),
    adapt: t('crm.ai.feature.adapt', 'adapting a caption'),
    hashtags: t('crm.ai.feature.hashtags', 'hashtags'),
    rewrite: t('crm.ai.feature.rewrite', 'rewriting'),
    translate: t('crm.ai.feature.translate', 'translation'),
    ideas: t('crm.ai.feature.ideas', 'content ideas'),
  };
  return names[f as AiFeature] ?? f;
}

/** Friendly text for AI errors; codes come from the server. */
export function aiErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    switch (err.code) {
      case 'ai_not_configured': return t('crm.ai.err.notConfigured', 'The AI assistant is not connected yet.');
      case 'ai_daily_limit': return t('crm.ai.err.limit', "You've used today's AI requests. The limit resets at midnight (UTC).");
      case 'ai_timeout': return t('crm.ai.err.timeout', 'The AI assistant took too long. Please try again.');
      case 'ai_busy': return t('crm.ai.err.busy', 'The AI assistant is busy right now. Please try again in a minute.');
      case 'ai_refused': return t('crm.ai.err.refused', 'The AI assistant declined this request. Try rephrasing the text.');
      case 'ai_failed': return t('crm.ai.err.failed', "The AI assistant couldn't answer. Please try again.");
      case 'view_as_read_only': return t('crm.ai.err.viewAs', 'The AI assistant is not available in view-as mode.');
    }
    if (err.status === 403) return t('crm.ai.err.forbidden', "You don't have permission to write content here.");
    if (err.status === 400 && err.message) return err.message;
  }
  return t('crm.ai.err.failed', "The AI assistant couldn't answer. Please try again.");
}
