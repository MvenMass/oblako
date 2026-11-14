import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Booking from './Booking';
import { useUserStore } from '@/store/user';

const renderBooking = (url = '/booking?city=tbilisi') =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/booking" element={<Booking />} />
      </Routes>
    </MemoryRouter>,
  );

const seatBtn = (id: string) => screen.getByRole('button', { name: new RegExp(`^Место ${id}\\b`) });
const pay = () => screen.getByRole('button', { name: /Оплатить|Оторвать|Корешок|Сначала/ });

beforeEach(() => {
  localStorage.clear();
  useUserStore.getState().reset();
});

describe('Booking', () => {
  it('shows the route and waits for a seat', () => {
    renderBooking();
    expect(screen.getByText(/Москва → Тбилиси · демо/)).toBeInTheDocument();
    expect(pay()).toBeDisabled();
    expect(pay()).toHaveTextContent('Сначала выберите место');
    expect(screen.getByRole('listitem', { current: 'step' })).toHaveTextContent('Место');
  });

  it('moves between seats with arrows and picks with Enter (native click)', () => {
    renderBooking();
    const start = seatBtn('7A');
    expect(start).toHaveAttribute('tabindex', '0');
    start.focus();
    fireEvent.keyDown(start, { key: 'ArrowRight' });
    const next = seatBtn('8A');
    expect(next).toHaveFocus();
    expect(next).toHaveAttribute('tabindex', '0');
    expect(start).toHaveAttribute('tabindex', '-1');
    fireEvent.click(next);
    expect(next).toHaveAttribute('aria-pressed', 'true');
    expect(useUserStore.getState().booking.seat).toBe('8A');
    expect(screen.getByRole('img', { name: /крыло/ })).toBeInTheDocument();
  });

  it('does not select a taken seat', () => {
    renderBooking();
    const taken = seatBtn('2A');
    expect(taken).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(taken);
    expect(useUserStore.getState().booking.seat).toBeNull();
  });

  it('toggles the window shade and remembers it', () => {
    renderBooking();
    const shade = screen.getByRole('button', { name: 'Шторка опущена' });
    expect(shade).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(shade);
    expect(shade).toHaveAttribute('aria-pressed', 'true');
    expect(useUserStore.getState().booking.shade).toBe(true);
  });

  it('prints the pass, puts the stub into the wallet and stamps the passport', () => {
    renderBooking();
    fireEvent.click(seatBtn('3A'));
    fireEvent.click(pay());
    expect(screen.getByText('талон напечатан')).toBeInTheDocument();
    expect(screen.getAllByText('ПОСАДОЧНЫЙ ТАЛОН · ДЕМО').length).toBeGreaterThan(0);
    fireEvent.click(pay());
    expect(pay()).toHaveTextContent('Корешок в кошельке ✓');
    const s = useUserStore.getState();
    expect(s.booking.passes).toHaveLength(1);
    expect(s.booking.passes[0]).toMatchObject({ cityId: 'tbilisi', seat: '3A' });
    expect(s.passport.stamps).toEqual(['tbilisi']);
    const wallet = screen.getByRole('region', { name: 'Кошелёк' });
    expect(within(wallet).getByText('1 талон')).toBeInTheDocument();
    expect(within(wallet).getByText('MOW → TBS')).toBeInTheDocument();
  });

  it('does not duplicate the stamp for a second booking to the same city', () => {
    renderBooking();
    for (const id of ['3A', '4A']) {
      fireEvent.click(seatBtn(id));
      fireEvent.click(pay());
      fireEvent.click(pay());
    }
    const s = useUserStore.getState();
    expect(s.booking.passes).toHaveLength(2);
    expect(s.passport.stamps).toEqual(['tbilisi']);
  });
});
