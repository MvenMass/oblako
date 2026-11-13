import { useId } from 'react';

/** Облако с грустным лицом — иллюстрация 404 (декор) */
export function SadCloud({ className }: { className?: string }) {
  const id = `sad${useId().replace(/:/g, '')}`;
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 220 150">
      <defs>
        <linearGradient id={id} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--white)' }} />
          <stop offset=".6" style={{ stopColor: 'var(--sky-light)' }} />
          <stop offset="1" style={{ stopColor: 'var(--sky)' }} />
        </linearGradient>
      </defs>
      <path
        d="M60 140h110a40 40 0 0 0 4-79.8A56 56 0 0 0 66 48a46 46 0 0 0-6 92z"
        fill={`url(#${id})`}
      />
      <g fill="var(--ink)">
        <circle cx="96" cy="92" r="5" />
        <circle cx="140" cy="92" r="5" />
      </g>
      <path
        d="M102 118q16-12 32 0"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M150 104q4 8 0 12q-4-4 0-12z" fill="var(--sky-deep)" />
    </svg>
  );
}
