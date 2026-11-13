import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Button } from './Button';
import { Chip } from './Chip';
import { Folder } from './Folder';
import { Icon } from './Icon';

describe('Button', () => {
  it('renders a button with type="button" by default', () => {
    render(<Button>Найти</Button>);
    expect(screen.getByRole('button', { name: 'Найти' })).toHaveAttribute('type', 'button');
  });

  it('renders a link when "to" is passed', () => {
    render(
      <MemoryRouter>
        <Button to="/quiz">Подобрать</Button>
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Подобрать' })).toHaveAttribute('href', '/quiz');
  });
});

describe('Chip', () => {
  it('is a toggle with aria-pressed when interactive', () => {
    const onToggle = vi.fn();
    render(
      <Chip selected onToggle={onToggle}>
        Море
      </Chip>,
    );
    const chip = screen.getByRole('button', { name: 'Море' });
    expect(chip).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(chip);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('is a plain badge without onToggle', () => {
    render(<Chip>Хит</Chip>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

describe('Icon', () => {
  it('is hidden from assistive tech by default', () => {
    const { container } = render(<Icon name="search" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('gets role img with a label', () => {
    render(<Icon name="plane" label="Рейс" />);
    expect(screen.getByRole('img', { name: 'Рейс' })).toBeInTheDocument();
  });
});

describe('Folder', () => {
  it('shows the dossier only when open and exposes aria-expanded', () => {
    const { rerender } = render(
      <Folder code="TBS" title="Тбилиси" subtitle="Грузия" onSelect={() => undefined}>
        <a href="/city/tbilisi">Открыть направление</a>
      </Folder>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();

    rerender(
      <Folder code="TBS" title="Тбилиси" subtitle="Грузия" open onSelect={() => undefined}>
        <a href="/city/tbilisi">Открыть направление</a>
      </Folder>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Открыть направление' })).toBeInTheDocument();
  });
});
