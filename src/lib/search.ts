import { plural } from './plural';

export const MONTHS = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

export const PEOPLE = [1, 2, 3, 4, 5, 6];

/** Ссылка на квиз с параметрами формы: /quiz?to=tbilisi&month=5&people=2 */
export function quizUrl(to: string, month: string, people: string): string {
  const params = new URLSearchParams();
  if (to) params.set('to', to);
  if (month) params.set('month', month);
  params.set('people', people);
  return `/quiz?${params.toString()}`;
}

export const peopleText = (n: number) => `${n} ${plural(n, ['человек', 'человека', 'человек'])}`;
