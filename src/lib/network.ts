// Lays out the Highlights map: threads are hubs, works and research are fruiting bodies on shared hyphae.
import { ribbon, seeded } from './gesture';

type Pt = [number, number];
export type NetNode = { id: string; href: string; title: string; kind: string; hubs: number[]; x: number; y: number };

export const W = 1320;
export const H = 1060;
const HUBS: Pt[] = [[220, 230], [660, 180], [1100, 230], [370, 790], [950, 790]];

export function layout(items: Omit<NetNode, 'x' | 'y'>[]) {
  const r = seeded('mycelium');
  const nodes: NetNode[] = items.map((n) => {
    const cx = n.hubs.reduce((a, h) => a + HUBS[h][0], 0) / n.hubs.length;
    const cy = n.hubs.reduce((a, h) => a + HUBS[h][1], 0) / n.hubs.length;
    return { ...n, x: cx + (r() - 0.5) * 240, y: cy + (r() - 0.5) * 240 };
  });
  for (let step = 0; step < 500; step++) {
    for (const a of nodes) {
      for (const h of a.hubs) {
        const dx = HUBS[h][0] - a.x, dy = HUBS[h][1] - a.y, d = Math.hypot(dx, dy) || 1;
        const pull = (d - 200) * 0.02;
        a.x += (dx / d) * pull;
        a.y += (dy / d) * pull;
      }
      for (const h of HUBS) {
        const dx = a.x - h[0], dy = a.y - h[1], d = Math.hypot(dx, dy) || 1;
        if (d < 125) { a.x += (dx / d) * (125 - d) * 0.3; a.y += (dy / d) * (125 - d) * 0.3; }
      }
      for (const b of nodes) {
        if (a === b) continue;
        const dx = a.x - b.x, dy = (a.y - b.y) * 1.2, d = Math.hypot(dx, dy) || 1;
        if (d < 158) { a.x += (dx / d) * (158 - d) * 0.16; a.y += (dy / d) * (158 - d) * 0.16; }
      }
      a.x = Math.min(W - 70, Math.max(70, a.x));
      a.y = Math.min(H - 80, Math.max(50, a.y));
    }
  }

  const bend = (a: Pt, b: Pt, amount: number): Pt[] => {
    const nx = -(b[1] - a[1]), ny = b[0] - a[0], len = Math.hypot(nx, ny) || 1;
    const o = () => (r() - 0.5) * amount;
    const at = (t: number, off: number): Pt => [a[0] + (b[0] - a[0]) * t + (nx / len) * off, a[1] + (b[1] - a[1]) * t + (ny / len) * off];
    return [a, at(0.33, o()), at(0.66, o()), b];
  };
  const edges: { d: string; from: string; to: string; width: number }[] = [];
  // Trunks between the hubs.
  HUBS.forEach((a, i) => HUBS.forEach((b, j) => {
    if (j > i && Math.hypot(a[0] - b[0], a[1] - b[1]) < 820) edges.push({ d: ribbon(bend(a, b, 150), 2.2, r, 0.5), from: `hub${i}`, to: `hub${j}`, width: 2 });
  }));
  for (const n of nodes) {
    for (const h of n.hubs) {
      const pts = bend(HUBS[h], [n.x, n.y], 70);
      edges.push({ d: ribbon(pts, 1.7, r, 0.25), from: `hub${h}`, to: n.id, width: 1 });
      // Fine side branches, as hyphae fork.
      const forks = 1 + Math.floor(r() * 3);
      for (let f = 0; f < forks; f++) {
        const t = 0.25 + r() * 0.5;
        const sx = HUBS[h][0] + (n.x - HUBS[h][0]) * t, sy = HUBS[h][1] + (n.y - HUBS[h][1]) * t;
        const end: Pt = [sx + (r() - 0.5) * 120, sy + (r() - 0.5) * 120];
        edges.push({ d: ribbon(bend([sx, sy], end, 30), 0.6, r, 0.2), from: `hub${h}`, to: n.id, width: 0 });
      }
    }
  }
  return { nodes, edges, hubs: HUBS };
}
