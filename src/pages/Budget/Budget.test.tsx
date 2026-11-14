import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Budget from './Budget';
import { resetRatesForTests } from '@/lib/api/rates';
import { useUserStore } from '@/store/user';
import { DEFAULT_ANSWERS } from '@/lib/quiz';

function renderBudget(url = '/budget') {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/budget" element={<Budget />} />
      </Routes>
    </MemoryRouter>,
  );
}

const spent = () => useUserStore.getState().budget?.expenses ?? [];

beforeEach(() => {
  localStorage.clear();
  resetRatesForTests();
  useUserStore.getState().reset();
  // Без сети курс берётся демо: 1 GEL = 30 ₽
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
});
afterEach(() => vi.unstubAllGlobals());

describe('Budget', () => {
  it('shows the empty state without a city', () => {
    renderBudget();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Бюджета пока нет');
  });

  it('creates a budget for ?city= with the plan from the quiz', () => {
    useUserStore.getState().setQuiz({ ...DEFAULT_ANSWERS, budget: 150, days: 5 }, 'tbilisi');
    renderBudget('/budget?city=tbilisi');
    expect(useUserStore.getState().budget).toEqual({
      cityId: 'tbilisi',
      plan: 150000,
      expenses: [],
    });
    expect(screen.getByText(/Тбилиси, 5 дней/)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Потрачено 0% плана' })).toBeInTheDocument();
  });

  it('adds an expense in local currency converted by the rate', async () => {
    renderBudget('/budget?city=tbilisi');
    await waitFor(() => expect(screen.getByText(/демо-курс/)).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText('Сумма'), { target: { value: '100' } });
    fireEvent.click(screen.getByRole('radio', { name: 'Впечатления' }));
    fireEvent.change(screen.getByLabelText('День'), { target: { value: '2' } });
    expect(screen.getByText(/≈ 3\s000 ₽ по курсу/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Добавить трату' }));
    expect(spent()).toMatchObject([
      { amount: 100, currency: 'GEL', rub: 3000, category: 'fun', day: 2 },
    ]);
    expect(screen.getByText(/Добавлено: Впечатления/)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /впечатления 100%/ })).toBeInTheDocument();
  });

  it('keeps the submit disabled for an empty amount', () => {
    renderBudget('/budget?city=tbilisi');
    expect(screen.getByRole('button', { name: 'Добавить трату' })).toBeDisabled();
  });

  it('fills an example, removes one expense and clears', () => {
    renderBudget('/budget?city=tbilisi');
    fireEvent.click(screen.getByRole('button', { name: 'Заполнить примером' }));
    const count = spent().length;
    expect(count).toBeGreaterThan(5);
    expect(
      screen.getByRole('img', { name: /Накопленные траты по дням: день 1/ }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: /^Удалить:/ })[0]);
    expect(spent()).toHaveLength(count - 1);
    fireEvent.click(screen.getByRole('button', { name: 'Очистить' }));
    expect(spent()).toEqual([]);
  });
});
