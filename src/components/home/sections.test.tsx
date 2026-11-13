import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ReactElement } from 'react';
import { Compare } from './Compare';
import { compareRows } from './compareRows';
import { FaqChat } from './FaqChat';
import { MoodCloud } from './MoodCloud';
import { Stories } from './Stories';
import { Ticket } from './Ticket';
import { getCity } from '@/lib/cities';
import { plural } from '@/lib/plural';

const withRouter = (ui: ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('MoodCloud', () => {
  it('starts with «море» selected and shows its cities', () => {
    withRouter(<MoodCloud />);
    expect(screen.getByRole('button', { name: 'море' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Слово «море»: 4 направления')).toBeInTheDocument();
    const hits = screen.getByRole('list', { name: 'Подходящие направления' });
    expect(within(hits).getByRole('link', { name: /Сочи/ })).toHaveAttribute('href', '/city/sochi');
  });

  it('switches tags and clears on second click', () => {
    withRouter(<MoodCloud />);
    fireEvent.click(screen.getByRole('button', { name: 'небоскрёбы' }));
    expect(screen.getByText('Слово «небоскрёбы»: 1 направление')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'небоскрёбы' }));
    expect(screen.getByText('Нажмите на любое слово в облаке')).toBeInTheDocument();
  });
});

describe('plural', () => {
  it.each([
    [1, 'направление'],
    [3, 'направления'],
    [5, 'направлений'],
    [11, 'направлений'],
    [22, 'направления'],
  ])('%i → %s', (n, word) => {
    expect(plural(n, ['направление', 'направления', 'направлений'])).toBe(word);
  });
});

describe('Compare', () => {
  it('marks cheaper and faster values as better', () => {
    const rows = compareRows(getCity('kazan')!, getCity('zanzibar')!);
    expect(rows.find((r) => r.label === 'Перелёт')?.better).toBe(true);
    expect(rows.find((r) => r.label === 'В пути')?.better).toBe(true);
    expect(rows.find((r) => r.label === 'Виза')?.better).toBe(false);
  });

  it('moves the split with arrow keys within 10–90', () => {
    render(<Compare />);
    const slider = screen.getByRole('slider', { name: 'Граница сравнения' });
    expect(slider).toHaveAttribute('aria-valuenow', '50');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(slider).toHaveAttribute('aria-valuenow', '55');
    fireEvent.keyDown(slider, { key: 'End' });
    expect(slider).toHaveAttribute('aria-valuenow', '90');
    fireEvent.keyDown(slider, { key: 'Home' });
    expect(slider).toHaveAttribute('aria-valuenow', '10');
  });

  it('changes cities via selects', () => {
    render(<Compare />);
    fireEvent.change(screen.getByLabelText('Слева'), { target: { value: 'altai' } });
    expect(screen.getAllByText('Алтай').length).toBeGreaterThan(0);
  });
});

describe('Stories', () => {
  it('opens the centre story as a dialog, closes on Escape and returns focus', () => {
    render(<Stories />);
    const card = screen.getByRole('button', { name: /Неделя в.Стамбуле.*открыть/ });
    fireEvent.click(card);
    const dialog = screen.getByRole('dialog', { name: 'Неделя в Стамбуле' });
    expect(within(dialog).getByRole('button', { name: 'Закрыть историю' })).toHaveFocus();

    vi.useFakeTimers();
    fireEvent.keyDown(document, { key: 'Escape' });
    act(() => vi.runAllTimers());
    vi.useRealTimers();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(card).toHaveFocus();
  });

  it('a side card becomes central instead of opening', () => {
    render(<Stories />);
    fireEvent.click(screen.getByRole('button', { name: /Тбилиси на.выходные.*показать/ }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Тбилиси на.выходные.*открыть/ }),
    ).toBeInTheDocument();
  });
});

describe('FaqChat', () => {
  it('answers after typing and disables the asked chip', () => {
    vi.useFakeTimers();
    render(<FaqChat />);
    fireEvent.click(screen.getByRole('button', { name: 'Это бесплатно?' }));
    expect(screen.getByRole('status', { name: 'Облако печатает' })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1200));
    const log = screen.getByRole('log');
    expect(log).toHaveTextContent(/Все инструменты бесплатны/);
    expect(screen.getByRole('button', { name: 'Это бесплатно?' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    vi.useRealTimers();
  });

  it('gives the fallback answer to a custom question', () => {
    vi.useFakeTimers();
    render(<FaqChat />);
    fireEvent.change(screen.getByLabelText('Свой вопрос'), {
      target: { value: 'А в Антарктиду?' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Отправить' }));
    act(() => vi.advanceTimersByTime(1200));
    expect(screen.getByRole('log')).toHaveTextContent(/демо.чат/);
    vi.useRealTimers();
  });
});

describe('Ticket', () => {
  it('tears the stub by click/Enter and focuses the quiz link', () => {
    withRouter(<Ticket />);
    fireEvent.click(screen.getByRole('button', { name: /Оторвать корешок/ }));
    const cta = screen.getByRole('link', { name: /Начать подбор/ });
    expect(cta).toHaveAttribute('href', '/quiz');
    expect(cta).toHaveFocus();
  });
});
