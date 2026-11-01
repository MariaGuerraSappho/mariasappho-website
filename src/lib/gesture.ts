// The Maria Sappho gestures. Each kind of material moves differently, like a hand or mallet
// on a piano, and the work's slug seeds the performance, so every work gets its own mark.
type Pt = [number, number];
export type Shape = { d: string; opacity: number; spine?: string; width?: number };

// The line the hand travelled for each ribbon, used to draw the mark in.
const spines = new Map<string, { spine: string; width: number }>();

// An autumn palette, drawn from the brass and wood of the piano and from leaf, earth and rust.
const c = {
  oxblood: '#8f2f2c', rust: '#a8492a', sienna: '#b5623a', ochre: '#c08f3a', mustard: '#b79a3e',
  moss: '#7b8048', olive: '#737a45', umber: '#8a5f42', burgundy: '#7c2232', bone: '#d9c9ae', wine: '#5f1b2a',
};
const palettes: Record<string, [string, string][]> = {
  performance: [[c.rust, c.oxblood], [c.oxblood, c.burgundy], [c.sienna, c.oxblood]],
  recording: [[c.ochre, c.rust], [c.mustard, c.umber], [c.sienna, c.ochre]],
  score: [[c.bone, c.umber], [c.bone, c.ochre], [c.burgundy, c.wine]],
  instrument: [[c.ochre, c.umber], [c.mustard, c.bone], [c.ochre, c.sienna]],
  installation: [[c.moss, c.olive], [c.moss, c.ochre], [c.olive, c.bone]],
  film: [[c.wine, c.oxblood], [c.wine, c.burgundy], [c.umber, c.wine]],
  book: [[c.sienna, c.bone], [c.rust, c.burgundy], [c.ochre, c.rust]],
  'visual-art': [[c.wine, c.rust], [c.olive, c.wine], [c.oxblood, c.ochre]],
  collaboration: [[c.rust, c.moss], [c.oxblood, c.ochre], [c.wine, c.ochre]],
  article: [[c.burgundy, c.ochre], [c.bone, c.moss], [c.ochre, c.bone]],
  thesis: [[c.wine, c.ochre], [c.wine, c.ochre], [c.wine, c.ochre]],
};
const aliases: Record<string, string> = { 'video-article': 'film', chapter: 'score', conference: 'performance' };

export function seeded(text: string) {
  let h = 2166136261;
  for (const c of text) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

// Smooth curve through the points the hand passes.
function curve(pts: Pt[], steps = 9): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [p0, p1, p2, p3] = [pts[i - 1] ?? pts[i], pts[i], pts[i + 1], pts[i + 2] ?? pts[i + 1]];
    for (let s = 0; s < steps; s++) {
      const t = s / steps, t2 = t * t, t3 = t2 * t;
      const at = (k: 0 | 1) => 0.5 * (2 * p1[k] + (p2[k] - p0[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (3 * p1[k] - p0[k] - 3 * p2[k] + p3[k]) * t3);
      out.push([at(0), at(1)]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

// A stroke whose width follows the pressure of the gesture: light, heavy, then lifted.
export function ribbon(pts: Pt[], weight: number, r: () => number, peak = 0.35): string {
  const line = curve(pts);
  const n = line.length;
  const left: string[] = [];
  const right: string[] = [];
  const grain = r() * 6;
  const shake = r() * 6;
  line.forEach(([px, py], i) => {
    const t = i / (n - 1);
    // The small unsteadiness of a real hand.
    const x = px + Math.sin(t * 7 + shake) * 1.3 + Math.sin(t * 19 + grain) * 0.5;
    const y = py + Math.cos(t * 9 + shake) * 1.3 + Math.sin(t * 23 + shake) * 0.5;
    const [ax, ay] = line[Math.max(0, i - 1)];
    const [bx, by] = line[Math.min(n - 1, i + 1)];
    const len = Math.hypot(bx - ax, by - ay) || 1;
    const rise = t < peak ? t / peak : (1 - t) / (1 - peak);
    const w = weight * Math.pow(Math.max(rise, 0), 0.7) * (0.72 + 0.2 * Math.sin(t * 11 + grain) + 0.12 * Math.sin(t * 29 + shake)) + 0.15;
    const nx = -(by - ay) / len, ny = (bx - ax) / len;
    left.push(`${(x + nx * w).toFixed(1)} ${(y + ny * w).toFixed(1)}`);
    right.unshift(`${(x - nx * w).toFixed(1)} ${(y - ny * w).toFixed(1)}`);
  });
  const d = `M${left.join('L')}L${right.join('L')}Z`;
  const step = Math.max(1, Math.floor(n / 14));
  const kept = line.filter((_, i) => i % step === 0 || i === n - 1);
  spines.set(d, { spine: `M${kept.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}`, width: weight * 2.4 + 7 });
  return d;
}

const dot = (x: number, y: number, s: number) =>
  `M${(x - s).toFixed(1)} ${y.toFixed(1)}a${s.toFixed(1)} ${(s * 0.8).toFixed(1)} 0 1 0 ${(s * 2).toFixed(1)} 0a${s.toFixed(1)} ${(s * 0.8).toFixed(1)} 0 1 0 ${(-s * 2).toFixed(1)} 0Z`;

const between = (r: () => number, a: number, b: number) => a + r() * (b - a);

const gestures: Record<string, (r: () => number) => Shape[]> = {
  // A whole-arm sweep that lands in a strike.
  performance(r) {
    const flip = r() < 0.5 ? -1 : 1;
    const x = (v: number) => (flip > 0 ? v : 100 - v);
    const land: Pt = [x(between(r, 74, 88)), between(r, 66, 84)];
    const path: Pt[] = [[x(between(r, 8, 20)), between(r, 60, 84)], [x(between(r, 26, 40)), between(r, 16, 36)], [x(between(r, 52, 66)), between(r, 18, 40)], land];
    const out = [{ d: ribbon(path, 7.5, r, 0.72), opacity: 1 }];
    out.push({ d: ribbon(path.map(([a, b]) => [a + 3, b + 8] as Pt), 1.3, r, 0.5), opacity: 0.55 });
    const n = 4 + Math.floor(r() * 5);
    for (let i = 0; i < n; i++) out.push({ d: dot(land[0] + between(r, -14, 14), land[1] + between(r, -10, 13), between(r, 0.7, 2.6)), opacity: 0.9 });
    return out;
  },
  // Sound looping back on itself.
  recording(r) {
    const turns = 2.2 + r() * 1.6;
    const start = r() * 6.3;
    const cx = between(r, 46, 54), cy = between(r, 46, 54);
    const pts: Pt[] = [];
    for (let i = 0; i <= 24; i++) {
      const t = i / 24, a = start + t * turns * 6.283, rad = (6 + t * 34) * between(r, 0.86, 1.14);
      pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad * 0.82]);
    }
    return [{ d: ribbon(pts, 3.6, r, 0.6), opacity: 1 }, { d: dot(cx, cy, 2.8), opacity: 1 }];
  },
  // Staccato attacks climbing the keyboard.
  score(r) {
    const n = 5 + Math.floor(r() * 4);
    const rise = between(r, -7, 7);
    const out: Shape[] = [];
    for (let i = 0; i < n; i++) {
      const x = 14 + (i * 72) / (n - 1);
      const y = 50 + (i - n / 2) * rise + between(r, -9, 9);
      const h = between(r, 8, 24);
      const lean = between(r, 2, 8);
      out.push({ d: ribbon([[x - lean, y + h], [x, y], [x + lean, y - h]], 2.8, r, 0.3), opacity: 0.95 });
    }
    return out;
  },
  // Strings struck inside the piano, one pulled out of line.
  instrument(r) {
    const n = 5 + Math.floor(r() * 3);
    const pull = Math.floor(r() * n);
    const at = between(r, 34, 66);
    const lean = between(r, -10, 10);
    const out: Shape[] = [];
    for (let i = 0; i < n; i++) {
      const y = 22 + (i * 56) / (n - 1);
      const bend = i === pull ? between(r, 12, 18) : between(r, -1, 1);
      out.push({ d: ribbon([[8, y + lean], [at, y + bend], [92, y - lean]], i === pull ? 1.7 : 0.9, r, 0.5), opacity: i === pull ? 1 : 0.8 });
    }
    out.push({ d: dot(at, 22 + (pull * 56) / (n - 1) + 17, 4), opacity: 1 });
    return out;
  },
  // Slow arcs that open up a space.
  installation(r) {
    const n = 3 + Math.floor(r() * 2);
    const out: Shape[] = [];
    for (let i = 0; i < n; i++) {
      const w = between(r, 26, 42), cx = between(r, 38, 62), base = between(r, 72, 88), top = between(r, 12, 38);
      out.push({ d: ribbon([[cx - w, base], [cx - w * 0.6, top + 12], [cx + w * 0.3, top], [cx + w, base - 4]], 3.4, r, 0.5), opacity: 0.8 });
    }
    return out;
  },
  // One gesture strobed across the frame.
  film(r) {
    const a: Pt = [between(r, 10, 22), between(r, 26, 72)];
    const b: Pt = [between(r, 36, 50), between(r, 10, 34)];
    const c: Pt = [between(r, 58, 70), between(r, 62, 90)];
    const out: Shape[] = [];
    for (let i = 0; i < 6; i++) {
      const dx = i * 5.5, dy = i * between(r, -1, 1.5);
      out.push({ d: ribbon([a, b, c].map(([x, y]) => [x + dx, y + dy] as Pt), 2 + i * 0.5, r, 0.45), opacity: 0.25 + i * 0.15 });
    }
    return out;
  },
  // Two hands opening from one spine.
  book(r) {
    const s = between(r, 10, 22), e = between(r, 72, 90);
    const lift = between(r, 24, 42), reach = between(r, 34, 44);
    const out: Shape[] = [];
    for (const side of [-1, 1]) {
      out.push({ d: ribbon([[50, e], [50 + side * reach * 0.4, lift + 20], [50 + side * reach, lift], [50 + side * reach * 1.05, s]], 4.6, r, 0.3), opacity: 1 });
    }
    return out;
  },
  // Broad washes laid over one another.
  'visual-art'(r) {
    const n = 3 + Math.floor(r() * 2);
    const out: Shape[] = [];
    for (let i = 0; i < n; i++) {
      const a = r() * 6.283, l = between(r, 26, 40), cx = between(r, 36, 64), cy = between(r, 36, 64);
      const dx = Math.cos(a) * l, dy = Math.sin(a) * l;
      out.push({ d: ribbon([[cx - dx, cy - dy], [cx + dy * 0.2, cy - dx * 0.2], [cx + dx, cy + dy]], between(r, 8, 13), r, 0.4), opacity: 0.75 });
    }
    return out;
  },
  // Two lines improvising around each other.
  collaboration(r) {
    const phase = r() * 3, f = between(r, 1.4, 2.4);
    const make = (off: number) => {
      const pts: Pt[] = [];
      for (let i = 0; i <= 8; i++) {
        const t = i / 8;
        pts.push([8 + t * 84, 50 + Math.sin(t * f * 6.283 + phase + off) * (30 - t * 8)]);
      }
      return pts;
    };
    return [{ d: ribbon(make(0), 4.4, r, 0.4), opacity: 1 }, { d: ribbon(make(2.4), 2.4, r, 0.6), opacity: 0.85 }];
  },
  // A single line of thought, written quickly.
  article(r) {
    const y = between(r, 40, 60), amp = between(r, 14, 26);
    const line: Pt[] = [[8, y + amp], [28, y - amp], [50, y + amp * 0.7], [72, y - amp * 0.9], [92, y + amp * 0.2]];
    const n = 2 + Math.floor(r() * 3);
    const out = [{ d: ribbon(line, 2.6, r, 0.45), opacity: 1 }];
    for (let i = 0; i < n; i++) out.push({ d: dot(between(r, 18, 86), between(r, 16, 84), between(r, 0.8, 2)), opacity: 0.85 });
    return out;
  },
  thesis(r) {
    return [...gestures.article(r), ...gestures.article(r).map((s) => ({ ...s, opacity: 0.55 }))];
  },
};

// Other ways each kind of material can move.
const scatter = (r: () => number, x: number, y: number, n: number, spread: number): Shape[] =>
  Array.from({ length: n }, () => ({ d: dot(x + between(r, -spread, spread), y + between(r, -spread, spread), between(r, 0.6, 2.4)), opacity: 0.9 }));

const alternatives: Record<string, ((r: () => number) => Shape[])[]> = {
  performance: [
    // A jagged run of attacks.
    (r) => {
      const n = 4 + Math.floor(r() * 3);
      const pts: Pt[] = Array.from({ length: n }, (_, i) => [10 + (i * 80) / (n - 1), i % 2 ? between(r, 16, 34) : between(r, 62, 86)]);
      return [{ d: ribbon(pts, 4.6, r, 0.2), opacity: 1 }, ...scatter(r, pts[n - 1][0], pts[n - 1][1], 5, 9)];
    },
    // Both arms at once.
    (r) => {
      const y = between(r, 26, 44);
      return [
        { d: ribbon([[8, y + 34], [30, y], [54, y + 10]], 6, r, 0.5), opacity: 1 },
        { d: ribbon([[92, y + 40], [68, y + 6], [44, y + 26]], 6, r, 0.5), opacity: 0.85 },
      ];
    },
    // A single falling slash.
    (r) => {
      const x = between(r, 58, 78);
      return [{ d: ribbon([[x, 8], [x - 12, 44], [x - 42, 90]], 9, r, 0.25), opacity: 1 }, ...scatter(r, x - 34, 78, 7, 13)];
    },
  ],
  recording: [
    // A scribbled loop.
    (r) => {
      let x = between(r, 20, 40), y = between(r, 30, 70), dir = r() * 6.283;
      const pts: Pt[] = Array.from({ length: 16 }, () => {
        dir += between(r, 1.1, 2.3);
        x = Math.min(90, Math.max(10, x + Math.cos(dir) * between(r, 18, 34)));
        y = Math.min(88, Math.max(12, y + Math.sin(dir) * between(r, 16, 30)));
        return [x, y];
      });
      return [{ d: ribbon(pts, 2.2, r, 0.5), opacity: 1 }];
    },
    // A long decaying waveform.
    (r) => {
      const f = between(r, 3, 6);
      const pts: Pt[] = Array.from({ length: 25 }, (_, i) => {
        const t = i / 24;
        return [6 + t * 88, 50 + Math.sin(t * f * 6.283) * 36 * (1 - t) ** 1.2];
      });
      return [{ d: ribbon(pts, 3.4, r, 0.15), opacity: 1 }];
    },
  ],
  score: [
    // Stacked chords.
    (r) => {
      const out: Shape[] = [];
      for (let c = 0; c < 3; c++) {
        const x = 20 + c * 30, n = 3 + Math.floor(r() * 3);
        for (let i = 0; i < n; i++) out.push({ d: ribbon([[x - 9, 26 + i * 11 + c * 4], [x, 25 + i * 11 + c * 4], [x + 9, 24 + i * 11 + c * 4]], 2.6, r, 0.5), opacity: 0.95 });
      }
      return out;
    },
    // A tremolo between two notes.
    (r) => {
      const pts: Pt[] = Array.from({ length: 13 }, (_, i) => [8 + i * 7, 50 + (i % 2 ? -1 : 1) * (6 + i * 1.8) + between(r, -3, 3)]);
      return [{ d: ribbon(pts, 1.9, r, 0.8), opacity: 1 }];
    },
  ],
  instrument: [
    // Strings fanning out from the bridge.
    (r) => {
      const n = 6 + Math.floor(r() * 3), x = between(r, 12, 30), y = between(r, 76, 90);
      return Array.from({ length: n }, (_, i) => ({
        d: ribbon([[x, y], [x + 30, y - 34 - i * 2], [90, 8 + (i * 74) / (n - 1)]], i === 2 ? 1.8 : 1, r, 0.6),
        opacity: 0.9,
      }));
    },
  ],
  installation: [
    // Bands of landscape.
    (r) => Array.from({ length: 4 }, (_, i) => {
      const y = 24 + i * 16;
      return { d: ribbon([[6, y + between(r, -5, 5)], [36, y + between(r, -11, 11)], [66, y + between(r, -11, 11)], [94, y + between(r, -5, 5)]], 3 + i * 0.8, r, 0.5), opacity: 0.85 };
    }),
    // Ripples spreading through a room.
    (r) => {
      const cx = between(r, 34, 66), cy = between(r, 40, 66);
      return Array.from({ length: 4 }, (_, i) => {
        const rad = (10 + i * 11) * between(r, 0.9, 1.1), start = r() * 6.283;
        const pts: Pt[] = Array.from({ length: 9 }, (_, k) => {
          const a = start + (k / 8) * 4.6;
          return [cx + Math.cos(a) * rad * between(r, 0.93, 1.07), cy + Math.sin(a) * rad * between(r, 0.8, 0.98)];
        });
        return { d: ribbon(pts, 2.5, r, 0.5), opacity: 1 - i * 0.14 };
      });
    },
  ],
  film: [
    // A turning reel.
    (r) => {
      const start = r() * 6.283;
      return Array.from({ length: 7 }, (_, i) => {
        const a = start + i * 0.9;
        return { d: ribbon([[50, 50], [50 + Math.cos(a + 0.4) * 22, 50 + Math.sin(a + 0.4) * 22], [50 + Math.cos(a) * 42, 50 + Math.sin(a) * 42]], 3, r, 0.5), opacity: 0.3 + i * 0.11 };
      });
    },
  ],
  book: [
    // Pages falling open.
    (r) => Array.from({ length: 5 }, (_, i) => {
      const x = 14 + i * 16, h = between(r, 34, 62);
      return { d: ribbon([[50, 86], [(50 + x) / 2, 56], [x, 86 - h]], 2.6, r, 0.5), opacity: 0.6 + i * 0.1 };
    }),
  ],
  'visual-art': [
    // Blots thrown from the brush.
    (r) => [
      { d: ribbon([[14, 60], [40, 34], [62, 58], [88, 30]], 13, r, 0.4), opacity: 0.8 },
      ...scatter(r, 58, 66, 9, 26).map((s) => ({ ...s, opacity: 1 })),
    ],
  ],
};

// How far each mark may turn: scores and strings keep their sense of direction.
const turn: Record<string, number> = { score: 28, instrument: 42, book: 26, performance: 170, installation: 24 };

export function gesture(kind: string, seed: string) {
  const key = aliases[kind] ?? kind;
  const options = [gestures[key] ?? gestures.article, ...(alternatives[key] ?? [])];
  const id = `g${(Math.abs([...`${kind}${seed}`].reduce((a, c) => Math.imul(a, 31) + c.charCodeAt(0), 7)) >>> 0).toString(36)}`;
  const r = seeded(`${kind}:${seed}`);
  for (let i = 0; i < 4; i++) r();
  const family = palettes[key] ?? palettes.article;
  const colors = family[Math.floor(r() * family.length)];
  const angle = Math.floor(r() * 360);
  const limit = turn[key] ?? 180;
  const rotate = Math.round((r() * 2 - 1) * limit);
  const flip = r() < 0.5 ? -1 : 1;
  const draw = options[Math.floor(r() * options.length)];
  const shapes = draw(r).map((shape) => ({ ...shape, ...spines.get(shape.d) }));
  spines.clear();
  return { id, angle, colors, shapes, transform: `rotate(${rotate} 50 50) translate(50 0) scale(${flip} 1) translate(-50 0)` };
}
