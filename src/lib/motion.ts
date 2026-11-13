import { useEffect, useState, useSyncExternalStore, type RefObject } from 'react';

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

/** Однократно становится true, когда элемент входит в экран. Без IntersectionObserver — сразу true. */
export function useInView(
  ref: RefObject<Element | null>,
  rootMargin = '0px 0px -15% 0px',
): boolean {
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, inView]);

  return inView;
}

export const ease = {
  out: 'cubic-bezier(.2,.8,.2,1)',
  spring: 'cubic-bezier(.3,1.3,.4,1)',
} as const;
