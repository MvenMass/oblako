import { useId } from 'react';
import styles from './Logo.module.css';

interface LogoProps {
  size?: 'md' | 'lg';
  className?: string;
}

export function Logo({ size = 'md', className }: LogoProps) {
  // Двоеточия из useId ломают url(#…) в старом Safari
  const gradId = `logo${useId().replace(/:/g, '')}`;
  return (
    <span className={[styles.logo, styles[size], className].filter(Boolean).join(' ')}>
      <svg aria-hidden="true" className={styles.cloud} viewBox="0 0 44 30">
        <defs>
          <linearGradient id={gradId} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" style={{ stopColor: 'var(--sky-light)' }} />
            <stop offset=".55" style={{ stopColor: 'var(--sky)' }} />
            <stop offset="1" style={{ stopColor: 'var(--sky-deep)' }} />
          </linearGradient>
        </defs>
        <path
          d="M12 28h22a9 9 0 0 0 1-17.9A12 12 0 0 0 12.4 8 10 10 0 0 0 12 28z"
          fill={`url(#${gradId})`}
        />
      </svg>
      <span className={styles.word}>OBLAKO</span>
    </span>
  );
}
