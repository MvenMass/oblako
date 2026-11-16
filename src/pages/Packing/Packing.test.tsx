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

const item = (name: RegExp) => screen.getByRole('button', { name });
const packed = () => useUserStore.getState().packing?.packed ?? {};

beforeEach(() => {
  localStorage.clear();
  useUserStore.getState().reset();
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
});
afterEach(() => vi.unstubAllGlobals());

describe('Packing', () => {
  it('packs an item and takes it back out', () => {
    renderPacking();
    const passport = item(/^Паспорт: на полу/);
    expect(passport).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(passport);
    expect(item(/^Паспорт: в чемодане/)).toHaveAttribute('aria-pressed', 'true');
    expect(packed()).toEqual({ passport: true });
    expect(screen.getByText(/Уложено 1 из/)).toBeInTheDocument();
    fireEvent.click(item(/^Паспорт: в чемодане/));
    expect(packed()).toEqual({ passport: false });
  });

  it('shows culture tips for Istanbul', () => {
    renderPacking();
    expect(item(/^Платок для храмов — совет:/)).toBeInTheDocument();
    expect(item(/^Одежда, закрывающая колени — совет:/)).toBeInTheDocument();
    expect(screen.getByText('нет прогноза — по климату месяца')).toBeInTheDocument();
  });

  it('syncs the accessible checklist', () => {
    renderPacking();
    fireEvent.click(screen.getByText('Списком'));
    const check = screen.getByRole('checkbox', { name: 'Зарядка' });
    fireEvent.click(check);
    expect(check).toHaveAttribute('aria-checked', 'true');
    expect(item(/^Зарядка: в чемодане/)).toBeInTheDocument();
  });

  it('packs everything, updates the luggage tag and celebrates; then unpacks', () => {
    renderPacking();
    fireEvent.click(screen.getByRole('button', { name: 'Собрать всё' }));
    expect(screen.getByText(/Уложено 15 из/)).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Чемодан собран');
    // 3,2 кг база + 5,15 кг вещей
    expect(screen.getByText(/^8,\d\s*кг$/)).toBeInTheDocument();
    expect(screen.getByText(/запас 14,\d/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Вытряхнуть' }));
    expect(packed()).toEqual({});
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('keeps packing per city', () => {
    useUserStore.getState().setPacked('tbilisi', 'passport', true);
    renderPacking();
    const list = screen.getByText('Списком').closest('details')!;
    expect(within(list).getByText('0/15')).toBeInTheDocument();
  });
});

describe('Packing without a trip', () => {
  it('asks to choose a destination first', () => {
    renderPacking('/packing');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Сначала выберите направление',
    );
    expect(screen.getByRole('link', { name: 'Выбрать направление' })).toHaveAttribute(
      'href',
      '/destinations',
    );
  });
});
