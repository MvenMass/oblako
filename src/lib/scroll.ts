import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

/** Плавный скролл Lenis — только для мыши и без reduced motion. Связан с ScrollTrigger. */
export function useSmoothScroll(enabled: boolean): void {
  useEffect(() => {
    const finePointer =
      typeof window.matchMedia === 'function' && window.matchMedia('(pointer: fine)').matches;
    if (!enabled || !finePointer) return;

    const instance = new Lenis({ smoothWheel: true, syncTouch: false });
    lenis = instance;

    instance.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      lenis = null;
    };
  }, [enabled]);
}

export function scrollToTop(): void {
  if (lenis) lenis.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
}

/** Блокировка прокрутки под модалками */
export function lockScroll(locked: boolean): void {
  document.documentElement.style.overflow = locked ? 'hidden' : '';
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
}
