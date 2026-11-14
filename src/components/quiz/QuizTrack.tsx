import type { CSSProperties } from 'react';
import { Icon } from '@/components/ui/Icon';
import { STEP_NAMES } from '@/data/quiz';
import styles from './QuizTrack.module.css';

/** Пунктирный трек с самолётиком и 5 подписями шагов */
export function QuizTrack({ step }: { step: number }) {
  const progress = (step - 1) / (STEP_NAMES.length - 1);
  return (
    <ol
      className={styles.track}
      aria-label="Шаги подбора"
      style={{ '--p': progress } as CSSProperties}
    >
      <span aria-hidden="true" className={styles.dash} />
      <span aria-hidden="true" className={styles.fill} />
      <span aria-hidden="true" className={styles.plane}>
        <Icon name="plane" size={30} />
      </span>
      {STEP_NAMES.map((name, i) => {
        const n = i + 1;
        const state = n < step ? styles.done : n === step ? styles.current : '';
        return (
          <li
            key={name}
            className={`${styles.item} ${state}`}
            aria-current={n === step ? 'step' : undefined}
          >
            <span aria-hidden="true" className={styles.dot} />
            <span className={styles.label}>
              <span className="visually-hidden">Шаг {n}: </span>
              {name}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
