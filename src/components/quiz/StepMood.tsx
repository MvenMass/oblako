import type { MouseEvent } from 'react';
import { Icon } from '@/components/ui/Icon';
import { citiesIndex } from '@/lib/cities';
import { useReducedMotion } from '@/lib/motion';
import { typograph } from '@/lib/typograph';
import type { MoodId } from '@/types/city';
import { MOOD_ICONS } from './moodIcons';
import { NextButton } from './NextButton';
import styles from './Steps.module.css';

interface StepMoodProps {
  moods: MoodId[];
  onChange: (moods: MoodId[]) => void;
  onNext: () => void;
}

/** Шаг 1: до двух настроений из шести, карточка наклоняется за курсором */
export function StepMood({ moods, onChange, onNext }: StepMoodProps) {
  const reduced = useReducedMotion();

  const toggle = (id: MoodId) => {
    if (moods.includes(id)) onChange(moods.filter((m) => m !== id));
    else if (moods.length < 2) onChange([...moods, id]);
  };

  // Наклон внутреннего слоя ±14° (только transform)
  const tilt = (e: MouseEvent<HTMLButtonElement>) => {
    if (reduced) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    (el.firstElementChild as HTMLElement).style.transform =
      `rotateY(${x * 14}deg) rotateX(${-y * 12}deg) translateZ(20px)`;
  };
  const untilt = (e: MouseEvent<HTMLButtonElement>) => {
    (e.currentTarget.firstElementChild as HTMLElement).style.transform = '';
  };

  const hint =
    moods.length === 2
      ? 'Максимум два — снимите одно, чтобы выбрать другое'
      : moods.length
        ? 'Можно добавить ещё одно'
        : 'Ничего не выбрано';

  return (
    <div className={styles.step}>
      <p className={styles.lead}>
        Выберите одно или&nbsp;два настроения&nbsp;— фон подстроится под&nbsp;выбор.
      </p>
      <div role="group" aria-label="Настроение поездки" className={styles.moods}>
        {citiesIndex.moods.map(({ id, label }) => {
          const on = moods.includes(id);
          const blocked = !on && moods.length === 2;
          return (
            <button
              key={id}
              type="button"
              className={`${styles.mood} ${on ? styles.moodOn : ''} ${blocked ? styles.moodBlocked : ''}`}
              aria-pressed={on}
              onClick={() => toggle(id)}
              onMouseMove={tilt}
              onMouseLeave={untilt}
            >
              <span className={styles.moodInner}>
                <svg aria-hidden="true" width="64" height="64" viewBox="0 0 60 60">
                  {MOOD_ICONS[id]}
                </svg>
                <span className={styles.moodLabel}>{typograph(label)}</span>
              </span>
              <span aria-hidden="true" className={styles.check}>
                <Icon name="check" size={14} />
              </span>
            </button>
          );
        })}
      </div>
      <div className={styles.footer}>
        <NextButton
          onClick={onNext}
          disabled={!moods.length}
          reason="Сначала выберите настроение"
        />
        <span className={styles.hint} aria-live="polite">
          {typograph(hint)}
        </span>
      </div>
    </div>
  );
}
