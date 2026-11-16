import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Tools } from './Tools';

describe('Tools', () => {
  it('renders 8 tool links with descriptions', () => {
    render(
      <MemoryRouter>
        <Tools />
      </MemoryRouter>,
    );
    const list = screen.getByRole('list');
    const links = within(list).getAllByRole('link');
    expect(links).toHaveLength(8);
    expect(links[0]).toHaveAttribute('href', '/destinations');
    expect(screen.getByRole('link', { name: /Табло.*демо/ })).toHaveAttribute('href', '/board');
  });

  it('has labelled scroll buttons, back disabled at the start', () => {
    render(
      <MemoryRouter>
        <Tools />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: 'Прокрутить назад' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Прокрутить вперёд' })).toBeInTheDocument();
  });

  it('moves focus between cards with arrow keys', () => {
    render(
      <MemoryRouter>
        <Tools />
      </MemoryRouter>,
    );
    const links = within(screen.getByRole('list')).getAllByRole('link');
    links[0].focus();
    fireEvent.keyDown(links[0], { key: 'ArrowRight' });
    expect(links[1]).toHaveFocus();
    fireEvent.keyDown(links[1], { key: 'ArrowLeft' });
    expect(links[0]).toHaveFocus();
  });
});
