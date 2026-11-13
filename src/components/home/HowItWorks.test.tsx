import { fireEvent, render, screen } from '@testing-library/react';
import { HowItWorks } from './HowItWorks';

describe('HowItWorks', () => {
  it('renders 4 steps; clicking a step makes it current', () => {
    render(<HowItWorks />);
    const steps = screen.getAllByRole('button');
    expect(steps).toHaveLength(4);
    fireEvent.click(screen.getByRole('button', { name: /Забронировать/ }));
    expect(screen.getByRole('button', { name: /Забронировать/ })).toHaveAttribute(
      'aria-current',
      'step',
    );
  });

  it('exposes real gauge values to assistive tech', () => {
    render(<HowItWorks />);
    expect(screen.getByText('направлений').previousSibling).toHaveTextContent('11');
  });
});
