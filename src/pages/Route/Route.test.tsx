import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route as RouterRoute, Routes } from 'react-router-dom';
import Route from './Route';
import { getCity } from '@/lib/cities';
import { useUserStore } from '@/store/user';

function renderRoute(url = '/route') {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <RouterRoute path="/route" element={<Route />} />
      </Routes>
    </MemoryRouter>,
  );
}

const stopNames = () =>
  within(screen.getByRole('list', { name: 'Точки дня' }))
    .getAllByRole('listitem')
    .map((li) => li.querySelector('[class*="name"]')?.firstChild?.textContent);

const savedStops = () => useUserStore.getState().route?.days[0].stops.map((s) => s.placeId);

beforeEach(() => {
  localStorage.clear();
  useUserStore.getState().reset();
});

describe('Route', () => {
  it('shows the empty state without a route', () => {
    renderRoute();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Маршрут пока пуст');
    expect(screen.getByRole('link', { name: 'Подобрать поездку' })).toHaveAttribute(
      'href',
      '/quiz',
    );
  });

  it('builds a default route from ?city= and saves it', () => {
    renderRoute('/route?city=tbilisi');
    const city = getCity('tbilisi')!;
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(city.name);
    expect(useUserStore.getState().route?.cityId).toBe('tbilisi');
    expect(stopNames()[0]).toBe(city.places[0].name);
  });

  it('reorders stops with Alt+arrows and announces it', () => {
    renderRoute('/route?city=tbilisi');
    const before = savedStops()!;
    const handle = screen.getAllByRole('button', { name: /переместить/ })[0];
    fireEvent.keyDown(handle, { key: 'ArrowDown', altKey: true });
    expect(savedStops()).toEqual([before[1], before[0], ...before.slice(2)]);
    expect(screen.getByText(/теперь 2-я/)).toBeInTheDocument();
    // Без Alt стрелки ничего не двигают
    fireEvent.keyDown(screen.getAllByRole('button', { name: /переместить/ })[0], {
      key: 'ArrowDown',
    });
    expect(savedStops()).toEqual([before[1], before[0], ...before.slice(2)]);
  });

  it('removes and adds places', () => {
    renderRoute('/route?city=tbilisi');
    const before = savedStops()!;
    fireEvent.click(screen.getAllByRole('button', { name: /^Убрать/ })[0]);
    expect(savedStops()).toEqual(before.slice(1));
    const city = getCity('tbilisi')!;
    const removed = city.places.find((p) => p.id === before[0])!;
    fireEvent.click(screen.getByRole('button', { name: removed.name }));
    expect(savedStops()).toEqual([...before.slice(1), removed.id]);
  });

  it('switches days by tabs and adds a new day', () => {
    renderRoute('/route?city=tbilisi');
    const tabs = screen.getAllByRole('tab');
    fireEvent.keyDown(tabs[0], { key: 'ArrowRight' });
    expect(screen.getAllByRole('tab')[1]).toHaveAttribute('aria-selected', 'true');
    const count = tabs.length;
    fireEvent.click(screen.getByRole('button', { name: 'Добавить день' }));
    expect(screen.getAllByRole('tab')).toHaveLength(count + 1);
    expect(screen.getAllByRole('tab')[count]).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(/В этом дне пока нет точек/)).toBeInTheDocument();
  });

  it('shows day totals', () => {
    renderRoute('/route?city=tbilisi');
    const stats = screen.getByText('Точек').closest('dl')!;
    expect(within(stats).getByText(String(savedStops()!.length))).toBeInTheDocument();
    expect(within(stats).getByText(/км$/)).toBeInTheDocument();
  });
});

describe('Route place card', () => {
  it('opens a place, moves it to another day and closes with Escape', () => {
    renderRoute('/route?city=tbilisi');
    const first = useUserStore.getState().route!.days[0].stops[0].placeId;
    const name = getCity('tbilisi')!.places.find((p) => p.id === first)!.name;
    fireEvent.click(screen.getByRole('button', { name: `${name}: подробнее о месте` }));
    expect(screen.getByRole('heading', { level: 2, name })).toHaveFocus();
    fireEvent.change(screen.getByLabelText('Перенести в'), { target: { value: '1' } });
    const days = useUserStore.getState().route!.days;
    expect(days[0].stops.map((s) => s.placeId)).not.toContain(first);
    expect(days[1].stops.map((s) => s.placeId)).toContain(first);
    expect(screen.queryByRole('heading', { level: 2, name })).toBeNull();
  });

  it('opens a place from the map pin', () => {
    renderRoute('/route?city=tbilisi');
    fireEvent.click(screen.getAllByRole('button', { name: /^1\. .*: подробнее$/ })[0]);
    expect(screen.getByRole('button', { name: 'Закрыть карточку места' })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('button', { name: 'Закрыть карточку места' })).toBeNull();
  });
});
