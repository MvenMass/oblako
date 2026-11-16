import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HowItWorks } from './HowItWorks';

const renderHow = () =>
  render(
    <MemoryRouter>
      <HowItWorks />
    </MemoryRouter>,
  );

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
});
afterEach(() => vi.unstubAllGlobals());

describe('HowItWorks', () => {
  it('renders 4 steps; clicking a step makes it current', () => {
    const { container } = renderHow();
    const steps = within(container.querySelector('ol')!);
    expect(steps.getAllByRole('button')).toHaveLength(4);
    fireEvent.click(screen.getByRole('button', { name: /Забронировать/ }));
    expect(screen.getByRole('button', { name: /Забронировать/ })).toHaveAttribute(
      'aria-current',
      'step',
    );
  });

  it('shows trip facts for the chosen city', () => {
    renderHow();
    expect(screen.getByText('3 ч 40 мин')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Тбилиси' }));
    expect(screen.getByRole('button', { name: 'Тбилиси' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('link', { name: /Всё о\sнаправлении Тбилиси/ })).toHaveAttribute(
      'href',
      '/city/tbilisi',
    );
  });
});
