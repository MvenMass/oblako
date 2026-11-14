import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Quiz from './Quiz';
import { useUserStore } from '@/store/user';

function Probe() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <>
      <p data-testid="url">{location.pathname + location.search}</p>
      <button type="button" onClick={() => navigate(-1)}>
        browser-back
      </button>
    </>
  );
}

function renderQuiz(url = '/quiz') {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route
          path="/quiz"
          element={
            <>
              <Quiz />
              <Probe />
            </>
          }
        />
        <Route path="/route" element={<p>route page</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

const next = () => screen.getByRole('button', { name: /Дальше|Подобрать тур/ });

beforeEach(() => {
  localStorage.clear();
  useUserStore.getState().reset();
});
afterEach(() => vi.useRealTimers());

describe('Quiz', () => {
  it('keeps «Дальше» disabled until a mood is chosen', () => {
    renderQuiz();
    expect(next()).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(next());
    expect(screen.getByTestId('url')).toHaveTextContent('/quiz');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Чего/);
  });

  it('allows at most two moods', () => {
    renderQuiz();
    fireEvent.click(screen.getByRole('button', { name: /Море/ }));
    fireEvent.click(screen.getByRole('button', { name: /Горы/ }));
    fireEvent.click(screen.getByRole('button', { name: /Еда/ }));
    expect(screen.getByRole('button', { name: /Еда/ })).toHaveAttribute('aria-pressed', 'false');
    expect(next()).not.toHaveAttribute('aria-disabled');
  });

  it('moves through steps in the URL and supports the browser back button', () => {
    renderQuiz();
    fireEvent.click(screen.getByRole('button', { name: /Море/ }));
    fireEvent.click(next());
    expect(screen.getByTestId('url')).toHaveTextContent('step=2');
    expect(screen.getByRole('radiogroup', { name: 'Месяц поездки' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'browser-back' }));
    expect(screen.getByRole('button', { name: /Море/ })).toHaveAttribute('aria-pressed', 'true');
  });

  it('prefills answers from the home search form', () => {
    renderQuiz('/quiz?to=tbilisi&month=5&people=3');
    expect(screen.getByRole('button', { name: /Еда/ })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(next());
    expect(screen.getByRole('radio', { name: 'май' })).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(next());
    expect(screen.getByRole('radio', { name: 'Семья' })).toHaveAttribute('aria-checked', 'true');
  });

  it('calculates and shows a result that is saved to the store', () => {
    vi.useFakeTimers();
    renderQuiz('/quiz?to=istanbul');
    fireEvent.click(next());
    fireEvent.click(next());
    fireEvent.click(next());
    expect(screen.getByRole('status')).toHaveTextContent(/Смотрим/);
    act(() => vi.advanceTimersByTime(4000));
    expect(screen.getByTestId('url')).toHaveTextContent('step=5');
    const city = screen.getByRole('heading', { level: 2 });
    expect(screen.getByText(/Бюджет на.человека/)).toBeInTheDocument();
    expect(useUserStore.getState().quiz.result).toBeTruthy();
    expect(city.textContent).toBeTruthy();

    // «назад» с результата ведёт к бюджету, а не в расчёт
    fireEvent.click(screen.getByRole('button', { name: 'browser-back' }));
    expect(screen.getByTestId('url')).toHaveTextContent('step=3');
  });

  it('sends a direct link to a later step back to step 1 when nothing is chosen', () => {
    renderQuiz('/quiz?step=3');
    expect(screen.getByTestId('url')).toHaveTextContent('step=1');
  });
});
