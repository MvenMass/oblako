import { useEffect, type RefObject } from 'react';

/** Точки сферы Фибоначчи для n тегов */
export function spherePoints(n: number): [number, number, number][] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - ((i + 0.5) / n) * 2;
    const r = Math.sqrt(1 - y * y);
    return [Math.cos(golden * i) * r, y, Math.sin(golden * i) * r];
  });
}

const FRAME_MS = 1000 / 30;

/**
 * Вращает теги по сфере: ay += dt·(0,28 + mouseX·1,2), наклон ax тянется к mouseY·0,8 − 0,25.
 * Пишет transform/opacity/z-index прямо в DOM, не чаще 30 раз в секунду и только на экране.
 */
export function useSphere(
  root: RefObject<HTMLElement | null>,
  count: number,
  radius: number,
  animate: boolean,
  /** Без анимации — перерисовать при смене выбора */
  version = 0,
) {
  const redrawKey = animate ? 0 : version;
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const tags = Array.from(el.querySelectorAll<HTMLElement>('[data-tag]'));
    const pts = spherePoints(count);
    const s = { ay: 0, ax: -0.25, tx: 0, ty: 0, last: 0, drawn: 0 };

    const place = () => {
      const ca = Math.cos(s.ay);
      const sa = Math.sin(s.ay);
      const cx = Math.cos(s.ax);
      const sx = Math.sin(s.ax);
      tags.forEach((tag, i) => {
        const [px, py, pz] = pts[i];
        const x1 = px * ca + pz * sa;
        const z1 = -px * sa + pz * ca;
        const y = py * cx - z1 * sx;
        const z = py * sx + z1 * cx;
        const d = (z + 1) / 2;
        const selected = tag.getAttribute('aria-pressed') === 'true';
        tag.style.transform = `translate(-50%, -50%) translate(${(x1 * radius).toFixed(1)}px, ${(y * radius).toFixed(1)}px) scale(${(0.6 + d * 0.75).toFixed(3)})`;
        tag.style.opacity = selected ? '1' : (0.28 + d * 0.72).toFixed(2);
        tag.style.zIndex = String(Math.round(d * 100) + (selected ? 100 : 0));
      });
    };

    place();
    if (!animate) return;

    let raf = 0;
    const frame = (now: number) => {
      const dt = s.last ? Math.min(0.05, (now - s.last) / 1000) : 0;
      s.last = now;
      s.ay += dt * (0.28 + s.tx * 1.2);
      s.ax += (s.ty * 0.8 - 0.25 - s.ax) * Math.min(1, dt * 2);
      if (now - s.drawn >= FRAME_MS) {
        s.drawn = now;
        place();
      }
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf && !document.hidden) {
        s.last = 0;
        raf = requestAnimationFrame(frame);
      }
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      s.tx = (e.clientX - r.left) / r.width - 0.5;
      s.ty = (e.clientY - r.top) / r.height - 0.5;
    };
    const onLeave = () => {
      s.tx = 0;
      s.ty = 0;
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);

    let visible = true;
    const io =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) start();
            else stop();
          });
    io?.observe(el);
    const onVisibility = () => (document.hidden || !visible ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);
    start();

    return () => {
      stop();
      io?.disconnect();
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [root, count, radius, animate, redrawKey]);
}
