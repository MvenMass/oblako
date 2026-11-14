import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Icon } from '@/components/ui/Icon';
import { plural } from '@/lib/plural';
import { initials } from '@/lib/profile';
import { useUserStore } from '@/store/user';
import styles from './ProfileHeader.module.css';

interface ProfileHeaderProps {
  level: number;
  progress: number;
  toNext: number;
  stamps: number;
}

/** Аватар-инициалы, редактируемое имя, уровень и прогресс до следующего */
export function ProfileHeader({ level, progress, toNext, stamps }: ProfileHeaderProps) {
  const name = useUserStore((s) => s.profile.name);
  const setName = useUserStore((s) => s.setName);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const input = useRef<HTMLInputElement>(null);
  const pen = useRef<HTMLButtonElement>(null);
  const wasEditing = useRef(false);

  // Фокус: в поле при открытии редактора, обратно на карандаш после сохранения
  useEffect(() => {
    if (editing) input.current?.focus();
    else if (wasEditing.current) pen.current?.focus();
    wasEditing.current = editing;
  }, [editing]);

  const save = (e: FormEvent) => {
    e.preventDefault();
    const v = draft.trim();
    if (v) setName(v.slice(0, 40));
    setEditing(false);
  };

  return (
    <section className={styles.card} aria-labelledby="profile-name">
      <span aria-hidden="true" className={styles.avatar}>
        {initials(name)}
      </span>
      <div className={styles.who}>
        {editing ? (
          <form className={styles.edit} onSubmit={save}>
            <label className="visually-hidden" htmlFor="name-input">
              Имя и фамилия
            </label>
            <input
              id="name-input"
              ref={input}
              value={draft}
              maxLength={40}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && setEditing(false)}
            />
            <button type="submit" className={styles.save}>
              Сохранить
            </button>
          </form>
        ) : (
          <div className={styles.nameRow}>
            <h1 id="profile-name" className={styles.name}>
              {name}
            </h1>
            <button
              type="button"
              ref={pen}
              className={styles.pen}
              aria-label="Изменить имя"
              onClick={() => {
                setDraft(name);
                setEditing(true);
              }}
            >
              <Icon name="pen" size={18} />
            </button>
          </div>
        )}
        <span className={styles.sub}>
          В&nbsp;OBLAKO · {stamps}&nbsp;{plural(stamps, ['штамп', 'штампа', 'штампов'])}{' '}
          в&nbsp;паспорте
        </span>
      </div>
      <div className={styles.level}>
        <div className={styles.levelHead}>
          <b>Уровень {level}</b>
          <span>до&nbsp;следующего {toNext}&nbsp;очков</span>
        </div>
        <div
          className={styles.bar}
          role="progressbar"
          aria-label={`Уровень ${level}`}
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
      </div>
    </section>
  );
}
