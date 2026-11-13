const NBSP = '\u00A0';
const NB_HYPHEN = '\u2011';

// Слово из 1–2 букв после начала строки, пробела или открывающего знака
const SHORT_WORD = /(^|[\s(«„"'])([A-Za-zА-Яа-яЁё]{1,2}) +/g;
const BEFORE_DASH = / +([—–])/g;
const WORD_HYPHEN = /([A-Za-zА-Яа-яЁё0-9])-(?=[A-Za-zА-Яа-яЁё])/g;

/**
 * Типографика для текстов из данных:
 * неразрывный пробел после слов из 1–2 букв и перед тире,
 * неразрывный дефис в словах через дефис. Повторный вызов ничего не меняет.
 */
export function typograph(text: string): string {
  let out = text.replace(BEFORE_DASH, `${NBSP}$1`).replace(WORD_HYPHEN, `$1${NB_HYPHEN}`);

  // Подряд идущие короткие слова («и в доме») делят пробел, поэтому повторяем до стабильности
  for (let i = 0; i < 5; i++) {
    const next = out.replace(SHORT_WORD, `$1$2${NBSP}`);
    if (next === out) break;
    out = next;
  }
  return out;
}
