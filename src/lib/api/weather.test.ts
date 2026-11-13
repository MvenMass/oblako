import { getCurrentWeather, getForecast, weatherKind } from './weather';

const coords = { lat: 41.72, lon: 44.79 };

function mockFetch(body: unknown, ok = true) {
  return vi.fn().mockResolvedValue({ ok, status: ok ? 200 : 500, json: async () => body });
}

beforeEach(() => {
  sessionStorage.clear();
  vi.unstubAllGlobals();
});

describe('weatherKind', () => {
  it.each([
    [0, 'sun'],
    [1, 'sun'],
    [3, 'cloud'],
    [45, 'cloud'],
    [61, 'rain'],
    [81, 'rain'],
    [73, 'snow'],
    [86, 'snow'],
    [95, 'storm'],
  ])('code %i → %s', (code, kind) => {
    expect(weatherKind(code)).toBe(kind);
  });
});

describe('getCurrentWeather', () => {
  it('fetches, rounds and caches the result', async () => {
    const fetch = mockFetch({ current: { temperature_2m: 17.6, weather_code: 2 } });
    vi.stubGlobal('fetch', fetch);

    expect(await getCurrentWeather(coords)).toEqual({ tempC: 18, kind: 'cloud' });
    expect(await getCurrentWeather(coords)).toEqual({ tempC: 18, kind: 'cloud' });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('returns null without throwing when offline', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    await expect(getCurrentWeather(coords)).resolves.toBeNull();
  });

  it('returns null on HTTP errors', async () => {
    vi.stubGlobal('fetch', mockFetch({}, false));
    await expect(getCurrentWeather(coords)).resolves.toBeNull();
  });
});

describe('getForecast', () => {
  it('maps the daily arrays', async () => {
    vi.stubGlobal(
      'fetch',
      mockFetch({
        daily: {
          time: ['2026-05-01'],
          temperature_2m_max: [22.4],
          temperature_2m_min: [11.5],
          precipitation_probability_max: [null],
          weather_code: [61],
        },
      }),
    );
    expect(await getForecast(coords)).toEqual([
      { date: '2026-05-01', maxC: 22, minC: 12, precipitation: 0, kind: 'rain' },
    ]);
  });
});
