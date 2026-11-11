/**
 * The walking figure: 290 pre-rendered WebP frames of one walk cycle, drawn
 * onto a canvas so that every `speed` px of horizontal travel advances one
 * frame — the feet never slide on the floor.
 *
 * Download is shared by every walker on the site and kept off the critical
 * path. Frames arrive coarse-to-fine (every 16th, then 8th, 4th, 2nd, all),
 * so the figure walks from the first second — just in bigger steps — instead
 * of freezing on frame 0 until the whole cycle has downloaded. Data-saver and
 * slow connections stop at every second frame.
 *
 * Drawing never decodes. A "decoded" <img> is only decoded for a moment: the
 * browser drops the pixels again, so every new pose used to cost a full
 * 580×1100 decode plus a downscale on the main thread. Instead each walker
 * keeps ImageBitmaps already scaled to its canvas, produced in worker threads
 * for the frames around its current pose, within a memory budget. A new pose
 * is then a plain copy.
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
const mod = (i: number) => ((i % WALK.count) + WALK.count) % WALK.count;

function lowBandwidth(): boolean {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (!c) return false;
  return !!c.saveData || /(^|-)2g$/.test(c.effectiveType || '');
}

/** 1 = every frame; 2 = every second frame (the walk stays in step, just coarser). */
export const STRIDE = typeof navigator !== 'undefined' && lowBandwidth() ? 2 : 1;

/* ------------------------------------------------------------------ */
/* Download: compressed frames only (~12 MB for the whole cycle).      */
/* ------------------------------------------------------------------ */

const blobs: Array<Blob | undefined> = new Array(WALK.count);
const fetches: Array<Promise<void> | undefined> = new Array(WALK.count);

function fetchFrame(i: number): Promise<void> {
  return (fetches[i] ??= fetch(src(i), { priority: i === 0 ? 'high' : 'low' })
    .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
    .then(
      (blob) => {
        blobs[i] = blob;
        schedule();
      },
      () => {},
    ));
}

let streaming: Promise<void> | null = null;

/** First frame only — enough to paint the figure standing. */
export function loadFirstFrame(): Promise<void> {
  return fetchFrame(0);
}

/** Streams the whole cycle in small batches, never ahead of the page's own assets. */
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
            fetchFrame(i).finally(() => {
              inFlight--;
              // Requests run off the main thread; keep the pipe full even while
              // the visitor is scrolling (idle callbacks would stall).
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

/* ------------------------------------------------------------------ */
/* Decode: worker threads turn a frame into a canvas-sized bitmap.     */
/* ------------------------------------------------------------------ */

type Picture = ImageBitmap | HTMLImageElement;

interface Slot {
  worker: Worker;
  done: ((bitmap: ImageBitmap | null) => void) | null;
}

const POOL = 2;
let slots: Slot[] | null = null;

function pool(): Slot[] {
  if (slots) return slots;
  slots = [];
  if (typeof Worker === 'undefined' || typeof createImageBitmap !== 'function') return slots;
  try {
    for (let n = 0; n < POOL; n++) {
      const slot: Slot = {
        worker: new Worker(new URL('./walker.worker.ts', import.meta.url), { type: 'module' }),
        done: null,
      };
      slot.worker.onmessage = (e: MessageEvent<ImageBitmap | null>) => {
        const done = slot.done;
        slot.done = null;
        done?.(e.data);
      };
      // A worker that cannot start (old engine, blocked script): decode here instead.
      slot.worker.onerror = () => {
        const all = slots || [];
        slots = [];
        all.forEach((s) => {
          s.worker.terminate();
          s.done?.(null);
          s.done = null;
        });
      };
      slots.push(slot);
    }
  } catch {
    slots = [];
  }
  return slots;
}

/** True while frames are scaled in workers; otherwise they stay full size. */
const scaled = () => pool().length > 0;

async function decodeHere(blob: Blob): Promise<Picture | null> {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(blob);
    } catch {
      /* fall through to <img> */
    }
  }
  const img = new Image();
  const url = URL.createObjectURL(blob);
  img.src = url;
  try {
    await img.decode();
    return img;
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function decode(blob: Blob, w: number, h: number): Promise<Picture | null> {
  const slot = pool().find((s) => !s.done);
  if (!slot) return decodeHere(blob);
  return new Promise<ImageBitmap | null>((resolve) => {
    slot.done = resolve;
    slot.worker.postMessage({ blob, w, h });
  }).then((bitmap) => bitmap || decodeHere(blob));
}

const release = (p: Picture | null | undefined) => {
  if (p && 'close' in p) p.close();
};

/* ------------------------------------------------------------------ */
/* Scheduling: which frame to decode next, and for which walker.       */
/* ------------------------------------------------------------------ */

const walkers = new Set<Walker>();
/** The walker that moved last; the others keep only a few frames ready. */
let active: Walker | null = null;
let decoding = 0;
/** Running average of one decode, to aim ahead of a fast walk. */
let decodeMs = 16;
const IDLE_FRAMES = 6;

/** Decoded pixels kept per walker: phones and low-memory devices get a smaller window. */
let budget = 0;
function budgetBytes(): number {
  if (budget) return budget;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const coarse = window.matchMedia?.('(pointer: coarse)').matches;
  budget = (coarse || (mem !== undefined && mem <= 4) ? 128 : 320) * 1024 * 1024;
  return budget;
}

function activate(w: Walker) {
  active = w;
}

function schedule() {
  if (!walkers.size) return;
  const order = [...walkers].sort((a, b) => Number(b === active) - Number(a === active));
  for (const w of order) w.trim();
  for (const w of order) {
    while (decoding < POOL) {
      const i = w.next();
      if (i < 0) break;
      w.request(i);
    }
  }
}

export class Walker {
  wrap: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  shadow: HTMLElement | null;
  k = 1;
  cw = 0;
  ch = 0;
  groundCss = 0;
  step = 1;

  /** Ready-to-blit frames, keyed by frame index. */
  private pictures = new Map<number, Picture>();
  private pending = new Set<number>();
  private failed = new Set<number>();
  /** Bumped whenever the canvas size changes: late results for the old size are dropped. */
  private epoch = 0;
  private dead = false;
  /** Wanted pose, walking direction and speed (frames per ms). */
  private idx = 0;
  private dir = 1;
  private pace = 0;
  private movedAt = 0;
  /** Frame on the canvas now; `stale` = it was scaled from the previous canvas size. */
  private drawn = -1;
  private stale = false;

  constructor(wrap: HTMLElement) {
    this.wrap = wrap;
    this.canvas = wrap.querySelector('canvas')!;
    this.ctx = this.canvas.getContext('2d');
    this.shadow = wrap.querySelector('.as-walker-shadow');
    walkers.add(this);
    if (!active) activate(this);
  }

  destroy() {
    this.dead = true;
    walkers.delete(this);
    if (active === this) active = walkers.values().next().value ?? null;
    this.pictures.forEach(release);
    this.pictures.clear();
    this.pending.clear();
  }

  /** Scales the figure so its body is `bodyCss` px tall. */
  size(bodyCss: number) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.k = bodyCss / WALK.body;
    this.cw = WALK.w * this.k;
    this.ch = WALK.h * this.k;
    this.groundCss = WALK.ground * this.k;
    this.step = WALK.speed * this.k;
    this.canvas.style.width = `${this.cw}px`;
    this.canvas.style.height = `${this.ch}px`;
    if (this.shadow) this.shadow.style.top = `${this.groundCss}px`;

    const w = Math.round(this.cw * dpr);
    const h = Math.round(this.ch * dpr);
    // Same pixel size (fonts loaded, page height changed): keep the canvas and its frames.
    if (w === this.canvas.width && h === this.canvas.height) return;
    const last = this.pictures.get(this.drawn);
    this.canvas.width = w;
    this.canvas.height = h;
    // Resizing clears the canvas: put the current pose back until its sharp copy is ready.
    if (last && this.ctx) {
      this.ctx.drawImage(last, 0, 0, w, h);
      this.stale = true;
    } else {
      this.drawn = -1;
    }
    this.epoch++;
    this.pictures.forEach(release);
    this.pictures.clear();
    this.pending.clear();
    schedule();
  }

  frameAt(dist: number) {
    const n = Math.floor(dist / this.step + 1e-6);
    return { idx: mod(n), q: n * this.step };
  }

  draw(idx: number) {
    if (idx !== this.idx) {
      const now = performance.now();
      let d = idx - this.idx;
      if (d > WALK.count / 2) d -= WALK.count;
      else if (d < -WALK.count / 2) d += WALK.count;
      const dt = now - this.movedAt;
      this.pace = dt < 250 ? this.pace * 0.7 + (Math.abs(d) / Math.max(dt, 1)) * 0.3 : 0;
      this.dir = d > 0 ? 1 : -1;
      this.movedAt = now;
      this.idx = idx;
      activate(this);
      this.paint();
      schedule();
    } else {
      this.paint();
    }
  }

  place(x: number, feetY: number) {
    const tx = x - this.cw * WALK.center;
    const ty = feetY - this.groundCss;
    this.wrap.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
  }

  /** Blits the ready frame closest at or before the wanted pose (motion never runs backwards). */
  private paint() {
    if (!this.ctx) return;
    let best = -1;
    for (let k = 0; k < WALK.count; k++) {
      const i = mod(this.idx - k);
      if (this.pictures.has(i)) {
        best = i;
        break;
      }
    }
    if (best < 0) return;
    if (this.drawn >= 0) {
      // Keep what is on screen unless the new frame is a closer pose (or a sharper copy).
      const now = mod(this.idx - this.drawn);
      const then = mod(this.idx - best);
      if (this.stale ? now < then : now <= then) return;
    }
    const c = this.canvas;
    this.ctx.clearRect(0, 0, c.width, c.height);
    this.ctx.drawImage(this.pictures.get(best)!, 0, 0, c.width, c.height);
    this.drawn = best;
    this.stale = false;
  }

  /** How many frames ahead of / behind the pose stay decoded. */
  private window(): { ahead: number; behind: number } {
    const fit = scaled() && this.canvas.width <= WALK.w;
    const bytes = (fit ? this.canvas.width * this.canvas.height : WALK.w * WALK.h) * 4;
    const room = Math.max(24, Math.floor(budgetBytes() / Math.max(bytes, 1)));
    const cap = active && active !== this ? IDLE_FRAMES : Math.min(WALK.count, room);
    if (cap >= WALK.count) return { ahead: WALK.count - 1, behind: 0 };
    const ahead = Math.round((cap - 1) * 0.75);
    return { ahead, behind: cap - 1 - ahead };
  }

  /** @internal Next frame worth decoding, or -1. */
  next(): number {
    if (this.dead || !this.canvas.width) return -1;
    const { ahead, behind } = this.window();
    const want = (i: number) => !!blobs[i] && !this.pictures.has(i) && !this.pending.has(i) && !this.failed.has(i);
    // While walking fast, aim where the figure will be when the decode lands.
    const lead = Math.min(ahead >> 1, Math.round(this.pace * decodeMs));
    for (let d = lead; d <= ahead; d++) {
      const i = mod(this.idx + this.dir * d);
      if (want(i)) return i;
    }
    for (let d = 0; d < lead; d++) {
      const i = mod(this.idx + this.dir * d);
      if (want(i)) return i;
    }
    for (let d = 1; d <= behind; d++) {
      const i = mod(this.idx - this.dir * d);
      if (want(i)) return i;
    }
    return -1;
  }

  /** @internal Decodes frame `i` at this walker's canvas size. */
  request(i: number) {
    const epoch = this.epoch;
    const started = performance.now();
    const fit = scaled() && this.canvas.width <= WALK.w;
    this.pending.add(i);
    decoding++;
    decode(blobs[i]!, fit ? this.canvas.width : 0, fit ? this.canvas.height : 0).then((picture) => {
      decoding--;
      decodeMs = decodeMs * 0.8 + (performance.now() - started) * 0.2;
      if (this.dead || epoch !== this.epoch) {
        release(picture);
      } else {
        this.pending.delete(i);
        if (picture) {
          this.pictures.set(i, picture);
          this.paint();
        } else {
          this.failed.add(i);
        }
      }
      schedule();
    });
  }

  /** @internal Frees frames that fell out of the window. */
  trim() {
    const { ahead, behind } = this.window();
    const cap = ahead + behind + 1;
    while (this.pictures.size > cap) {
      let worst = -1;
      let far = 0;
      for (const i of this.pictures.keys()) {
        const a = mod((i - this.idx) * this.dir);
        const out = a <= ahead || WALK.count - a <= behind ? 0 : Math.min(a - ahead, WALK.count - a - behind);
        if (out > far) {
          far = out;
          worst = i;
        }
      }
      if (worst < 0) break;
      release(this.pictures.get(worst));
      this.pictures.delete(worst);
    }
  }
}
