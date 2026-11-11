import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { useScrollFrame } from './scroll';
import { loadAllFrames, loadFirstFrame, Walker } from './walker';

export type WallColor = 'mustard' | 'burnt' | 'amber' | 'rust';

const COLORS: Record<WallColor, [string, string]> = {
  mustard: ['var(--as-mustard)', 'var(--as-mustard-hi)'],
  burnt: ['var(--as-burnt)', 'var(--as-burnt-lo)'],
  amber: ['var(--as-amber)', 'var(--as-amber-hi)'],
  rust: ['var(--as-rust)', 'var(--as-rust-lo)'],
};

const ORDER: WallColor[] = ['mustard', 'burnt', 'amber', 'rust', 'mustard', 'burnt'];

export interface WalkHeroProps {
  /** Six wall words, one per panel (IDEA, DESIGN …). */
  words: string[];
  /** Six notes shown while the figure passes each panel. */
  notes: Array<{ title: string; body: string }>;
  /** Above-the-fold copy (eyebrow, h1, lead, actions); fades out once walking starts. */
  intro: ReactNode;
  cue: string;
  label: string;
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

interface Layout {
  W: number;
  H: number;
  P: number;
  portrait: boolean;
  top: number;
  range: number;
  xStart: number;
  xEnd: number;
  offEnd: number;
  feetY: number;
}

/**
 * Home hero: a wall of six coloured plaster panels scrolls sideways while a
 * figure walks along the floor in step with the scroll. Sticky stage, one
 * canvas, transforms only — nothing here triggers layout while scrolling.
 */
export function WalkHero({ words, notes, intro, cue, label }: WalkHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const walkerRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const notesRef = useRef<HTMLDivElement>(null);

  const walker = useRef<Walker | null>(null);
  const nums = useRef<HTMLElement[]>([]);
  const L = useRef<Layout | null>(null);
  const state = useRef({ note: -1, intro: true });

  const update = (y: number) => {
    const l = L.current;
    const hero = walker.current;
    if (!l || !hero || !wallRef.current) return;
    const p = clamp((y - l.top) / l.range, 0, 1);
    const w = clamp((p - 0.035) / 0.93, 0, 1);
    const off = l.offEnd * w;
    const sx = l.xStart + (l.xEnd - l.xStart) * w;
    const dist = sx + off - l.xStart;
    const f = hero.frameAt(dist);
    hero.draw(f.idx);
    hero.place(l.xStart + f.q - off, l.feetY);
    wallRef.current.style.transform = `translate3d(${(-off).toFixed(2)}px,0,0)`;
    // Each numeral drifts relative to its own panel and sits at its designed
    // spot when that panel is mid-screen, so late panels (5, 6) are not
    // pushed out of their wall by an ever-growing offset.
    nums.current.forEach((n, i) => {
      const par = clamp((off - (i - 0.5) * l.P) * 0.14, -l.P * 0.18, l.P * 0.18);
      n.style.transform = `translate3d(${par.toFixed(2)}px,0,0)`;
    });

    const showIntro = w < 0.015;
    if (showIntro !== state.current.intro) {
      state.current.intro = showIntro;
      introRef.current?.classList.toggle('is-off', !showIntro);
      introRef.current?.toggleAttribute('inert', !showIntro);
      stageRef.current?.classList.toggle('is-intro', showIntro);
    }
    const panel = showIntro ? -1 : clamp(Math.floor((sx + off) / l.P), 0, notes.length - 1);
    if (panel !== state.current.note) {
      state.current.note = panel;
      notesRef.current?.querySelectorAll('.as-note-item').forEach((n, i) => n.classList.toggle('is-on', i === panel));
    }
    if (cueRef.current) cueRef.current.style.opacity = String(clamp(1 - w * 10, 0, 1));
    if (barRef.current) barRef.current.style.transform = `scaleX(${w.toFixed(4)})`;
  };

  const measure = () => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage || !walker.current) return;
    nums.current = [...stage.querySelectorAll<HTMLElement>('.as-num')];
    const W = stage.clientWidth;
    const H = stage.clientHeight;
    const portrait = H > W;
    const narrow = W < 1024;
    const P = W / 2;
    stage.style.setProperty('--P', `${P}px`);
    stage.style.setProperty('--H', `${H}px`);

    // Size the vertical words so the longest one fits its panel.
    const probe = document.createElement('span');
    probe.className = 'as-vword';
    probe.style.cssText = 'writing-mode:horizontal-tb;font-size:100px;visibility:hidden;position:absolute;left:-9999px';
    probe.textContent = words.reduce((a, b) => (b.length > a.length ? b : a), '');
    stage.appendChild(probe);
    const wordW = probe.getBoundingClientRect().width || 1;
    probe.remove();
    const size = Math.min((H * (portrait ? 0.5 : 0.56)) / (wordW / 100), (P * 0.4) / 0.8);
    stage.style.setProperty('--word-size', `${size.toFixed(1)}px`);

    // Phones keep the figure smaller so the intro above it stays clear.
    walker.current.size(H * (portrait ? 0.46 : narrow ? 0.56 : 0.64));
    const top = section.getBoundingClientRect().top + window.scrollY;
    L.current = {
      W,
      H,
      P,
      portrait,
      top,
      range: section.offsetHeight - H,
      xStart: W * (portrait ? 0.7 : narrow ? 0.66 : 0.68),
      xEnd: W * (portrait ? 0.56 : 0.56),
      offEnd: P * 4,
      feetY: H * 0.905,
    };
    state.current.note = -2;
    update(window.scrollY);
  };

  useEffect(() => {
    if (!walkerRef.current) return;
    walker.current = new Walker(walkerRef.current);
    measure();
    let rt = 0;
    const onResize = () => {
      clearTimeout(rt);
      rt = window.setTimeout(measure, 120);
    };
    window.addEventListener('resize', onResize);
    document.fonts?.ready.then(measure);
    // The walker paints itself as frames become ready. Start streaming right
    // away (low priority, coarse frames first) so the figure can walk as soon
    // as the visitor scrolls.
    loadFirstFrame().then(() => loadAllFrames());
    return () => {
      walker.current?.destroy();
      walker.current = null;
      clearTimeout(rt);
      window.removeEventListener('resize', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words.join('|')]);

  useScrollFrame(update);

  return (
    <section ref={sectionRef} className="as-walk" data-hero="walk" aria-label={label}>
      <div ref={stageRef} className="as-walk-stage is-intro">
        <div ref={wallRef} className="as-wall" aria-hidden>
          {words.slice(0, 6).map((word, i) => {
            const [c, cNum] = COLORS[ORDER[i]];
            const up = i % 2 === 0;
            return (
              <div key={i} className="as-panel as-stucco" style={{ '--c': c, '--c-num': cNum } as CSSProperties}>
                <span className={`as-vword ${up ? 'as-vword--up' : 'as-vword--down'}`}>{word}</span>
                <span className={`as-num ${up ? 'as-num--line' : 'as-num--fill'}`}>{i + 1}</span>
              </div>
            );
          })}
          <div className="as-floor as-concrete" />
        </div>

        <div className="as-light" aria-hidden />

        <div ref={walkerRef} className="as-walker" aria-hidden>
          <div className="as-walker-shadow" />
          <canvas />
        </div>

        <div ref={introRef} className="as-intro">
          {intro}
        </div>

        <div ref={notesRef} className="as-note" aria-live="off">
          {notes.map((n, i) => (
            <div key={i} className="as-note-item" aria-hidden={i !== state.current.note}>
              <p className="as-note-title">{n.title}</p>
              <p className="as-note-body">{n.body}</p>
            </div>
          ))}
        </div>

        <div className="as-walk-foot">
          <span ref={cueRef} className="as-scroll-cue">
            {cue}
          </span>
        </div>
        <div ref={barRef} className="as-walk-progress" aria-hidden />
      </div>
    </section>
  );
}

export default WalkHero;
