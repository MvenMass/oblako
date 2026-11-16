import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Packing from './Packing';
import { useUserStore } from '@/store/user';

const renderPacking = (url = '/packing?city=istanbul') =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/packing" element={<Packing />} />
      </Routes>
    </MemoryRouter>,
  );

const check = (name: RegExp) => screen.getByRole('checkbox', { name });
const packed = () => useUserStore.getState().packing?.packed ?? {};

beforeEach(() => {
  localStorage.clear();
  useUserStore.getState().reset();
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
});
afterEach(() => vi.unstubAllGlobals());

describe('Packing', () => {
  it('ticks an item in the list and it lands in the suitcase', () => {
    renderPacking();
    fireEvent.click(check(/^Паспорт/));
    expect(check(/^Паспорт/)).toHaveAttribute('aria-checked', 'true');
    expect(packed()).toEqual({ passport: true });
    // Вещь на сцене тоже «в чемодане»
    expect(screen.getByRole('button', { name: /^Паспорт: в чемодане/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByText(/Уложено 1 из/)).toBeInTheDocument();
  });

  it('groups weather and culture tips separately', () => {
    renderPacking();
    const tips = screen.getByRole('region', { name: /По погоде и\sобычаям/ });
    expect(within(tips).getByRole('checkbox', { name: /^Платок для храмов/ })).toBeInTheDocument();
    expect(screen.getByText(/по климату месяца/)).toBeInTheDocument();
  });

  it('adds own items with weight and removes them', () => {
    renderPacking();
    fireEvent.change(screen.getByLabelText('Название вещи'), { target: { value: 'Фотоаппарат' } });
    fireEvent.change(screen.getByLabelText('Вес, кг'), { target: { value: '1,2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Добавить' }));
    const own = useUserStore.getState().packing!.custom!;
    expect(own).toMatchObject([{ name: 'Фотоаппарат', kg: 1.2 }]);
    expect(packed()[own[0].id]).toBe(true);
    expect(screen.getByText(/^4,4\s*кг$/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Удалить: Фотоаппарат' }));
    expect(useUserStore.getState().packing!.custom).toEqual([]);
  });

  it('switches the luggage limit and warns about overweight', () => {
    renderPacking();
    fireEvent.click(screen.getByRole('button', { name: /Ручная кладь/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Собрать всё' }));
    expect(useUserStore.getState().packing?.limit).toBe(10);
    expect(screen.getByText(/Багаж · лимит 10/)).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Чемодан собран');
    fireEvent.click(screen.getByRole('button', { name: 'Вытряхнуть' }));
    expect(packed()).toEqual({});
  });

  it('counts T-shirts by trip days', () => {
    const d = new Date(Date.now() + 20 * 86400000).toISOString().slice(0, 10);
    useUserStore.getState().upsertPlan({
      id: 'p1',
      cityId: 'istanbul',
      dateFrom: d,
      nights: 3,
      people: 1,
      budget: 0,
      outId: null,
      backId: null,
      hotelId: null,
      transferId: null,
      checklist: {},
      saved: true,
      createdAt: d,
    });
    renderPacking('/packing');
    expect(check(/^Футболки ×4/)).toBeInTheDocument();
    expect(screen.getByText(/по вашей поездке/)).toBeInTheDocument();
  });

  it('keeps packing per city', () => {
    useUserStore.getState().setPacked('tbilisi', 'passport', true);
    renderPacking();
    expect(screen.getByText(/Уложено 0 из/)).toBeInTheDocument();
  });
});

describe('Packing without a trip', () => {
  it('asks to choose a destination first', () => {
    renderPacking('/packing');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Сначала выберите направление',
    );
    expect(screen.getByRole('link', { name: 'Спланировать поездку' })).toHaveAttribute(
      'href',
      '/trip',
    );
  });
});
