import { useEffect, useState, useSyncExternalStore, type RefObject } from 'react';

function getMedia(query: string): MediaQueryList | null {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(query)
    : null;
}

/** Подписка на медиазапрос */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const media = getMedia(query);
      if (!media) return () => undefined;
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    },
    () => getMedia(query)?.matches ?? false,
    () => false,
  );
}

/** true, если пользователь просит уменьшить движение. Отключает параллакс, автоплеи и сияние. */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
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
