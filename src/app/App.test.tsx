import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from './App';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe('App layout', { timeout: 15000 }, () => {
  it('renders main landmark, navigation and footer', async () => {
    renderAt('/');
    expect(
      await screen.findByRole('heading', { level: 1 }, { timeout: 10000 }),
    ).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Основная навигация' })).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('marks the active link with aria-current', async () => {
    renderAt('/route');
    await screen.findByRole('heading', { level: 1 }, { timeout: 10000 });
    const nav = screen.getByRole('navigation', { name: 'Основная навигация' });
    expect(within(nav).getByRole('link', { name: 'Маршрут' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(within(nav).getByRole('link', { name: 'Табло' })).not.toHaveAttribute('aria-current');
  });

  it('shows 404 for unknown paths', async () => {
    renderAt('/nowhere');
    expect(
      await screen.findByRole('heading', { name: /Такого облака нет/ }, { timeout: 10000 }),
    ).toBeInTheDocument();
    expect(document.title).toBe('Такого облака нет — OBLAKO');
  });

  it('opens the mobile menu, closes it on Escape and returns focus', async () => {
    renderAt('/');
    await screen.findByRole('heading', { level: 1 }, { timeout: 10000 });
    const burger = screen.getByRole('button', { name: 'Открыть меню' });
    fireEvent.click(burger);

    const dialog = screen.getByRole('dialog', { name: 'Меню' });
    expect(burger).toHaveAttribute('aria-expanded', 'true');
    expect(within(dialog).getByRole('link', { name: /Главная/ })).toHaveAttribute(
      'aria-current',
      'page',
    );

    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(burger).toHaveFocus();
  });

  it('shows a demo confirmation after subscribing', async () => {
    renderAt('/');
    await screen.findByRole('heading', { level: 1 }, { timeout: 10000 });
    fireEvent.change(screen.getByLabelText('Электронная почта'), {
      target: { value: 'a@b.ru' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Подписаться' }));
    expect(screen.getByRole('button', { name: 'Готово ✓' })).toBeDisabled();
    expect(screen.getByRole('status')).toHaveTextContent(/Демо/);
  });
});
