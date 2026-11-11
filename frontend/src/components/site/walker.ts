/**
 * The walking figure: 290 pre-rendered WebP frames of one walk cycle, drawn
 * onto a canvas so that every `speed` px of horizontal travel advances one
 * frame — the feet never slide on the floor.
 *
 * Loading is shared by every walker on the site and kept off the critical
 * path. Frames arrive coarse-to-fine (every 16th, then 8th, 4th, 2nd, all),
 * so the figure walks from the first second — just in bigger steps — instead
 * of freezing on frame 0 until the whole cycle has downloaded. Data-saver and
 * slow connections stop at every second frame.
 */
export const WALK = {
  count: 290,
  w: 580,
  h: 1100,
  speed: 4.581,
  ground: 1088.69,
  body: 1081.9,
  center: 0.5,
};

// Versioned folder: served with a one-year immutable cache (see public/_headers).
const BASE = `${import.meta.env.BASE_URL || '/'}walk/v1/`;
const src = (i: number) => `${BASE}w${String(i).padStart(3, '0')}.webp`;

interface Frame {
  img: HTMLImageElement;
  ok: boolean;
  ready: Promise<void>;
}

const frames: Array<Frame | undefined> = new Array(WALK.count);
const subscribers = new Set<() => void>();

function lowBandwidth(): boolean {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (!c) return false;
  return !!c.saveData || /(^|-)2g$/.test(c.effectiveType || '');
}

/** 1 = every frame; 2 = every second frame (the walk stays in step, just coarser). */
export const STRIDE = typeof navigator !== 'undefined' && lowBandwidth() ? 2 : 1;

function loadFrame(i: number): Promise<void> {
  const existing = frames[i];
  if (existing) return existing.ready;
  const img = new Image();
  img.decoding = 'async';
  // Never compete with the page's own images and fonts.
  if (i !== 0) img.fetchPriority = 'low';
  img.src = src(i);
  const f = { img, ok: false } as Frame;
  f.ready = img.decode().then(
    () => {
      f.ok = true;
      subscribers.forEach((fn) => fn());
    },
    () => {},
  );
  frames[i] = f;
  return f.ready;
}

let streaming: Promise<void> | null = null;

/** First frame only — enough to paint the figure standing. */
export function loadFirstFrame(): Promise<void> {
  return loadFrame(0);
}

/** Streams the whole cycle in small batches while the main thread is idle. */
export function loadAllFrames(): Promise<void> {
  if (streaming) return streaming;
  streaming = loadFirstFrame().then(
    () =>
      new Promise<void>((resolve) => {
        // Coarse-to-fine order: each pass fills the gaps of the previous one.
        const queue: number[] = [];
        const seen = new Set<number>([0]);
        for (const step of [16, 8, 4, 2, 1]) {
          if (step < STRIDE) break;
          for (let i = 0; i < WALK.count; i += step) {
            if (!seen.has(i)) {
              seen.add(i);
              queue.push(i);
            }
          }
        }
        let inFlight = 0;
        const MAX = 8;
        const idle =
          (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
            .requestIdleCallback || ((cb: () => void) => window.setTimeout(cb, 16));
        const pump = () => {
          while (inFlight < MAX && queue.length) {
            const i = queue.shift()!;
            inFlight++;
            loadFrame(i).finally(() => {
              inFlight--;
              // Requests and decoding run off the main thread; keep the pipe full
              // even while the visitor is scrolling (idle callbacks would stall).
              if (!queue.length && !inFlight) resolve();
              else pump();
            });
          }
        };
        idle(pump, { timeout: 400 });
      }),
  );
  return streaming;
}

/** Re-draw hook for walkers when more frames arrive. */
export function onFramesChange(fn: () => void): () => void {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

/** The loaded frame closest at or before `idx` (so motion never runs backwards). */
function bestFrame(idx: number): Frame | null {
  for (let k = 0; k < WALK.count; k++) {
    const f = frames[(idx - k + WALK.count) % WALK.count];
    if (f?.ok) return f;
  }
  return null;
}

export class Walker {
  wrap: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  shadow: HTMLElement | null;
  drawn: Frame | null = null;
  k = 1;
  cw = 0;
  ch = 0;
  groundCss = 0;
  step = 1;

  constructor(wrap: HTMLElement) {
    this.wrap = wrap;
    this.canvas = wrap.querySelector('canvas')!;
    this.ctx = this.canvas.getContext('2d');
    this.shadow = wrap.querySelector('.as-walker-shadow');
  }

  /** Scales the figure so its body is `bodyCss` px tall. */
  size(bodyCss: number) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.k = bodyCss / WALK.body;
    this.cw = WALK.w * this.k;
    this.ch = WALK.h * this.k;
    this.groundCss = WALK.ground * this.k;
    this.step = WALK.speed * this.k;
    this.canvas.width = Math.round(this.cw * dpr);
    this.canvas.height = Math.round(this.ch * dpr);
    this.canvas.style.width = `${this.cw}px`;
    this.canvas.style.height = `${this.ch}px`;
    if (this.shadow) this.shadow.style.top = `${this.groundCss}px`;
    this.drawn = null;
  }

  frameAt(dist: number) {
    const n = Math.floor(dist / this.step + 1e-6);
    return { idx: ((n % WALK.count) + WALK.count) % WALK.count, q: n * this.step };
  }

  draw(idx: number) {
    const f = bestFrame(idx);
    if (!f || f === this.drawn || !this.ctx) return;
    this.drawn = f;
    const c = this.canvas;
    this.ctx.clearRect(0, 0, c.width, c.height);
    this.ctx.drawImage(f.img, 0, 0, c.width, c.height);
  }

  place(x: number, feetY: number) {
    const tx = x - this.cw * WALK.center;
    const ty = feetY - this.groundCss;
    this.wrap.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
  }
}
