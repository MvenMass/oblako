import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Trip from './Trip';
import { getCity } from '@/lib/cities';
import { tripCost } from '@/lib/trip';
import { useUserStore } from '@/store/user';

const renderTrip = (url = '/trip?city=tbilisi') =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/trip" element={<Trip />} />
      </Routes>
    </MemoryRouter>,
  );

const next = () => fireEvent.click(screen.getByRole('button', { name: /^(Дальше|Пропустить)$/ }));
const radio = (name: RegExp, n = 0) => screen.getAllByRole('radio', { name })[n];

beforeEach(() => {
  localStorage.clear();
  useUserStore.getState().reset();
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
});
afterEach(() => vi.unstubAllGlobals());

describe('Trip wizard', () => {
  it('walks from dates to summary and saves the trip into budget and route', () => {
    renderTrip();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Поездка в Тбилиси');
    // Даты: 4 ночи, бюджет по расчёту
    fireEvent.click(screen.getByRole('button', { name: 'Ночей: меньше' }));
    fireEvent.click(screen.getByRole('button', { name: /По расчёту/ }));
    next();
    fireEvent.click(radio(/Утренний, прямой/, 0));
    fireEvent.click(radio(/Вечерний, прямой/, 1));
    next();
    fireEvent.click(radio(/Бутик-отель/));
    next();
    fireEvent.click(radio(/Такси/));
    next();

    const plan = useUserStore.getState().plans.list[0];
    expect(plan).toMatchObject({
      cityId: 'tbilisi',
      nights: 4,
      outId: 'out-am',
      backId: 'back-pm',
      hotelId: 'boutique',
      transferId: 'taxi',
      saved: false,
    });

    fireEvent.click(screen.getByRole('button', { name: 'Сохранить поездку' }));
    const s = useUserStore.getState();
    expect(s.plans.list[0].saved).toBe(true);
    expect(s.plans.activeId).toBe(plan.id);
    // Маршрут — на 5 дней, бюджет — с бронями
    expect(s.route?.cityId).toBe('tbilisi');
    expect(s.route?.days.length).toBe(5);
    const cost = tripCost(s.plans.list[0], getCity('tbilisi')!);
    expect(s.budget?.expenses.map((e) => e.id)).toEqual([
      'plan-flight',
      'plan-stay',
      'plan-transfer',
    ]);
    expect(s.budget?.expenses[0].rub).toBe(cost.flights);
    expect(screen.getByRole('link', { name: /Маршрут по\sдням/ })).toHaveAttribute(
      'href',
      '/route?city=tbilisi',
    );
  });

  it('marks missing choices in the summary and jumps back to them', () => {
    renderTrip();
    for (let i = 0; i < 4; i += 1) next();
    expect(screen.getAllByRole('button', { name: /не выбрано — выбрать/ }).length).toBe(4);
    fireEvent.click(screen.getAllByRole('button', { name: /не выбрано — выбрать/ })[2]);
    expect(screen.getByRole('radiogroup', { name: 'Отель' })).toBeInTheDocument();
  });

  it('keeps the pre-departure checklist', () => {
    renderTrip();
    for (let i = 0; i < 4; i += 1) next();
    const item = screen.getByRole('checkbox', { name: /Оформить страховку/ });
    fireEvent.click(item);
    expect(item).toHaveAttribute('aria-checked', 'true');
    expect(useUserStore.getState().plans.list[0].checklist.insurance).toBe(true);
  });

  it('moves between options with arrow keys', () => {
    renderTrip();
    next();
    next();
    const first = radio(/Эконом/);
    first.focus();
    fireEvent.keyDown(first, { key: 'ArrowRight' });
    expect(radio(/Средний/)).toHaveAttribute('aria-checked', 'true');
    expect(radio(/Средний/)).toHaveFocus();
  });
});
