/** Демо-салон: 20 рядов, места A–F, проход между C и D */
export const ROWS = 20;
/** Сверху вниз на схеме: F E D | проход | C B A */
export const LETTERS = ['F', 'E', 'D', 'C', 'B', 'A'] as const;
export const EXTRA_ROWS = [1, 12];
export const WING_ROWS = [7, 8, 9, 10, 11];
export const EXTRA_PRICE = 1500;

const TAKEN = new Set(
  (
    '1C 2A 2B 3D 4F 5A 5B 6E 8C 8D 9A 10F ' + '11B 13C 13D 14A 15E 15F 16B 17C 18D 19A 19F 20C'
  ).split(' '),
);

export interface SeatInfo {
  id: string;
  row: number;
  letter: string;
  window: boolean;
  aisle: boolean;
  extra: boolean;
  wing: boolean;
  taken: boolean;
}

export function seatInfo(id: string): SeatInfo {
  const row = parseInt(id, 10);
  const letter = id.replace(/\d/g, '');
  const window = letter === 'A' || letter === 'F';
  return {
    id,
    row,
    letter,
    window,
    aisle: letter === 'C' || letter === 'D',
    extra: EXTRA_ROWS.includes(row),
    wing: window && WING_ROWS.includes(row),
    taken: TAKEN.has(id),
  };
}

export function isValidSeat(id: string | null): id is string {
  if (!id || !/^\d{1,2}[A-F]$/.test(id)) return false;
  const s = seatInfo(id);
  return s.row >= 1 && s.row <= ROWS && !s.taken;
}

export function seatLabel(s: SeatInfo): string {
  return `Место ${s.id}${s.taken ? ', занято' : s.extra ? ', больше места для ног' : ''}${
    s.window ? ', у окна' : s.aisle ? ', у прохода' : ''
  }`;
}

export function seatNote(s: SeatInfo): string {
  const base = s.window ? 'у окна' : s.aisle ? 'у прохода' : 'посередине';
  return s.extra ? `${base}, место для ног` : base;
}

/** Что видно из иллюминатора с этого места */
export function windowView(s: SeatInfo): { title: string; text: string; aria: string } {
  if (!s.window) {
    return s.aisle
      ? {
          title: 'Окно далеко',
          text: 'Зато можно встать, не беспокоя соседей.',
          aria: 'Иллюминатор далеко, вид размыт',
        }
      : {
          title: 'Между соседями',
          text: 'Небо видно только через плечо соседа.',
          aria: 'Иллюминатор через соседа, вид размыт',
        };
  }
  return s.wing
    ? {
        title: 'Вид на крыло',
        text: 'Крыло закрывает часть неба, зато над ним меньше трясёт.',
        aria: 'Иллюминатор: видно крыло и облака',
      }
    : {
        title: 'Чистый вид на облака',
        text: 'Облака, закат и города внизу — без помех.',
        aria: 'Иллюминатор: видно облака',
      };
}

/** Соседнее место по стрелке: ←/→ — ряды, ↑/↓ — буквы */
export function moveSeat(id: string, key: string): string | null {
  const s = seatInfo(id);
  const li = LETTERS.indexOf(s.letter as (typeof LETTERS)[number]);
  if (key === 'ArrowLeft') return s.row > 1 ? `${s.row - 1}${s.letter}` : null;
  if (key === 'ArrowRight') return s.row < ROWS ? `${s.row + 1}${s.letter}` : null;
  if (key === 'ArrowUp') return li > 0 ? `${s.row}${LETTERS[li - 1]}` : null;
  if (key === 'ArrowDown') return li < LETTERS.length - 1 ? `${s.row}${LETTERS[li + 1]}` : null;
  return null;
}

export function seatPrice(base: number, s: SeatInfo): number {
  return base + (s.extra ? EXTRA_PRICE : 0);
}
