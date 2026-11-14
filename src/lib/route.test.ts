import { getCity } from './cities';
import {
  dayTotals,
  defaultRoute,
  distanceKm,
  durationMinutes,
  formatTime,
  move,
  optimize,
  schedule,
  walkMinutes,
} from './route';

const tbilisi = getCity('tbilisi')!;

describe('route helpers', () => {
  it('parses durations', () => {
    expect(durationMinutes('1–1,5 ч')).toBe(90);
    expect(durationMinutes('2–3 ч')).toBe(180);
    expect(durationMinutes('30 мин')).toBe(30);
    expect(durationMinutes('полдня')).toBe(90);
  });

  it('estimates walking time at 5 km/h, at least 3 minutes', () => {
    expect(walkMinutes(1)).toBe(12);
    expect(walkMinutes(0.05)).toBe(3);
  });

  it('builds a default route over three days from the city places', () => {
    const days = defaultRoute(tbilisi);
    expect(days).toHaveLength(3);
    expect(days.flatMap((d) => d.stops)).toHaveLength(tbilisi.places.length);
  });

  it('schedules a day from 10:00 with walking between stops', () => {
    const [day] = defaultRoute(tbilisi);
    const items = schedule(tbilisi, day);
    expect(formatTime(items[0].arrive)).toBe('10:00');
    const gap = items[1].arrive - items[0].leave;
    expect(gap).toBe(items[0].walkNext);
    expect(items[items.length - 1].walkNext).toBeNull();
    const totals = dayTotals(items);
    expect(totals.count).toBe(items.length);
    expect(totals.km).toBeCloseTo(
      items.slice(0, -1).reduce((s, x, i) => s + distanceKm(x.place, items[i + 1].place), 0),
    );
  });

  it('moves items and ignores out-of-range moves', () => {
    expect(move(['a', 'b', 'c'], 0, 2)).toEqual(['b', 'c', 'a']);
    expect(move(['a', 'b'], 0, -1)).toEqual(['a', 'b']);
  });

  it('optimizes order without losing stops and never makes it longer', () => {
    const stops = tbilisi.places.slice(0, 5).map((p) => ({ placeId: p.id, minutes: 60 }));
    const shuffled = [stops[0], stops[4], stops[1], stops[3], stops[2]];
    const best = optimize(tbilisi, shuffled);
    expect(best.map((s) => s.placeId).sort()).toEqual(shuffled.map((s) => s.placeId).sort());
    const len = (list: typeof stops) => dayTotals(schedule(tbilisi, { stops: list })).km;
    expect(len(best)).toBeLessThanOrEqual(len(shuffled) + 1e-9);
  });
});
