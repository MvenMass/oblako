import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Folder } from '@/components/ui/Folder';
import { Glass } from '@/components/ui/Glass';
import { Icon } from '@/components/ui/Icon';
import { ICON_NAMES } from '@/components/ui/icons';
import { SectionHead } from '@/components/ui/SectionHead';
import { useReducedMotion } from '@/lib/motion';
import styles from './Kit.module.css';

const FILTERS = ['Все', 'Море', 'Горы', 'Города', 'На выходные'];

export function KitComponents() {
  const [filter, setFilter] = useState('Все');
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  return (
    <section className={styles.section} aria-labelledby="kit-components">
      <SectionHead
        id="kit-components"
        eyebrow="UI‑кит"
        title={
          <>
            Компоненты <span className="grad">и&nbsp;состояния</span>
          </>
        }
        lead={`Reduced motion: ${reduced ? 'включено — анимации остановлены' : 'выключено'}.`}
        action={
          <>
            <Button variant="glass" iconOnly aria-label="Предыдущее">
              <Icon name="chevron-left" />
            </Button>
            <Button variant="dark" iconOnly aria-label="Следующее">
              <Icon name="chevron-right" />
            </Button>
          </>
        }
      />

      <Glass className={styles.card}>
        <p className={styles.eyebrow}>Button</p>
        <div className={styles.row}>
          <Button iconStart="search">Найти</Button>
          <Button variant="dark">Тёмная</Button>
          <Button variant="glass" iconEnd="arrow-right">
            Стекло
          </Button>
          <Button variant="ghost">Призрачная</Button>
          <Button disabled>Недоступна</Button>
          <Button to="/" variant="glass">
            Ссылка-кнопка
          </Button>
        </div>
        <div className={styles.row}>
          <Button size="sm">Маленькая</Button>
          <Button size="sm" variant="glass">
            Маленькое стекло
          </Button>
          <Button size="sm" variant="ghost" iconOnly aria-label="Меню">
            <Icon name="menu" />
          </Button>
        </div>
      </Glass>

      <Glass className={styles.card}>
        <p className={styles.eyebrow}>Chip</p>
        <div className={styles.row} role="group" aria-label="Фильтр направлений">
          {FILTERS.map((f) => (
            <Chip key={f} size="lg" selected={filter === f} onToggle={() => setFilter(f)}>
              {f}
            </Chip>
          ))}
        </div>
        <div className={styles.row}>
          <Chip>Бейдж</Chip>
          <Chip selected>Выбранный бейдж</Chip>
        </div>
      </Glass>

      <Glass className={styles.card}>
        <p className={styles.eyebrow}>Icon</p>
        <ul className={styles.row} aria-label="Иконки">
          {ICON_NAMES.map((name) => (
            <li key={name} className={styles.iconCell}>
              <Icon name={name} size={24} />
              <span>{name}</span>
            </li>
          ))}
        </ul>
      </Glass>

      <div className={styles.glassPair}>
        <Glass className={styles.card}>
          <p className={styles.eyebrow}>Glass · светлое</p>
          <p className={styles.cardText}>Белый 42% + blur 24 + saturate 180%.</p>
        </Glass>
        <div className={styles.night}>
          <Glass tone="dark" className={styles.card}>
            <p className={styles.eyebrowLight}>Glass · тёмное</p>
            <p>Для табло и&nbsp;ночных сцен.</p>
          </Glass>
        </div>
      </div>

      <div className={styles.folders}>
        <Folder code="IST" title="Стамбул" subtitle="Турция" hit hint="Выбрать" />
        <Folder
          code="TBS"
          title="Тбилиси"
          subtitle="Грузия"
          hint={open ? 'Закрыть досье' : 'Открыть досье'}
          open={open}
          onSelect={() => setOpen((v) => !v)}
        >
          <p className={styles.eyebrow}>Досье · TBS</p>
          <p className={styles.cardText}>Содержимое досье появится на&nbsp;этапе направлений.</p>
        </Folder>
        <Folder
          code="KZN"
          title="Казань"
          subtitle="Россия"
          colors={['#7FC0B0', '#3E8C7B']}
          hint="Цвета города"
        />
      </div>
    </section>
  );
}
