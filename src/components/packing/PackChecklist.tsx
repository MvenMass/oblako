import { useState, type FormEvent } from 'react';
import { Icon } from '@/components/ui/Icon';
import {
  GROUP_LABEL,
  GROUP_OF,
  ITEMS,
  itemKg,
  itemName,
  LIMITS,
  newItemId,
  type CustomItem,
  type PackGroup,
} from '@/lib/packing';
import styles from './PackChecklist.module.css';

interface PackChecklistProps {
  packed: Record<string, boolean>;
  tips: Record<string, string>;
  days: number;
  custom: CustomItem[];
  limit: number;
  onToggle: (id: string) => void;
  onAdd: (item: CustomItem) => void;
  onRemove: (id: string) => void;
  onLimit: (kg: number) => void;
}

const kgText = (kg: number) => (kg ? `${String(kg).replace('.', ',')} кг` : 'невесомо');

function Row({
  on,
  name,
  note,
  onToggle,
}: {
  on: boolean;
  name: string;
  note: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={on}
      className={styles.row}
      onClick={onToggle}
    >
      <span aria-hidden="true" className={styles.box}>
        <svg width="12" height="12" viewBox="0 0 24 24">
          <path d="M5 12l5 5 9-10" />
        </svg>
      </span>
      <span className={styles.text}>
        {name}
        <small>{note}</small>
      </span>
    </button>
  );
}

/** Список сборов: советы, обязательное, одежда, техника и свои вещи. Отметка — вещь летит в чемодан */
export function PackChecklist(props: PackChecklistProps) {
  const { packed, tips, days, custom, limit, onToggle, onAdd, onRemove, onLimit } = props;
  const [name, setName] = useState('');
  const [kg, setKg] = useState('');
  const tipItems = ITEMS.filter((it) => tips[it.id]);
  const groups = (['must', 'clothes', 'tech'] as PackGroup[]).map((g) => ({
    id: g,
    items: ITEMS.filter((it) => GROUP_OF[it.id] === g && !tips[it.id]),
  }));

  const add = (e: FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    const w = Math.min(30, Math.max(0, Number(kg.replace(',', '.')) || 0.3));
    onAdd({ id: newItemId(), name: n.slice(0, 40), kg: +w.toFixed(2) });
    setName('');
    setKg('');
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.limit} role="group" aria-label="Тариф багажа">
        {LIMITS.map((l) => (
          <button
            key={l.kg}
            type="button"
            aria-pressed={limit === l.kg}
            onClick={() => onLimit(l.kg)}
          >
            {l.label}
          </button>
        ))}
      </div>

      {tipItems.length > 0 && (
        <section className={styles.group} aria-labelledby="g-tips">
          <h2 id="g-tips">По погоде и&nbsp;обычаям</h2>
          {tipItems.map((it) => (
            <Row
              key={it.id}
              on={!!packed[it.id]}
              name={itemName(it, days)}
              note={tips[it.id]}
              onToggle={() => onToggle(it.id)}
            />
          ))}
        </section>
      )}

      {groups.map((g) => (
        <section key={g.id} className={styles.group} aria-labelledby={`g-${g.id}`}>
          <h2 id={`g-${g.id}`}>{GROUP_LABEL[g.id]}</h2>
          {g.items.map((it) => (
            <Row
              key={it.id}
              on={!!packed[it.id]}
              name={itemName(it, days)}
              note={kgText(itemKg(it, days))}
              onToggle={() => onToggle(it.id)}
            />
          ))}
        </section>
      ))}

      <section className={styles.group} aria-labelledby="g-own">
        <h2 id="g-own">Мои вещи</h2>
        {custom.map((c) => (
          <div key={c.id} className={styles.own}>
            <Row
              on={!!packed[c.id]}
              name={c.name}
              note={kgText(c.kg)}
              onToggle={() => onToggle(c.id)}
            />
            <button
              type="button"
              className={styles.remove}
              aria-label={`Удалить: ${c.name}`}
              onClick={() => onRemove(c.id)}
            >
              <Icon name="close" size={14} />
            </button>
          </div>
        ))}
        <form className={styles.add} onSubmit={add}>
          <label>
            <span className="visually-hidden">Название вещи</span>
            <input
              value={name}
              maxLength={40}
              placeholder="Например, фотоаппарат"
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            <span className="visually-hidden">Вес, кг</span>
            <input
              value={kg}
              inputMode="decimal"
              placeholder="кг"
              onChange={(e) => setKg(e.target.value.replace(/[^\d.,]/g, ''))}
            />
          </label>
          <button type="submit" disabled={!name.trim()}>
            Добавить
          </button>
        </form>
      </section>
    </div>
  );
}
