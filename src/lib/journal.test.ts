import { getCity } from './cities';
import { demoTrip, journalTrips, memoryOf, photoPath, tripPhotos } from './journal';
import type { Trip } from '@/types/user';

const NOW = Date.UTC(2026, 10, 14);
const trip = (id: string, date: string, photoIds = ['p1', 'p2']): Trip => ({
  id,
  cityId: 'istanbul',
  title: id,
  date,
  photoIds,
});

describe('journal', () => {
  it('adds a Tbilisi demo trip a year ago', () => {
    const demo = demoTrip(NOW);
    expect(demo.cityId).toBe('tbilisi');
    expect(demo.date.startsWith('2025-11')).toBe(true);
    expect(journalTrips([], NOW)).toEqual([demo]);
  });

  it('sorts user trips by date, demo goes last', () => {
    const list = journalTrips([trip('a', '2026-01-01'), trip('b', '2026-06-01')], NOW);
    expect(list.map((t) => t.id)).toEqual(['b', 'a', 'demo-tbilisi']);
  });

  it('finds the memory closest to one year ago', () => {
    const m = memoryOf([trip('far', '2025-03-01'), trip('near', '2025-11-20')], NOW);
    expect(m?.trip.id).toBe('near');
    expect(memoryOf([trip('far', '2025-03-01')], NOW)).toBeNull();
  });

  it('maps demo photos to places and own photos by order', () => {
    const demo = tripPhotos(demoTrip(NOW));
    expect(demo[0].demoSrc).toBe(getCity('tbilisi')!.places[0].photo);
    const own = tripPhotos(trip('x', '2026-01-01', ['a', 'b', 'c']));
    expect(own.map((p) => p.place.id)).toEqual(
      getCity('istanbul')!
        .places.slice(0, 3)
        .map((p) => p.id),
    );
    expect(own[0].demoSrc).toBeNull();
  });

  it('draws the photo route in shooting order', () => {
    const photos = tripPhotos(demoTrip(NOW));
    const { d, pts } = photoPath(getCity('tbilisi')!, photos);
    expect(pts).toHaveLength(photos.length);
    expect(d.startsWith('M')).toBe(true);
    expect(d.match(/Q/g)).toHaveLength(photos.length - 1);
  });
});
