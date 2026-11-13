import { getRate, rateCaption, resetRatesForTests } from './rates';

const gel = { code: 'GEL', name: 'Лари', demoRateRub: 30, rateCode: 'GEL' };
const cbr = {
  Date: '2026-11-13T11:30:00+03:00',
  Valute: {
    GEL: { Nominal: 1, Value: 33.5 },
    CNY: { Nominal: 10, Value: 112 },
  },
};

function mockFetch(body: unknown) {
  return vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => body });
}
const offline = () => vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));

beforeEach(() => {
  localStorage.clear();
  resetRatesForTests();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('getRate', () => {
  it('returns the live CBR rate divided by nominal', async () => {
    vi.stubGlobal('fetch', mockFetch(cbr));
    expect(await getRate(gel)).toMatchObject({ rub: 33.5, source: 'cbr' });
    expect(await getRate({ ...gel, rateCode: 'CNY' })).toMatchObject({ rub: 11.2 });
  });

  it('skips rubles', async () => {
    const fetch = mockFetch(cbr);
    vi.stubGlobal('fetch', fetch);
    expect(await getRate({ ...gel, code: 'RUB', rateCode: 'RUB' })).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('falls back to the demo rate when offline and nothing is saved', async () => {
    vi.stubGlobal('fetch', offline());
    expect(await getRate(gel)).toEqual({ code: 'GEL', rub: 30, date: null, source: 'demo' });
  });

  it('falls back to the last saved rate when the cache is stale and the network fails', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-01T10:00:00Z'));
    vi.stubGlobal('fetch', mockFetch(cbr));
    await getRate(gel);

    vi.setSystemTime(new Date('2026-11-03T10:00:00Z'));
    resetRatesForTests();
    vi.stubGlobal('fetch', offline());
    expect(await getRate(gel)).toMatchObject({ rub: 33.5, source: 'cache' });
  });

  it('uses the fresh cache without hitting the network', async () => {
    vi.stubGlobal('fetch', mockFetch(cbr));
    await getRate(gel);
    const fetch = offline();
    vi.stubGlobal('fetch', fetch);
    expect(await getRate(gel)).toMatchObject({ source: 'cbr' });
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe('rateCaption', () => {
  it('labels demo and CBR rates', () => {
    expect(rateCaption({ code: 'GEL', rub: 30, date: null, source: 'demo' })).toBe('демо-курс');
    const nb = String.fromCharCode(160);
    expect(rateCaption({ code: 'GEL', rub: 33, date: cbr.Date, source: 'cbr' })).toBe(
      `ЦБ РФ на${nb}13 ноября`,
    );
  });
});
