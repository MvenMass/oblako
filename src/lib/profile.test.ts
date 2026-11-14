import { achievementsOf, countriesOf, dishesTried, initials, kmInSky, levelOf } from './profile';
import type { Pass, Trip } from '@/types/user';

const pass = (cityId: string): Pass => ({ id: cityId, cityId, seat: '7A', issuedAt: '2026-11-14' });
const trip = (cityId: string, dishes: string[]): Trip => ({
  id: cityId,
  cityId,
  title: cityId,
  date: '2026-01-01',
  photoIds: [],
  dishes,
});

describe('profile', () => {
  it('makes initials from the name', () => {
    expect(initials('[Имя Фамилия]')).toBe('ИФ');
    expect(initials('Анна')).toBe('А');
    expect(initials('  ')).toBe('?');
  });

  it('counts unique countries and km in the sky', () => {
    expect(countriesOf(['kazan', 'sochi', 'tbilisi'])).toEqual(['Россия', 'Грузия']);
    // Тбилиси 165 мин + Казань 90 мин
    expect(kmInSky([pass('tbilisi'), pass('kazan')])).toBe((165 + 90) * 13);
  });

  it('counts tried dishes without duplicates within a city', () => {
    expect(
      dishesTried([trip('kazan', ['a', 'b']), trip('kazan', ['a']), trip('sochi', ['a'])]),
    ).toBe(3);
  });

  it('unlocks achievements by their rules', () => {
    const none = achievementsOf({ stamps: [], passes: [], trips: [] });
    expect(none.every((a) => !a.got)).toBe(true);
    const some = achievementsOf({
      stamps: ['altai', 'istanbul', 'tbilisi', 'yerevan', 'beijing', 'hanoi'],
      passes: [pass('altai')],
      trips: [trip('kazan', ['1', '2', '3', '4'])],
    });
    const got = Object.fromEntries(some.map((a) => [a.id, a.got]));
    expect(got).toEqual({
      'first-flight': true,
      'five-countries': true,
      mountains: true,
      gourmet: false,
    });
    expect(some.find((a) => a.id === 'gourmet')?.progress).toBeCloseTo(0.2);
  });

  it('computes level and progress', () => {
    expect(levelOf({ stamps: [], passes: [], trips: [] })).toMatchObject({ level: 1, toNext: 300 });
    const l = levelOf({ stamps: ['a', 'b'], passes: [pass('a')], trips: [trip('a', [])] });
    expect(l.xp).toBe(360);
    expect(l.level).toBe(2);
  });
});
