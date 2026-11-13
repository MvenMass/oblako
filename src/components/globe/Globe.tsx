import { useEffect, useMemo, useRef, type PointerEvent } from 'react';
import { useReducedMotion } from '@/lib/motion';
import { createGlobe, drawGlobe, type GeoPoint, type GlobeView } from './globeEngine';
import styles from './Globe.module.css';

interface GlobeProps {
  destinations: GeoPoint[];
  /** Индексы направлений для подсветки (штампы в профиле) */
  highlight?: number[];
  label: string;
  className?: string;
}

const AUTO_SPEED = 0.16; // рад/с ≈ 0,0025 рад/кадр при 60 fps
const DRAG_SPEED = 0.008;
const MAX_DPR = 2;

/** Точечный глобус на Canvas 2D: автовращение, перетаскивание, пауза вне экрана */
export function Globe({ destinations, highlight, label, className }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const model = useMemo(() => createGlobe(destinations, { highlight }), [destinations, highlight]);
  const view = useRef<GlobeView>({ rot: -0.62, tilt: 0.42, time: 0, reduced });
  const drag = useRef<{ x: number } | null>(null);
  const redraw = useRef<() => void>(() => undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    view.current.reduced = reduced;

    let size = 0;
    const resize = () => {
      const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
      size = Math.round(canvas.clientWidth * dpr);
      if (canvas.width !== size || canvas.height !== size) {
        canvas.width = size;
        canvas.height = size;
      }
    };
    const draw = () => {
      if (size) drawGlobe(ctx, model, view.current, size);
    };
    redraw.current = draw;

    let raf = 0;
    let last = 0;
    let visible = true;
    const frame = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      view.current.time += dt;
      if (!drag.current) view.current.rot += dt * AUTO_SPEED;
      draw();
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (reduced || raf || !visible || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    draw();
    start();

    const ro =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => {
            resize();
            draw();
          });
    ro?.observe(canvas);

    const io =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) start();
            else stop();
          });
    io?.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      ro?.disconnect();
      io?.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [model, reduced]);

  const onPointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    drag.current = { x: e.clientX };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!drag.current) return;
    view.current.rot += (e.clientX - drag.current.x) * DRAG_SPEED;
    drag.current.x = e.clientX;
    if (reduced) redraw.current();
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={label}
      className={[styles.globe, className].filter(Boolean).join(' ')}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    />
  );
}
