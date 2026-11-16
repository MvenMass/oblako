import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Profile from './Profile';
import { useUserStore } from '@/store/user';

const renderProfile = () =>
  render(
    <MemoryRouter>
      <Profile />
    </MemoryRouter>,
  );

const book = (cityId: string, seat = '7A') =>
  useUserStore
    .getState()
    .completeBooking({ id: `p-${cityId}-${seat}`, cityId, seat, issuedAt: '2026-11-14T10:00:00Z' });

beforeEach(() => {
  localStorage.clear();
  useUserStore.getState().reset();
});

describe('Profile', () => {
  it('edits the name and shows initials', () => {
    renderProfile();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('[Имя Фамилия]');
    fireEvent.click(screen.getByRole('button', { name: 'Изменить имя' }));
    const input = screen.getByLabelText('Имя и фамилия');
    expect(input).toHaveFocus();
    fireEvent.change(input, { target: { value: 'Анна Облакова' } });
    fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }));
    expect(useUserStore.getState().profile.name).toBe('Анна Облакова');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Анна Облакова');
    expect(screen.getByRole('button', { name: 'Изменить имя' })).toHaveFocus();
  });

  it('opens the passport and pages through stamps', () => {
    ['tbilisi', 'istanbul', 'yerevan', 'kazan', 'altai', 'sochi', 'hanoi'].forEach((c) => book(c));
    renderProfile();
    const toggle = screen.getByRole('button', { name: 'Открыть паспорт' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: 'Закрыть паспорт' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByText('Страница 1 из 2')).toBeInTheDocument();
    expect(screen.getByText('TBS')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Следующая' }));
    expect(screen.getByText('Страница 2 из 2')).toBeInTheDocument();
    expect(screen.getByText('HAN')).toBeInTheDocument();
    expect(screen.queryByText('TBS')).toBeNull();
  });

  it('shows an empty passport with a booking link', () => {
    renderProfile();
    fireEvent.click(screen.getByRole('button', { name: 'Открыть паспорт' }));
    expect(screen.getByRole('link', { name: 'Забронировать перелёт' })).toHaveAttribute(
      'href',
      '/booking',
    );
  });

  it('counts stats and unlocks achievements into the store', () => {
    book('altai');
    book('altai', '8A');
    renderProfile();
    const stats = screen.getByText('Км в небе').closest('dl')!;
    // 2 перелёта × 270 мин × 13 км/мин
    expect(within(stats).getByText(/^7\s020$/)).toBeInTheDocument();
    expect(within(stats).getByText('Страны').nextSibling).toHaveTextContent('1');
    const first = screen.getByText('Первый перелёт').closest('li')!;
    expect(within(first).getByText('Получено')).toBeInTheDocument();
    expect(useUserStore.getState().passport.achievements.sort()).toEqual(
      ['first-flight', 'mountains'].sort(),
    );
    const gourmet = screen.getByText('Гурман').closest('li')!;
    expect(within(gourmet).getByText('Закрыто')).toBeInTheDocument();
  });
});
