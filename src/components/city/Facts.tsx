import { formatRub, nbsp } from '@/lib/cities';
import { MONTH_LETTERS, monthRanges } from '@/lib/months';
import { typograph } from '@/lib/typograph';
import type { City } from '@/types/city';
import { CitySection } from './CitySection';
import { rateText, useCityRate } from './useCityData';
import styles from './Facts.module.css';

/** «Коротко о главном»: бенто фактов */
export function Facts({ city }: { city: City }) {
  const rate = useCityRate(city);
  const { facts } = city;
  const demoVisa = facts.visa.includes('*');

  return (
    <CitySection id="facts" title={<>Коротко о&nbsp;главном</>} aside="Данные демонстрационные">
      <div className={styles.bento}>
        <div className={`${styles.tile} ${styles.w2} ${styles.flight}`}>
          <div className={styles.col}>
            <span className={styles.label}>Перелёт из&nbsp;Москвы</span>
            <span className={styles.big}>≈&nbsp;{nbsp(facts.flight)}</span>
            <span className={styles.note}>ориентир, демо</span>
          </div>
          <svg aria-hidden="true" viewBox="0 0 300 100" className={styles.arc}>
            <path d="M20 80 Q 150 -10 280 70" className={styles.arcTrack} />
            <path d="M20 80 Q 150 -10 280 70" className={styles.arcDraw} />
            <circle cx="20" cy="80" r="6" className={styles.arcFrom} />
            <circle cx="280" cy="70" r="6" className={styles.arcTo} />
            <text x="20" y="98">
              MOW
            </text>
            <text x="280" y="92">
              {city.iata}
            </text>
          </svg>
        </div>

        <div className={styles.tile}>
          <span className={styles.label}>Виза{demoVisa && ' *'}</span>
          <span className={styles.mid}>{facts.visa.replace('*', '')}</span>
          <span className={styles.note}>
            {demoVisa ? '* демо: проверьте перед поездкой' : 'для граждан РФ, демо'}
          </span>
        </div>

        <div className={`${styles.tile} ${styles.accent}`}>
          <span className={styles.label}>Валюта</span>
          <span className={styles.mid}>
            {facts.currency.name}, {facts.currency.code}
          </span>
          <span className={styles.note}>
            {rate.isRub
              ? 'рубли — как дома'
              : `${rateText(facts.currency.rateCode, rate.rub)} · ${rate.caption}`}
          </span>
        </div>

        <div className={styles.tile}>
          <span className={styles.label}>Язык</span>
          <span className={styles.mid}>{facts.language}</span>
          <span className={styles.note}>{typograph(facts.languageNote)}</span>
        </div>

        <div className={styles.tile}>
          <span className={styles.label}>Время</span>
          <span className={styles.big}>{nbsp(facts.timeDiff)}</span>
          <span className={styles.note}>к&nbsp;Москве</span>
        </div>

        <div className={`${styles.tile} ${styles.w2}`}>
          <div className={styles.seasonHead}>
            <span className={styles.label}>Лучший сезон</span>
            <b className={styles.season}>{monthRanges(city.climate.bestMonths)}</b>
          </div>
          <div aria-hidden="true" className={styles.months}>
            {MONTH_LETTERS.map((m, i) => (
              <span
                key={i}
                className={city.climate.bestMonths.includes(i + 1) ? styles.best : undefined}
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        <div className={`${styles.tile} ${styles.w2}`}>
          <span className={styles.label}>Бюджет · демо</span>
          <span className={styles.mid}>от&nbsp;{formatRub(city.quiz.dailyRub)}</span>
          <span className={styles.note}>в&nbsp;день на&nbsp;человека</span>
        </div>

        <div className={`${styles.tile} ${styles.w2}`}>
          <span className={styles.label}>Розетки</span>
          <span className={styles.mid}>{nbsp(facts.plugs)}</span>
          <span className={styles.note}>возьмите переходник, если тип другой</span>
        </div>
      </div>
    </CitySection>
  );
}
