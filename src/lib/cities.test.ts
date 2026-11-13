import { citiesIndex, formatRub, getCities, getCity, getPhotoCredit, isHit, nbsp } from './cities';

const photoFiles = new Set(
  Object.keys(import.meta.glob('/public/photos/**/*.jpg')).map((p) => p.replace('/public', '')),
);

describe('cities', () => {
  it('loads all 11 cities in index order', () => {
    const cities = getCities();
    expect(cities).toHaveLength(11);
    expect(cities.map((c) => c.id)).toEqual(citiesIndex.order);
  });

  it('finds a city by id and returns undefined for unknown ids', () => {
    expect(getCity('tbilisi')?.name).toBe('Тбилиси');
    expect(getCity('atlantis')).toBeUndefined();
    expect(getCity(undefined)).toBeUndefined();
  });

  it('marks hits from the index', () => {
    expect(isHit('istanbul')).toBe(true);
    expect(isHit('kazan')).toBe(false);
  });

  it.each(getCities().map((c) => [c.id, c] as const))('%s matches the data contract', (_, city) => {
    expect(city.coords.lat).toEqual(expect.any(Number));
    expect(city.theme.folder).toHaveLength(2);
    expect(city.climate.avgHighC).toHaveLength(12);
    expect(city.quiz.moods.length).toBeGreaterThan(0);
    expect(city.itinerary).toHaveLength(3);
    expect(city.facts.currency.demoRateRub).toBeGreaterThan(0);
    for (const place of city.places) {
      expect(photoFiles.has(place.photo), place.photo).toBe(true);
    }
  });

  it('has photo credits for places', () => {
    const city = getCity('tbilisi')!;
    const key = city.places[0].photo.split('/').pop()!.replace('.jpg', '');
    expect(getPhotoCredit('tbilisi', key)?.license).toBe('Pexels License');
  });
});

describe('number formatting', () => {
  it('binds numbers to units', () => {
    expect(nbsp('2 ч 45 мин')).toBe('2 ч 45 мин');
    expect(nbsp('23 кг')).toBe('23 кг');
  });

  it('formats rubles with thin groups', () => {
    expect(formatRub(35000)).toBe('35 000 ₽');
    expect(formatRub(999)).toBe('999 ₽');
  });
});
