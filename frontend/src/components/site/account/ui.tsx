import type { ReactNode } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import './account.css';

/** Mono uppercase field label; a trailing "*" in the copy becomes the accent marker. */
export function FieldLabel({ htmlFor, children, required }: { htmlFor?: string; children: string; required?: boolean }) {
  const text = children.replace(/\s*\*\s*$/, '');
  const marked = required || text !== children;
  return (
    <label htmlFor={htmlFor} className="acc-label">
      {text}
      {marked && (
        <span className="acc-req" aria-hidden>
          *
        </span>
      )}
    </label>
  );
}

/** Status line for forms (error, success, warning). */
export function AccNotice({ tone = 'danger', children, className }: { tone?: 'danger' | 'success' | 'warning'; children: ReactNode; className?: string }) {
  const Icon = tone === 'success' ? CheckCircle2 : AlertCircle;
  return (
    <div role={tone === 'danger' ? 'alert' : 'status'} className={cn('acc-note', `acc-note--${tone}`, className)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <span className="min-w-0 break-words">{children}</span>
    </div>
  );
}
