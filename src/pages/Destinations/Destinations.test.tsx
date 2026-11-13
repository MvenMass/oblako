import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import Destinations from './Destinations';
import { applyFilter } from '@/components/destinations/filters';
import { getCities } from '@/lib/cities';

function Search() {
  return <p data-testid="search">{useLocation().search}</p>;
}

function renderAt(url = '/destinations') {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route
          path="/destinations"
          element={
            <>
              <Destinations />
              <Search />
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

const activeFolder = () => screen.getByRole('button', { name: /Открыть досье|Закрыть досье/ });

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
});
afterEach(() => vi.unstubAllGlobals());

describe('filters', () => {
  it('keeps sea cities and weekend trips', () => {
    expect(
      applyFilter(getCities(), 'sea')
        .map((c) => c.id)
        .sort(),
    ).toEqual(['istanbul', 'kaliningrad', 'sochi', 'zanzibar']);
    expect(applyFilter(getCities(), 'weekend').every((c) => c.facts.flightMinutes <= 180)).toBe(
      true,
    );
  });
});

describe('Destinations', () => {
  it('renders the first folder as active and arrows switch it', () => {
    renderAt();
    expect(screen.getByRole('heading', { level: 1, name: /Куда/ })).toBeInTheDocument();
    expect(screen.getByText(/— 1 из 11/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Следующее направление' }));
    expect(screen.getByText(/— 2 из 11/)).toBeInTheDocument();
    expect(screen.getByTestId('search')).toHaveTextContent('?city=sochi');
  });

  it('keyboard arrows work on the focused carousel', () => {
    renderAt();
    const region = screen.getByRole('region', { name: /Папки направлений/ });
    fireEvent.keyDown(region, { key: 'ArrowLeft' });
    expect(screen.getByText(/— 11 из 11/)).toBeInTheDocument();
  });

  it('filters folders', () => {
    renderAt();
    fireEvent.click(screen.getByRole('button', { name: 'Море' }));
    expect(screen.getByRole('button', { name: 'Море' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(/— 1 из 4/)).toBeInTheDocument();
  });

  it('opens the dossier with a link to the city', () => {
    renderAt('/destinations?city=tbilisi');
    expect(screen.getByText(/Тбилиси, Грузия/)).toBeInTheDocument();
    const folder = activeFolder();
    expect(folder).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(folder);
    expect(activeFolder()).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: /Открыть направление/ })).toHaveAttribute(
      'href',
      '/city/tbilisi',
    );
  });
});
