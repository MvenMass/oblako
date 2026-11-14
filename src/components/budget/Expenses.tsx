import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { formatRub } from '@/lib/cities';
import { CATEGORIES, categoryLabel, newExpenseId, toRub } from '@/lib/budget';
import { useUserStore } from '@/store/user';
import type { ExpenseCategory, Expense } from '@/types/user';
import t from './Tiles.module.css';
import styles from './Expenses.module.css';

interface ExpensesProps {
  expenses: Expense[];
  days: number;
  /** Код местной валюты и рублей за единицу; для рубля — null */
  local: { code: string; rate: number } | null;
}

const money = (e: Expense) =>
  e.currency === 'RUB' ? formatRub(e.amount) : `${e.amount.toLocaleString('ru-RU')} ${e.currency}`;

/** Форма «+ трата» и список трат по дням */
export function Expenses({ expenses, days, local }: ExpensesProps) {
  const addExpense = useUserStore((s) => s.addExpense);
  const removeExpense = useUserStore((s) => s.removeExpense);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(local?.code ?? 'RUB');
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [day, setDay] = useState(1);
  const [status, setStatus] = useState('');

  const value = Number(amount.replace(',', '.'));
  const valid = value > 0 && Number.isFinite(value);
  const rate = currency === 'RUB' ? 1 : (local?.rate ?? 1);
  const rub = valid ? toRub(value, currency, rate) : 0;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    addExpense({
      id: newExpenseId(),
      amount: value,
      currency,
      rub,
      category,
      day: Math.min(day, days),
    });
    setStatus(`Добавлено: ${categoryLabel(category)}, ${formatRub(rub)}, день ${day}`);
    setAmount('');
  };

  const sorted = [...expenses].sort((a, b) => a.day - b.day);

  return (
    <div className={`${t.tile} ${t.full} ${styles.tile}`}>
      <form className={styles.form} onSubmit={submit} aria-labelledby="expense-title">
        <h2 id="expense-title" className={styles.title}>
          Новая трата
        </h2>
        <div className={styles.fields}>
          <label className={styles.field}>
            <span>Сумма</span>
            <input
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d.,]/g, ''))}
              placeholder="0"
              required
            />
          </label>
          {local && (
            <label className={styles.field}>
              <span>Валюта</span>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value={local.code}>{local.code}</option>
                <option value="RUB">RUB</option>
              </select>
            </label>
          )}
          <label className={styles.field}>
            <span>День</span>
            <select value={Math.min(day, days)} onChange={(e) => setDay(Number(e.target.value))}>
              {Array.from({ length: days }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </label>
        </div>
        <fieldset className={styles.cats}>
          <legend>Категория</legend>
          {CATEGORIES.map((c) => (
            <label key={c.id} className={styles.cat}>
              <input
                type="radio"
                name="category"
                value={c.id}
                checked={category === c.id}
                onChange={() => setCategory(c.id)}
              />
              <span>
                <i aria-hidden="true" style={{ background: c.color }} />
                {c.label}
              </span>
            </label>
          ))}
        </fieldset>
        <div className={styles.submit}>
          <Button type="submit" iconStart="plus" disabled={!valid}>
            Добавить трату
          </Button>
          <span className={t.note}>
            {valid && currency !== 'RUB'
              ? `≈ ${formatRub(rub)} по курсу`
              : 'конвертация по курсу ЦБ'}
          </span>
        </div>
        <p className="visually-hidden" aria-live="polite">
          {status}
        </p>
      </form>

      <div className={styles.listWrap}>
        <h2 className={styles.title}>Траты · {expenses.length}</h2>
        {sorted.length ? (
          <ul className={styles.list}>
            {sorted.map((e) => (
              <li key={e.id}>
                <i
                  aria-hidden="true"
                  style={{ background: CATEGORIES.find((c) => c.id === e.category)?.color }}
                />
                <span className={styles.what}>
                  {categoryLabel(e.category)}
                  <small>день {e.day}</small>
                </span>
                <span className={styles.sum}>
                  {money(e)}
                  {e.currency !== 'RUB' && <small>{formatRub(e.rub)}</small>}
                </span>
                <button
                  type="button"
                  className={styles.remove}
                  aria-label={`Удалить: ${categoryLabel(e.category)}, ${formatRub(e.rub)}, день ${e.day}`}
                  onClick={() => removeExpense(e.id)}
                >
                  <Icon name="close" size={14} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>
            Пока пусто&nbsp;— добавьте первую трату или&nbsp;заполните примером.
          </p>
        )}
      </div>
    </div>
  );
}
