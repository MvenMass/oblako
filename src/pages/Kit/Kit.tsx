import { Aurora } from '@/components/ui/Aurora';
import { Glass } from '@/components/ui/Glass';
import { Logo } from '@/components/ui/Logo';
import { KitButtons } from './KitButtons';
import { KitComponents } from './KitComponents';
import styles from './Kit.module.css';

const SWATCHES = [
  { name: 'Ночь', token: '--ink', hex: '#0B2540', role: 'текст' },
  { name: 'Глубина', token: '--sky-deep', hex: '#0A79A8', role: 'ссылки' },
  { name: 'Небо', token: '--sky', hex: '#38BDE8', role: 'аврора' },
  { name: 'Утро', token: '--morning', hex: '#E3F6FD', role: 'поверхности' },
  { name: 'Закат', token: '--pink', hex: '#C8146F', role: 'главная кнопка' },
  { name: 'Фламинго', token: '--flamingo', hex: '#E8288E', role: 'градиент' },
  { name: 'Сумерки', token: '--dusk', hex: '#8B6CF0', role: 'градиент' },
];

/** Стиль-гайд: повторяет docs/design/Main.dc.html и показывает все компоненты UI-кита */
export default function Kit() {
  return (
    <main id="main" className={styles.page}>
      <Aurora ribbons />

      <div className={`container ${styles.content}`}>
        <header className={styles.intro}>
          <div className={styles.introTitle}>
            <Logo size="lg" />
            <h1 className={styles.h1}>
              Путь начинается <span className="grad">в&nbsp;облаке</span>
            </h1>
          </div>
          <p className={styles.introText}>
            Небо&nbsp;— основа палитры. Акцент&nbsp;— не&nbsp;цвет кнопки, а&nbsp;живой градиент
            голубой → розовый → сиреневый: в&nbsp;словах, фоне, лентах света и&nbsp;3D‑иконках.
          </p>
        </header>

        <ul className={styles.swatches} aria-label="Палитра">
          {SWATCHES.map((s) => (
            <li key={s.token} className={styles.swatch}>
              <span
                aria-hidden="true"
                className={styles.swatchColor}
                style={{ background: `var(${s.token})` }}
              />
              <span className={styles.swatchName}>{s.name}</span>
              <span className={styles.swatchMeta}>
                {s.hex} · {s.role}
              </span>
            </li>
          ))}
        </ul>

        <p className={styles.brand}>Фирменный градиент: небо → фламинго → сумерки</p>

        <div className={styles.cards}>
          <Glass className={styles.card}>
            <p className={styles.eyebrow}>Шрифт · Onest</p>
            <p className={styles.cardTitle}>
              Один шрифт, <span className="grad">живой акцент</span>
            </p>
            <p className={styles.cardText}>
              Заголовки Onest 700 с&nbsp;плотным трекингом, текст Onest 400. Акцентное слово&nbsp;—
              не&nbsp;другой шрифт, а&nbsp;переливающаяся заливка.
            </p>
          </Glass>

          <KitButtons />

          <Glass className={styles.card}>
            <p className={styles.eyebrow}>3D‑иконки</p>
            <div className={styles.icons3d} aria-hidden="true">
              <span className={`${styles.icon3d} ${styles.iconSky}`} />
              <span className={`${styles.icon3d} ${styles.iconPink}`} />
              <span className={`${styles.icon3d} ${styles.iconDusk}`} />
            </div>
            <p className={styles.cardNote}>
              Самолёт, чемодан, компас, билет, камера&nbsp;— в&nbsp;цветах градиента, плавают
              и&nbsp;поворачиваются за&nbsp;курсором.
            </p>
          </Glass>
        </div>

        <p className={styles.footnote}>
          Фон: аврора из&nbsp;трёх пятен · Ленты света поверх · Зерно 7% · Liquid glass: белый +
          blur 24 + saturate 180% + блик сверху
        </p>

        <KitComponents />
      </div>
    </main>
  );
}
