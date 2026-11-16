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
    // Куда: поиск по названию и Enter
    fireEvent.click(screen.getByRole('button', { name: /^Куда/ }));
    const search = screen.getByRole('combobox', { name: 'Найти город или страну' });
    fireEvent.change(search, { target: { value: 'тбил' } });
    fireEvent.keyDown(search, { key: 'Enter' });
    expect(screen.getByRole('button', { name: /^Куда/ })).toHaveTextContent('Тбилиси');
    // Когда: сетка месяцев, сезон города отмечен
    fireEvent.click(screen.getByRole('button', { name: /^Когда/ }));
    expect(screen.getByRole('radio', { name: /^Май, сезон/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('radio', { name: /^Май/ }));
    expect(screen.queryByRole('radiogroup')).toBeNull();
    // Сколько: счётчик
    fireEvent.click(screen.getByRole('button', { name: /^Сколько/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Больше' }));
    fireEvent.click(screen.getByRole('button', { name: 'Готово' }));
    expect(screen.getByRole('button', { name: /^Сколько/ })).toHaveTextContent('3 человека');
    fireEvent.submit(screen.getByRole('form', { name: 'Поиск поездки' }));
    expect(screen.getByTestId('location')).toHaveTextContent('/quiz?to=tbilisi&month=5&people=3');
  });

  it('closes a picker with Escape and returns focus to the field', () => {
    renderHero();
    const field = screen.getByRole('button', { name: /^Куда/ });
    fireEvent.click(field);
    expect(field).toHaveAttribute('aria-expanded', 'true');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(field).toHaveAttribute('aria-expanded', 'false');
    expect(field).toHaveFocus();
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
