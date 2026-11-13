import { useCallback, useEffect, useLayoutEffect, useRef, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollToY } from '@/lib/scroll';
import { STOPS } from './howPath';

export type HowMode = 'pin' | 'auto' | 'static';

const CYCLE_MS = 11000;
const HOLD_MS = 7000;

/**
 * Прогресс самолётика 0–1 в трёх режимах:
 * pin — секция закреплена, прогресс идёт за прокруткой (scrub 0,5);
 * auto — автоплей 11 с по кругу, пока секция видна;
 * static — reduced motion: всё сразу на месте, шаги переключают мгновенно.
 */
export function useHowProgress(
  mode: HowMode,
  pinRef: RefObject<HTMLElement | null>,
  apply: (p: number) => void,
) {
  const trigger = useRef<ScrollTrigger | null>(null);
  const auto = useRef({ t0: 0, holdUntil: 0 });

  // Закрепление при прокрутке
  useLayoutEffect(() => {
    const el = pinRef.current;
    if (mode !== 'pin' || !el) return;
    const state = { p: 0 };
    apply(0);
    const ctx = gsap.context(() => {
      const tween = gsap.to(state, {
        p: 1,
        ease: 'none',
        onUpdate: () => apply(state.p),
        scrollTrigger: {
          trigger: el,
          start: 'center center',
          end: '+=1400',
          pin: true,
          scrub: 0.5,
        },
      });
      trigger.current = tween.scrollTrigger ?? null;
    });
    return () => {
      trigger.current = null;
      ctx.revert();
    };
  }, [mode, pinRef, apply]);

  // Автоплей, только когда секция на экране
  useEffect(() => {
    const el = pinRef.current;
    if (mode !== 'auto' || !el || typeof IntersectionObserver === 'undefined') return;
    let raf = 0;
    const frame = (now: number) => {
      const a = auto.current;
      if (now >= a.holdUntil) {
        if (!a.t0) a.t0 = now;
        // Цикл чуть длиннее полёта: самолётик ненадолго замирает в конце
        apply(Math.min(1, ((now - a.t0) / CYCLE_MS) % 1.15));
      }
      raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting && !document.hidden) raf = requestAnimationFrame(frame);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [mode, pinRef, apply]);

  useEffect(() => {
    if (mode === 'static') apply(1);
  }, [mode, apply]);

  /** Клик по шагу: перейти к остановке */
  return useCallback(
    (i: number) => {
      const p = STOPS[i].p;
      if (mode === 'pin' && trigger.current) {
        const st = trigger.current;
        scrollToY(st.start + p * (st.end - st.start));
        return;
      }
      apply(p);
      if (mode === 'auto') {
        const now = performance.now();
        auto.current = { t0: now + HOLD_MS - p * CYCLE_MS, holdUntil: now + HOLD_MS };
      }
    },
    [mode, apply],
  );
}
