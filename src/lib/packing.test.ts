import { getCity } from './cities';
import { BASE_KG, climateWeek, ITEMS, tipsFor, weight } from './packing';
import type { DayForecast } from './api/weather';

const day = (maxC: number, minC: number, precipitation = 0): DayForecast => ({
  date: '2026-05-01',
  maxC,
  minC,
  precipitation,
  kind: precipitation > 50 ? 'rain' : 'sun',
});

describe('packing', () => {
  it('has 15 items split between the lid and the body', () => {
    expect(ITEMS).toHaveLength(15);
    expect(ITEMS.filter((i) => i.zone === 'lid')).toHaveLength(7);
  });

  it('weighs the base plus packed items', () => {
    expect(weight({})).toBe(BASE_KG);
    expect(weight({ tees: true, shoes: true })).toBeCloseTo(BASE_KG + 2.1);
  });

  it('gives weather and culture tips', () => {
    const ist = getCity('istanbul')!;
    const tips = tipsFor(ist, [day(24, 16), day(18, 11, 80)]);
    expect(Object.keys(tips).sort()).toEqual(['cream', 'jacket', 'scarf', 'trousers', 'umbrella']);
    const sochi = getCity('sochi')!;
    expect(tipsFor(sochi, [day(17, 15)])).toEqual({});
  });

  it('builds a dry climate week offline', () => {
    const week = climateWeek(getCity('tbilisi')!, 6);
    expect(week).toHaveLength(7);
    expect(week[0].maxC).toBe(getCity('tbilisi')!.climate.avgHighC[6]);
  });
});
