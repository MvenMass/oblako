import { typograph } from './typograph';

const NB = '\u00A0';
const NBH = '\u2011';

describe('typograph', () => {
  it('binds short words to the next word', () => {
    expect(typograph('Путь начинается в облаке')).toBe(`Путь начинается в${NB}облаке`);
    expect(typograph('Мы летим на юг')).toBe(`Мы${NB}летим на${NB}юг`);
  });

  it('handles consecutive short words', () => {
    expect(typograph('и в доме')).toBe(`и${NB}в${NB}доме`);
  });

  it('works at the start of a string and after brackets and quotes', () => {
    expect(typograph('В горах')).toBe(`В${NB}горах`);
    expect(typograph('(по пути)')).toBe(`(по${NB}пути)`);
    expect(typograph('«За морем»')).toBe(`«За${NB}морем»`);
  });

  it('does not touch longer words', () => {
    expect(typograph('Город моря')).toBe('Город моря');
  });

  it('puts a non-breaking space before dashes', () => {
    expect(typograph('Небо — основа')).toBe(`Небо${NB}— основа`);
    expect(typograph('Июнь – август')).toBe(`Июнь${NB}– август`);
  });

  it('keeps number ranges intact', () => {
    expect(typograph('10–12 дней')).toBe('10–12 дней');
    expect(typograph('10-12')).toBe('10-12');
  });

  it('replaces hyphens inside words with non-breaking ones', () => {
    expect(typograph('Санкт-Петербург')).toBe(`Санкт${NBH}Петербург`);
    expect(typograph('3D-иконки')).toBe(`3D${NBH}иконки`);
  });

  it('is idempotent', () => {
    const once = typograph('Акцент — не цвет кнопки, а живой градиент в 3D-иконках');
    expect(typograph(once)).toBe(once);
  });

  it('returns an empty string unchanged', () => {
    expect(typograph('')).toBe('');
  });
});
