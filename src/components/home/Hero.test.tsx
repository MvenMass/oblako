import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Hero } from './Hero';
import { quizUrl } from '@/lib/search';

function QuizProbe() {
  const { pathname, search } = useLocation();
  return <p data-testid="location">{pathname + search}</p>;
}

function renderHero() {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/quiz" element={<QuizProbe />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  sessionStorage.clear();
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
});

afterEach(() => vi.unstubAllGlobals());

describe('Hero', () => {
  it('renders the heading and a labelled globe', () => {
    renderHero();
    expect(screen.getByRole('heading', { level: 1, name: /Путь начинается/ })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Точечный глобус.*Тбилиси/ })).toBeInTheDocument();
  });

  it('sends the search form to the quiz with parameters', () => {
    renderHero();
    fireEvent.change(screen.getByLabelText('Куда'), { target: { value: 'tbilisi' } });
    fireEvent.change(screen.getByLabelText('Когда'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('Сколько'), { target: { value: '3' } });
    fireEvent.submit(screen.getByRole('form', { name: 'Поиск поездки' }));
    expect(screen.getByTestId('location')).toHaveTextContent('/quiz?to=tbilisi&month=5&people=3');
  });

  it('shows a dash when the weather is unavailable', async () => {
    renderHero();
    await waitFor(() => expect(screen.getByText('нет связи с Open‑Meteo')).toBeInTheDocument());
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});

describe('quizUrl', () => {
  it('omits empty values', () => {
    expect(quizUrl('', '', '2')).toBe('/quiz?people=2');
  });
});
