import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Journal from './Journal';
import { useUserStore } from '@/store/user';

const db = new Map<string, Blob>();
vi.mock('@/lib/photos', () => ({
  savePhoto: vi.fn(async (id: string, blob: Blob) => {
    db.set(id, blob);
    return true;
  }),
  getPhoto: vi.fn(async (id: string) => db.get(id) ?? null),
  deletePhoto: vi.fn(async (id: string) => {
    db.delete(id);
  }),
}));

const renderJournal = () =>
  render(
    <MemoryRouter>
      <Journal />
    </MemoryRouter>,
  );

beforeEach(() => {
  localStorage.clear();
  db.clear();
  useUserStore.getState().reset();
  URL.createObjectURL = vi.fn((b: Blob) => `blob:${(b as File).name}`);
  URL.revokeObjectURL = vi.fn();
});

describe('Journal', () => {
  it('shows the Tbilisi memory from the demo trip and opens it as a story', () => {
    renderJournal();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Год назад вы были в Тбилиси',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Смотреть как сторис' }));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAccessibleName(/Тбилиси, осень/);
    fireEvent.click(within(dialog).getByRole('button', { name: 'Закрыть историю' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('lays polaroids on the table and opens a story from one', () => {
    renderJournal();
    const polas = screen.getAllByRole('button', { name: /Открыть сторис$/ });
    expect(polas.length).toBe(8);
    fireEvent.click(polas[2]);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('3 из 8 · стрелки ← →')).toBeInTheDocument();
  });

  it('moves focus with previous / next photo buttons', () => {
    renderJournal();
    const polas = screen.getAllByRole('button', { name: /Открыть сторис$/ });
    fireEvent.click(screen.getByRole('button', { name: 'Следующее фото' }));
    expect(polas[1]).toHaveFocus();
    fireEvent.click(screen.getByRole('button', { name: 'Предыдущее фото' }));
    fireEvent.click(screen.getByRole('button', { name: 'Предыдущее фото' }));
    expect(polas[7]).toHaveFocus();
  });

  it('adds a trip with photos into IndexedDB and filters by it', async () => {
    renderJournal();
    fireEvent.click(screen.getByText('Добавить поездку'));
    fireEvent.change(screen.getByLabelText('Город'), { target: { value: 'kazan' } });
    const files = [
      new File(['a'], 'b.jpg', { type: 'image/jpeg', lastModified: 2 }),
      new File(['b'], 'a.jpg', { type: 'image/jpeg', lastModified: 1 }),
    ];
    fireEvent.change(screen.getByLabelText('Фото'), { target: { files } });
    fireEvent.click(screen.getByRole('checkbox', { name: 'Эчпочмак' }));
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Сохранить поездку' }));
    });
    const trip = useUserStore.getState().journal.trips[0];
    expect(trip).toMatchObject({ cityId: 'kazan', dishes: ['Эчпочмак'] });
    expect(trip.photoIds).toHaveLength(2);
    // Порядок съёмки — по времени файла
    expect((db.get(trip.photoIds[0]) as File).name).toBe('a.jpg');
    expect(screen.getByRole('button', { name: /^Казань ·/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await waitFor(() =>
      expect(screen.getAllByRole('button', { name: /Открыть сторис$/ })).toHaveLength(2),
    );
  });

  it('deletes a user trip together with its photos', async () => {
    useUserStore.getState().addTrip({
      id: 't1',
      cityId: 'sochi',
      title: 'Сочи',
      date: '2026-08-01',
      photoIds: ['t1-0'],
    });
    db.set('t1-0', new File(['x'], 'x.jpg'));
    renderJournal();
    fireEvent.click(screen.getByRole('button', { name: /^Сочи ·/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Удалить поездку' }));
    expect(useUserStore.getState().journal.trips).toEqual([]);
    await waitFor(() => expect(db.has('t1-0')).toBe(false));
  });
});
