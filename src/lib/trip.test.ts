import { getCity } from './cities';
import {
  addDays,
  daysUntil,
  flightOptions,
  hotelOptions,
  transferOptions,
  tripCost,
  tripIcs,
} from './trip';
import type { TripPlan } from '@/types/user';

const city = getCity('istanbul')!;
const plan = (over: Partial<TripPlan> = {}): TripPlan => ({
  id: 'p1',
  cityId: 'istanbul',
  dateFrom: '2026-12-10',
  nights: 5,
  people: 2,
  budget: 200000,
  outId: 'out-am',
  backId: 'back-pm',
  hotelId: 'mid',
  transferId: 'taxi',
  checklist: {},
  saved: true,
  createdAt: '2026-11-16',
  ...over,
});

describe('trip options', () => {
  it('offers three flights, hotels and transfers with prices', () => {
    expect(flightOptions(city, 'out')).toHaveLength(3);
    expect(hotelOptions(city).map((h) => h.id)).toEqual(['eco', 'mid', 'boutique']);
    expect(transferOptions(city)).toHaveLength(3);
    const [am, pm, hop] = flightOptions(city, 'out');
    expect(hop.price).toBeLessThan(pm.price);
    expect(am.price).toBeGreaterThan(pm.price);
    expect(hop.stops).toBe(1);
  });

  it('sums the cost for the whole party', () => {
    const p = plan();
    const c = tripCost(p, city);
    const out = flightOptions(city, 'out')[0].price;
    const back = flightOptions(city, 'back')[1].price;
    expect(c.flights).toBe((out + back) * 2);
    expect(c.stay).toBe(hotelOptions(city)[1].night * 5);
    expect(c.transfer).toBe(transferOptions(city)[1].price * 2);
    expect(c.total).toBe(c.flights + c.stay + c.transfer + c.daily);
    // Три человека — два номера
    expect(tripCost(plan({ people: 3 }), city).stay).toBe(hotelOptions(city)[1].night * 5 * 2);
  });

  it('counts days until departure and adds days', () => {
    const now = Date.UTC(2026, 10, 16, 9);
    expect(daysUntil('2026-11-28', now)).toBe(12);
    expect(daysUntil('2026-11-10', now)).toBe(-6);
    expect(addDays('2026-12-30', 3)).toBe('2027-01-02');
  });

  it('exports a calendar with flights and the stay', () => {
    const ics = tripIcs(plan());
    expect(ics.startsWith('BEGIN:VCALENDAR')).toBe(true);
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(3);
    // Утренний вылет 07:40 мск = 04:40 UTC
    expect(ics).toContain('DTSTART:20261210T044000Z');
    expect(ics).toContain('DTSTART;VALUE=DATE:20261210');
    expect(ics).toContain('DTEND;VALUE=DATE:20261215');
  });
});
