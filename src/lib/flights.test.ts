import { getCities } from './cities';
import {
  flightProgress,
  formatClock,
  makeFlights,
  moscowMinutes,
  nextStatus,
  statusAt,
} from './flights';

const cities = getCities();

describe('flights', () => {
  it('makes one stable flight per city with OB numbers and gates', () => {
    const a = makeFlights(cities, 'dep', 600);
    const b = makeFlights(cities, 'dep', 600);
    expect(a).toHaveLength(cities.length);
    expect(a).toEqual(b);
    a.forEach((f) => {
      expect(f.no).toMatch(/^OB \d{3}$/);
      expect(f.gate).toMatch(/^[A-E]\d{2}$/);
    });
    expect(a.map((f) => f.time)).toEqual([...a.map((f) => f.time)].sort((x, y) => x - y));
  });

  it('derives the status from the time left', () => {
    expect(statusAt(590, 600)).toBe('departed');
    expect(statusAt(615, 600)).toBe('boarding');
    expect(statusAt(660, 600)).toBe('checkin');
    expect(statusAt(800, 600)).toBe('scheduled');
  });

  it('cycles statuses', () => {
    expect(nextStatus('scheduled')).toBe('checkin');
    expect(nextStatus('delayed')).toBe('scheduled');
  });

  it('uses Moscow time (UTC+3)', () => {
    const t = Date.UTC(2026, 10, 14, 21, 5, 9);
    expect(formatClock(t)).toBe('00:05:09');
    expect(moscowMinutes(t)).toBe(5);
  });

  it('computes flight progress within 0–1, across midnight', () => {
    const f = { ...makeFlights(cities, 'dep', 600)[0], time: 1430, minutes: 120 };
    expect(flightProgress(f, 1400)).toBe(0);
    expect(flightProgress(f, 50)).toBe(0.5);
    expect(flightProgress(f, 300)).toBe(1);
  });
});
