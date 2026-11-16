import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DestList } from './DestList';
import { getCities, weekCost } from '@/lib/cities';
import { useUserStore } from '@/store/user';

const cities = getCities();
const renderList = () =>
  render(
    <MemoryRouter>
      <DestList cities={cities} />
    </MemoryRouter>,
  );
const names = () =>
  within(screen.getAllByRole('list')[0])
    .getAllByRole('heading', { level: 3 })
    .map((h) => h.textContent);

beforeEach(() => {
  localStorage.clear();
  useUserStore.getState().reset();
});

describe('DestList', () => {
  it('lists every destination, cheapest first', () => {
    renderList();
    const sorted = [...cities].sort((a, b) => weekCost(a) - weekCost(b)).map((c) => c.name);
    expect(names()).toEqual(sorted);
  });

  it('sorts by flight time and alphabet', () => {
    renderList();
    fireEvent.click(screen.getByRole('button', { name: 'Ближе' }));
    expect(names()[0]).toBe(
      [...cities].sort((a, b) => a.facts.flightMinutes - b.facts.flightMinutes)[0].name,
    );
    fireEvent.click(screen.getByRole('button', { name: 'По алфавиту' }));
    expect(names()).toEqual(
      [...cities].map((c) => c.name).sort((a, b) => a.localeCompare(b, 'ru')),
    );
  });

  it('toggles favorites and links to planning', () => {
    renderList();
    const fav = screen.getByRole('button', { name: 'Казань в избранное' });
    fireEvent.click(fav);
    expect(fav).toHaveAttribute('aria-pressed', 'true');
    expect(useUserStore.getState().favorites).toEqual(['kazan']);
    expect(screen.getAllByRole('link', { name: 'Спланировать' })[0]).toHaveAttribute(
      'href',
      expect.stringMatching(/^\/trip\?city=/),
    );
  });
});
