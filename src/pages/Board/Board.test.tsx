import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Board from './Board';
import { useUserStore } from '@/store/user';

const renderBoard = () =>
  render(
    <MemoryRouter>
      <Board />
    </MemoryRouter>,
  );

const statuses = () =>
  within(screen.getByRole('table'))
    .getAllByRole('row')
    .slice(1)
    .map((r) => r.lastElementChild?.textContent);

beforeEach(() => {
  localStorage.clear();
  useUserStore.getState().reset();
});
afterEach(() => vi.useRealTimers());

describe('Board', () => {
  it('lists demo flights and keeps the sound off by default', () => {
    renderBoard();
    expect(screen.getByText('Табло · Москва · демо-табло')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(12);
    const sound = screen.getByRole('button', { name: 'Звук табло' });
    expect(sound).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(sound);
    expect(sound).toHaveAttribute('aria-pressed', 'true');
    expect(useUserStore.getState().ui.boardSound).toBe(true);
  });

  it('changes one status every ~4 seconds', () => {
    vi.useFakeTimers();
    renderBoard();
    const before = statuses();
    act(() => vi.advanceTimersByTime(4000));
    const after = statuses();
    expect(after.filter((s, i) => s !== before[i])).toHaveLength(1);
  });

  it('filters by city or flight number', () => {
    renderBoard();
    fireEvent.change(screen.getByLabelText('Найти рейс или город'), {
      target: { value: 'тбил' },
    });
    const rows = within(screen.getByRole('table')).getAllByRole('row');
    expect(rows).toHaveLength(2);
    expect(rows[1]).toHaveTextContent('ТБИЛИСИ');
  });

  it('switches to arrivals with the keyboard', () => {
    renderBoard();
    const dep = screen.getByRole('tab', { name: 'Вылет' });
    fireEvent.keyDown(dep, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'Прилёт' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Прилёты');
    expect(screen.getByRole('columnheader', { name: 'Откуда' })).toBeInTheDocument();
  });

  it('tracks the quiz city flight', () => {
    useUserStore
      .getState()
      .setQuiz({ moods: [], month: 4, days: 7, budget: 120, company: 'pair' }, 'hanoi');
    renderBoard();
    expect(screen.getByRole('img', { name: /Схема полёта Москва — Ханой/ })).toBeInTheDocument();
  });
});
