import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import About from './About';
import { useUserStore } from '@/store/user';

vi.mock('@/lib/photos', () => ({ deletePhoto: vi.fn(async () => undefined) }));

const renderAbout = () =>
  render(
    <MemoryRouter>
      <About />
    </MemoryRouter>,
  );

beforeEach(() => {
  localStorage.clear();
  useUserStore.getState().reset();
});

describe('About', () => {
  it('lists Pexels credits for every city photo', () => {
    renderAbout();
    const links = screen.getAllByRole('link', { name: /Pexels, откроется в новой вкладке/ });
    expect(links.length).toBe(88);
    links.forEach((a) => expect(a).toHaveAttribute('href', expect.stringMatching(/pexels\.com/)));
  });

  it('resets user data after confirmation', () => {
    useUserStore.getState().toggleFavorite('kazan');
    renderAbout();
    fireEvent.click(screen.getByRole('button', { name: 'Сбросить мои данные' }));
    fireEvent.click(screen.getByRole('button', { name: 'Да, сбросить' }));
    expect(useUserStore.getState().favorites).toEqual([]);
    expect(screen.getByRole('status')).toHaveTextContent('Данные сброшены');
  });
});
