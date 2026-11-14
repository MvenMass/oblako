import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import City from './City';
import { generatePalettes } from '@/components/scene/palettes';
import { getCities, getCity } from '@/lib/cities';
import { contrast, readable } from '@/lib/color';
import { todByHour } from '@/lib/cityTime';
import { monthRanges } from '@/lib/months';
import { useUserStore } from '@/store/user';

function renderCity(id: string) {
  return render(
    <MemoryRouter initialEntries={[`/city/${id}`]}>
      <Routes>
        <Route path="/city/:id" element={<City />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  useUserStore.getState().reset();
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
});
afterEach(() => vi.unstubAllGlobals());

describe('City page', () => {
  it('renders Tbilisi with title, greeting and all sections', () => {
    renderCity('tbilisi');
    expect(screen.getByRole('heading', { level: 1, name: 'Тбилиси' })).toBeInTheDocument();
    expect(screen.getAllByText('გამარჯობა')[0]).toHaveAttribute('lang', 'ka');
    for (const name of [
      /Коротко о/,
      /Куда/,
      /Вино в/,
      /Что нужно/,
      'Советуем',
      'Попробовать',
      'Разговорник',
      /Цены против/,
      'Когда ехать',
      /за.3.дня/,
    ]) {
      expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument();
    }
  });

  it('shows 404 for an unknown city', () => {
    renderCity('atlantis');
    expect(screen.getByRole('heading', { name: /Такого облака нет/ })).toBeInTheDocument();
  });

  it('switches time of day with the radiogroup', () => {
    renderCity('istanbul');
    const group = screen.getByRole('radiogroup', { name: 'Время суток' });
    fireEvent.click(within(group).getByRole('radio', { name: 'Ночь' }));
    expect(within(group).getByRole('radio', { name: 'Ночь' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('toggles favourites and «В маршрут» in the store', () => {
    renderCity('tbilisi');
    fireEvent.click(screen.getByRole('button', { name: /В избранное/ }));
    expect(useUserStore.getState().favorites).toEqual(['tbilisi']);
    fireEvent.click(screen.getByRole('button', { name: /^В.маршрут$/ }));
    expect(useUserStore.getState().routeAdded.tbilisi).toHaveLength(1);
  });

  it('gallery steps with buttons and arrow keys', () => {
    renderCity('tbilisi');
    expect(screen.getByText('01 / 08')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Следующее место' }));
    expect(screen.getByText('02 / 08')).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole('region', { name: /Фотографии мест/ }), {
      key: 'ArrowLeft',
    });
    expect(screen.getByText('01 / 08')).toBeInTheDocument();
  });

  it('hides the phrasebook when there are no phrases', () => {
    renderCity('sochi');
    expect(screen.queryByRole('heading', { name: 'Разговорник' })).not.toBeInTheDocument();
    expect(screen.queryByText('Курс')).not.toBeInTheDocument();
  });
});

describe('city helpers', () => {
  it('maps local hours to day, sunset and night', () => {
    expect(todByHour(12)).toBe(0);
    expect(todByHour(18)).toBe(1);
    expect(todByHour(23)).toBe(2);
    expect(todByHour(5)).toBe(2);
  });

  it('formats month ranges', () => {
    expect(monthRanges([4, 5, 6, 9, 10])).toBe('апрель–июнь, сентябрь–октябрь');
    expect(monthRanges([1])).toBe('январь');
  });

  it('generates three palettes for cities without drawn ones', () => {
    const p = generatePalettes(getCity('kazan')!);
    expect(p).toHaveLength(3);
    expect(p[2].stars).toBe(1);
    expect(p[0].win).toBe(0);
  });

  it.each(getCities().map((c) => [c.id, c] as const))(
    '%s readable accent passes AA with white and the page background',
    (_, city) => {
      const accent = readable(city.theme.accent, city.theme.bg);
      expect(contrast(accent, '#ffffff')).toBeGreaterThanOrEqual(4.5);
      expect(contrast(accent, city.theme.bg)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(city.theme.muted, city.theme.bg)).toBeGreaterThanOrEqual(4.5);
    },
  );
});

describe('currency display', () => {
  it('labels the rate with the rate currency (Zanzibar: USD, not TZS)', () => {
    render(
      <MemoryRouter initialEntries={['/city/zanzibar']}>
        <Routes>
          <Route path="/city/:id" element={<City />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getAllByText(/1\sUSD = /).length).toBeGreaterThan(0);
    expect(screen.queryByText(/1\sTZS = /)).not.toBeInTheDocument();
  });
});

describe('all cities', () => {
  it.each(getCities().map((c) => [c.id, c.name] as const))('%s renders its page', (id, name) => {
    renderCity(id);
    expect(screen.getByRole('heading', { level: 1, name })).toBeInTheDocument();
  });
});
