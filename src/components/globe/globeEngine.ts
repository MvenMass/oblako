import { LAND_MASK_HEX, MASK_H, MASK_W } from './landMask';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface GeoPoint {
  lat: number;
  lon: number;
}

export interface GlobeModel {
  /** Точки сферы: координаты подряд (x, y, z) и признак суши */
  xyz: Float32Array;
  land: Uint8Array;
  home: Vec3;
  dests: Vec3[];
  arcs: Vec3[][];
  /** Индексы подсвеченных направлений (штампы в профиле) */
  highlight: Set<number>;
}

export interface GlobeView {
  rot: number;
  tilt: number;
  /** Секунды с начала анимации — для бегущих точек и пульса */
  time: number;
  reduced: boolean;
}

export const MOSCOW: GeoPoint = { lat: 55.75, lon: 37.62 };

/** Цвета глобуса — значения токенов из tokens.css (canvas не читает CSS-переменные) */
const C = {
  halo: ['rgba(56,189,232,0.42)', 'rgba(139,108,240,0.14)', 'rgba(56,189,232,0)'],
  sphere: ['rgba(255,255,255,0.95)', 'rgba(227,246,253,0.85)', 'rgba(160,214,238,0.9)'],
  ocean: 'rgba(56,189,232,',
  dest: '#8B6CF0',
  destHighlight: '#E8288E',
  home: '#C8146F',
  homeRing: 'rgba(200,20,111,',
  white: '#FFFFFF',
  gloss: ['rgba(255,255,255,0.55)', 'rgba(255,255,255,0)'],
  rim: 'rgba(255,255,255,0.8)',
};

export function decodeMask(hex: string = LAND_MASK_HEX): Uint8Array {
  const bits = new Uint8Array(MASK_W * MASK_H);
  for (let i = 0; i < hex.length; i++) {
    const v = parseInt(hex[i], 16);
    for (let b = 0; b < 4; b++) bits[i * 4 + b] = (v >> (3 - b)) & 1;
  }
  return bits;
}

export function isLand(bits: Uint8Array, lat: number, lon: number): boolean {
  const j = Math.min(MASK_H - 1, Math.floor(((90 - lat) / 180) * MASK_H));
  const i = Math.min(MASK_W - 1, Math.floor(((lon + 180) / 360) * MASK_W));
  return bits[j * MASK_W + i] === 1;
}

export function toVec({ lat, lon }: GeoPoint): Vec3 {
  const a = (lat * Math.PI) / 180;
  const o = (lon * Math.PI) / 180;
  return { x: Math.cos(a) * Math.sin(o), y: Math.sin(a), z: Math.cos(a) * Math.cos(o) };
}

/** Дуга большого круга, приподнятая над сферой тем выше, чем дальше город */
export function buildArc(from: Vec3, to: Vec3, steps = 48): Vec3[] {
  const dot = Math.max(-1, Math.min(1, from.x * to.x + from.y * to.y + from.z * to.z));
  const om = Math.acos(dot);
  const lift = 0.06 + om * 0.22;
  const sin = Math.sin(om) || 1;
  const out: Vec3[] = [];
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const a = Math.sin((1 - t) * om) / sin;
    const b = Math.sin(t * om) / sin;
    const h = 1 + lift * Math.sin(Math.PI * t);
    out.push({
      x: (a * from.x + b * to.x) * h,
      y: (a * from.y + b * to.y) * h,
      z: (a * from.z + b * to.z) * h,
    });
  }
  return out;
}

export function createGlobe(
  dests: GeoPoint[],
  { home = MOSCOW, count = 5200, highlight = [] as number[] } = {},
): GlobeModel {
  const bits = decodeMask();
  const xyz = new Float32Array(count * 3);
  const land = new Uint8Array(count);
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let k = 0; k < count; k++) {
    const y = 1 - (k / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const x = Math.cos(golden * k) * r;
    const z = Math.sin(golden * k) * r;
    xyz.set([x, y, z], k * 3);
    const lat = (Math.asin(y) * 180) / Math.PI;
    const lon = (Math.atan2(x, z) * 180) / Math.PI;
    land[k] = isLand(bits, lat, lon) ? 1 : 0;
  }

  const homeVec = toVec(home);
  const destVecs = dests.map(toVec);
  return {
    xyz,
    land,
    home: homeVec,
    dests: destVecs,
    arcs: destVecs.map((d) => buildArc(homeVec, d)),
    highlight: new Set(highlight),
  };
}

/** Проекция: вращение вокруг Y, затем наклон вокруг X. z > 0 — лицевая сторона */
export function makeProjector(
  view: Pick<GlobeView, 'rot' | 'tilt'>,
  cx: number,
  cy: number,
  r: number,
) {
  const cr = Math.cos(view.rot);
  const sr = Math.sin(view.rot);
  const ct = Math.cos(view.tilt);
  const st = Math.sin(view.tilt);
  return (x: number, y: number, z: number) => {
    const x1 = x * cr + z * sr;
    const z1 = -x * sr + z * cr;
    const y2 = y * ct - z1 * st;
    const z2 = y * st + z1 * ct;
    return { x: cx + x1 * r, y: cy - y2 * r, z: z2, d: Math.sqrt(x1 * x1 + y2 * y2) };
  };
}

const BUCKETS = 8;

function circle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.moveTo(x + r, y);
  ctx.arc(x, y, r, 0, Math.PI * 2);
}

function radial(
  ctx: CanvasRenderingContext2D,
  coords: [number, number, number, number, number, number],
  stops: string[],
) {
  const g = ctx.createRadialGradient(...coords);
  stops.forEach((c, i) => g.addColorStop(i / (stops.length - 1), c));
  return g;
}

/** Рисует глобус в квадратный canvas размера size×size (в пикселях устройства) */
export function drawGlobe(
  ctx: CanvasRenderingContext2D,
  model: GlobeModel,
  view: GlobeView,
  size: number,
) {
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.36;
  const ds = size / 520;
  const proj = makeProjector(view, cx, cy, R);
  ctx.clearRect(0, 0, size, size);

  // Ореол и сфера
  ctx.fillStyle = radial(ctx, [cx, cy, R * 0.92, cx, cy, R * 1.34], C.halo);
  ctx.beginPath();
  ctx.arc(cx, cy, R * 1.34, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = radial(ctx, [cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R], C.sphere);
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fill();

  // Точки: группируем по глубине, чтобы рисовать одним путём на уровень
  const landPaths: Path2D[] = [];
  const oceanPaths: Path2D[] = [];
  for (let b = 0; b < BUCKETS; b++) {
    landPaths.push(new Path2D());
    oceanPaths.push(new Path2D());
  }
  const n = model.land.length;
  for (let k = 0; k < n; k++) {
    const q = proj(model.xyz[k * 3], model.xyz[k * 3 + 1], model.xyz[k * 3 + 2]);
    if (q.z <= 0) continue;
    const b = Math.min(BUCKETS - 1, Math.floor(q.z * BUCKETS));
    const zb = (b + 0.5) / BUCKETS;
    const path = model.land[k] ? landPaths[b] : oceanPaths[b];
    const r = model.land[k] ? (1.5 + zb * 0.9) * ds : 0.9 * ds;
    path.moveTo(q.x + r, q.y);
    path.arc(q.x, q.y, r, 0, Math.PI * 2);
  }
  for (let b = 0; b < BUCKETS; b++) {
    const z = (b + 0.5) / BUCKETS;
    ctx.fillStyle = `${C.ocean}${(0.1 + 0.14 * z).toFixed(3)})`;
    ctx.fill(oceanPaths[b]);
    ctx.fillStyle = `rgba(${Math.round(56 - 46 * z)},${Math.round(150 - 29 * z)},${Math.round(220 - 52 * z)},${(0.25 + 0.75 * z).toFixed(3)})`;
    ctx.fill(landPaths[b]);
  }

  // Дуги с бегущей головой
  const count = model.arcs.length;
  ctx.lineWidth = 2.4 * ds;
  ctx.lineCap = 'round';
  model.arcs.forEach((arc, i) => {
    const head = view.reduced ? 1 : ((view.time * 0.22 + i / count) % 1) * 1.5;
    const tail = view.reduced ? 0 : Math.max(0, head - 0.55);
    const end = Math.min(1, head);
    let prev: { x: number; y: number; hidden: boolean } | null = null;

    arc.forEach((p, s) => {
      const t = s / (arc.length - 1);
      const q = proj(p.x, p.y, p.z);
      const hidden = q.z < 0 && q.d < 1;
      if (prev && t >= tail && t <= end && !hidden && !prev.hidden) {
        const f = (t - tail) / Math.max(0.0001, end - tail);
        const a = view.reduced ? 0.85 : 0.15 + 0.85 * f;
        ctx.strokeStyle = `rgba(${Math.round(232 - 93 * t)},${Math.round(40 + 68 * t)},${Math.round(142 + 98 * t)},${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
      prev = { x: q.x, y: q.y, hidden };
    });

    if (!view.reduced && head <= 1) {
      const p = arc[Math.round(end * (arc.length - 1))];
      const q = proj(p.x, p.y, p.z);
      if (!(q.z < 0 && q.d < 1)) {
        ctx.fillStyle = radial(
          ctx,
          [q.x, q.y, 0, q.x, q.y, 12 * ds],
          ['rgba(255,255,255,1)', 'rgba(232,40,142,0.8)', 'rgba(232,40,142,0)'],
        );
        ctx.beginPath();
        ctx.arc(q.x, q.y, 12 * ds, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });

  // Метки городов
  ctx.strokeStyle = C.white;
  ctx.lineWidth = 2 * ds;
  model.dests.forEach((d, i) => {
    const q = proj(d.x, d.y, d.z);
    if (q.z <= 0) return;
    const hi = model.highlight.has(i);
    ctx.fillStyle = hi ? C.destHighlight : C.dest;
    ctx.beginPath();
    circle(ctx, q.x, q.y, (hi ? 6 : 4.5) * ds);
    ctx.fill();
    ctx.stroke();
  });

  // Москва с пульсом
  const h = proj(model.home.x, model.home.y, model.home.z);
  if (h.z > 0) {
    const pr = view.reduced ? 0 : (view.time % 2) / 2;
    ctx.strokeStyle = `${C.homeRing}${(1 - pr).toFixed(3)})`;
    ctx.lineWidth = 2 * ds;
    ctx.beginPath();
    ctx.arc(h.x, h.y, (6 + pr * 18) * ds, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = C.home;
    ctx.strokeStyle = C.white;
    ctx.lineWidth = 2.5 * ds;
    ctx.beginPath();
    ctx.arc(h.x, h.y, 6 * ds, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // Блик
  ctx.fillStyle = radial(
    ctx,
    [cx - R * 0.45, cy - R * 0.5, 0, cx - R * 0.45, cy - R * 0.5, R * 0.9],
    C.gloss,
  );
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = C.rim;
  ctx.lineWidth = 1.5 * ds;
  ctx.beginPath();
  ctx.arc(cx, cy, R, Math.PI * 0.95, Math.PI * 1.55);
  ctx.stroke();
}
