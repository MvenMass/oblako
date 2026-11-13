import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Glass } from '@/components/ui/Glass';
import styles from './Kit.module.css';

const MOODS = ['Море', 'Горы', 'Еда'];

export function KitButtons() {
  const [mood, setMood] = useState('Море');

  return (
    <Glass className={styles.card}>
      <p className={styles.eyebrow}>Кнопки · скругление 14</p>
      <div className={styles.row}>
        <Button>Спланировать поездку</Button>
        <Button variant="glass">Стекло</Button>
      </div>
      <div className={styles.row} role="group" aria-label="Настроение">
        {MOODS.map((m) => (
          <Chip key={m} selected={mood === m} onToggle={() => setMood(m)}>
            {m}
          </Chip>
        ))}
      </div>
    </Glass>
  );
}
