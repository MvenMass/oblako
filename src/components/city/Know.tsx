import { Icon } from '@/components/ui/Icon';
import { typograph } from '@/lib/typograph';
import type { City } from '@/types/city';
import styles from './Know.module.css';

/** «Что нужно знать»: аккордеон на <details>, первый пункт открыт */
export function Know({ city }: { city: City }) {
  return (
    <section className={styles.section} aria-labelledby="know-title">
      <div className={styles.intro}>
        <h2 id="know-title" className={styles.title}>
          Что нужно <span className="grad">знать</span>
        </h2>
        <p className={styles.lead}>
          Коротко о&nbsp;правилах и&nbsp;привычках, чтобы чувствовать себя своим.
        </p>
      </div>
      <div className={styles.list}>
        {city.know.map((k, i) => (
          <details key={k.title} className={styles.item} open={i === 0}>
            <summary className={styles.summary}>
              {typograph(k.title)}
              <Icon name="plus" size={18} className={styles.plus} />
            </summary>
            <p className={styles.text}>{typograph(k.text)}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
