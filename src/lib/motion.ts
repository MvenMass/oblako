import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function getMedia(): MediaQueryList | null {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(QUERY)
    : null;
}

function subscribe(onChange: () => void): () => void {
  const media = getMedia();
  if (!media) return () => undefined;
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

function getSnapshot(): boolean {
  return getMedia()?.matches ?? false;
}

/** true, если пользователь просит уменьшить движение. Отключает параллакс, автоплеи и сияние. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export const ease = {
  out: 'cubic-bezier(.2,.8,.2,1)',
  spring: 'cubic-bezier(.3,1.3,.4,1)',
} as const;
