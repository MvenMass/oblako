import type { CSSProperties, ReactNode } from 'react';
import { Icon } from './Icon';
import styles from './Folder.module.css';

interface FolderProps {
  /** Код на «ушке», например IATA: TBS */
  code: string;
  title: string;
  subtitle: string;
  /** Градиент папки: [светлый, тёмный] из theme.folder. Без него — фирменный (хит) или приглушённый */
  colors?: [string, string];
  hit?: boolean;
  open?: boolean;
  /** Подсказка внизу передней стенки */
  hint?: string;
  onSelect?: () => void;
  /** -1 — убрать кнопку из порядка табуляции (боковые папки карусели) */
  tabIndex?: number;
  /** Содержимое досье — выезжает при open */
  children?: ReactNode;
  className?: string;
}

export function Folder({
  code,
  title,
  subtitle,
  colors,
  hit = false,
  open = false,
  hint,
  onSelect,
  tabIndex,
  children,
  className,
}: FolderProps) {
  const fill = colors
    ? `linear-gradient(160deg, ${colors[0]}, ${colors[1]})`
    : hit
      ? 'var(--grad-brand-diag)'
      : 'var(--grad-folder-muted)';

  const vars = { '--folder-fill': fill } as CSSProperties;
  const cls = [styles.folder, hit && styles.hit, open && styles.open, className]
    .filter(Boolean)
    .join(' ');

  const front = (
    <>
      <span className={styles.top}>
        <span aria-hidden="true" className={styles.icon} />
        {hit && <span className={styles.badge}>ХИТ</span>}
      </span>
      <span className={styles.name}>
        <span className={styles.title}>{title}</span>
        <span className={styles.subtitle}>{subtitle}</span>
      </span>
      {hint && (
        <span className={styles.hint}>
          <span>{hint}</span>
          <Icon name="arrow-up-right" size={18} />
        </span>
      )}
    </>
  );

  return (
    <div className={cls} style={vars}>
      <span aria-hidden="true" className={styles.tab}>
        {code}
      </span>
      <span aria-hidden="true" className={styles.back} />
      {/* Листок виден всегда, содержимое — только в открытом виде (не попадает в фокус закрытым) */}
      <div className={styles.sheet} aria-hidden={!open || undefined}>
        {open && children}
      </div>
      {onSelect ? (
        <button
          type="button"
          className={styles.front}
          onClick={onSelect}
          tabIndex={tabIndex}
          aria-expanded={children !== undefined ? open : undefined}
        >
          {front}
        </button>
      ) : (
        <div className={styles.front}>{front}</div>
      )}
    </div>
  );
}
