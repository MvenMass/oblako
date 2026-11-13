import { render, screen, within } from '@testing-library/react';
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
});
