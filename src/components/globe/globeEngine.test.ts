import {
  buildArc,
  createGlobe,
  decodeMask,
  isLand,
  makeProjector,
  MOSCOW,
  toVec,
} from './globeEngine';

const close = (a: number, b: number) => expect(a).toBeCloseTo(b, 6);

describe('land mask', () => {
  const bits = decodeMask();

  it('has 144×72 cells', () => {
    expect(bits).toHaveLength(144 * 72);
  });

  it('knows land from ocean', () => {
    expect(isLand(bits, MOSCOW.lat, MOSCOW.lon)).toBe(true);
    expect(isLand(bits, 39.9, 116.4)).toBe(true); // Пекин
    expect(isLand(bits, 30, -40)).toBe(false); // Атлантика
    expect(isLand(bits, -30, 80)).toBe(false); // Индийский океан
  });
});

describe('geometry', () => {
  it('maps lat/lon to the unit sphere', () => {
    const v = toVec({ lat: 41.72, lon: 44.79 });
    close(Math.hypot(v.x, v.y, v.z), 1);
    expect(toVec({ lat: 90, lon: 0 }).y).toBeCloseTo(1);
  });

  it('builds an arc from home to the destination, lifted in the middle', () => {
    const from = toVec(MOSCOW);
    const to = toVec({ lat: -6.16, lon: 39.19 });
    const arc = buildArc(from, to, 48);
    expect(arc).toHaveLength(49);
    close(arc[0].x, from.x);
    close(arc[48].z, to.z);
    const mid = arc[24];
    expect(Math.hypot(mid.x, mid.y, mid.z)).toBeGreaterThan(1.05);
  });

  it('projects the sphere centre-front to the canvas centre', () => {
    const proj = makeProjector({ rot: 0, tilt: 0 }, 100, 100, 50);
    const q = proj(0, 0, 1);
    expect(q).toMatchObject({ x: 100, y: 100, z: 1 });
    expect(proj(0, 0, -1).z).toBe(-1);
  });
});

describe('createGlobe', () => {
  it('creates points, arcs per destination and highlights', () => {
    const model = createGlobe(
      [
        { lat: 41, lon: 29 },
        { lat: 40, lon: 116 },
      ],
      { count: 1000, highlight: [1] },
    );
    expect(model.land).toHaveLength(1000);
    expect(model.xyz).toHaveLength(3000);
    expect(model.arcs).toHaveLength(2);
    expect(model.highlight.has(1)).toBe(true);
    const landShare = model.land.reduce((s, v) => s + v, 0) / 1000;
    expect(landShare).toBeGreaterThan(0.2);
    expect(landShare).toBeLessThan(0.45);
  });
});
