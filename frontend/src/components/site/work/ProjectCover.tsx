/**
 * Cover for a project without a screenshot: the site's name set large on a
 * brand-coloured background. The colour is picked from the name, so a project
 * always keeps the same cover.
 */
const TONES = ['burnt', 'mustard', 'ink', 'cream', 'rust'] as const;

function toneFor(name: string): (typeof TONES)[number] {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return TONES[h % TONES.length];
}

export function ProjectCover({ name, className }: { name: string; className?: string }) {
  const title = name.trim() || '—';
  // Longer names get a smaller type size so they always fit.
  const size = title.length > 22 ? 'sm' : title.length > 12 ? 'md' : 'lg';
  return (
    <div className={`wk-cover wk-cover--${toneFor(title.toLowerCase())} wk-cover--${size}${className ? ` ${className}` : ''}`} role="img" aria-label={title}>
      <span className="wk-cover__name">{title}</span>
    </div>
  );
}

export default ProjectCover;
