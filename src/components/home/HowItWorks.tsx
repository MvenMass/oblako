import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { SectionHead } from '@/components/ui/SectionHead';
import { HOW_STEPS } from '@/data/home';
import { useMediaQuery, useReducedMotion } from '@/lib/motion';
import { typograph } from '@/lib/typograph';
import { TripFacts } from './TripFacts';
import { HowScene } from './HowScene';
import { STOPS } from './howPath';
import { useHowProgress, type HowMode } from './useHowProgress';
import styles from './HowItWorks.module.css';

const SCENE_W = 700;
const SCENE_H = 500;

/** «Как работает OBLAKO»: шаги, сцена с самолётиком и приборы */
export function HowItWorks() {
  const reduced = useReducedMotion();
  const roomy = useMediaQuery('(min-width: 1024px) and (min-height: 720px)');
  const mode: HowMode = reduced ? 'static' : roomy ? 'pin' : 'auto';

  const pinRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(-1);
  const [scale, setScale] = useState(1);

  const apply = useCallback((p: number) => {
    const path = pathRef.current;
    const plane = planeRef.current;
    if (path && plane && typeof path.getTotalLength === 'function') {
      const len = path.getTotalLength();
      const a = path.getPointAtLength(p * len);
      const b = path.getPointAtLength(Math.min(len, p * len + 2));
      const angle = p >= 1 ? -30 : (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
      plane.style.transform = `translate(${a.x - 20}px, ${a.y - 20}px) rotate(${angle}deg)`;
    }
    if (trailRef.current) trailRef.current.style.strokeDashoffset = String(100 - p * 100);
    setActive(STOPS.reduce((n, s, i) => (p >= s.p - 0.01 ? i : n), -1));
  }, []);

  const goTo = useHowProgress(mode, pinRef, apply);

  // Сцена 700×500 масштабируется под ширину колонки
  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const fit = (width: number) => setScale(Math.min(1, width / SCENE_W));
    fit(box.clientWidth || SCENE_W);
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([entry]) => fit(entry.contentRect.width));
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  const current = Math.max(0, active);

  return (
    <section id="how" className={styles.section} aria-labelledby="how-title">
      <div className="container">
        {/* Закрепляется весь блок с заголовком: пока самолётик летит, заголовок остаётся на месте */}
        <div ref={pinRef} className={styles.pinBox}>
          <SectionHead
            id="how-title"
            eyebrow={<>О&nbsp;проекте</>}
            title={
              <>
                Как работает <span className="grad">OBLAKO</span>
              </>
            }
            lead={typograph(
              'Четыре шага от «куда бы поехать?» до штампа в паспорте. Самолётик пролетает маршрут — на каждой остановке оживает настоящий инструмент.',
            )}
          />

          <div className={styles.body}>
            <ol className={styles.steps}>
              {HOW_STEPS.map((step, i) => (
                <li key={step.title}>
                  <button
                    type="button"
                    className={[
                      styles.step,
                      i === current && styles.current,
                      i <= active && styles.done,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    aria-current={i === current ? 'step' : undefined}
                    onClick={() => goTo(i)}
                  >
                    <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
                    <span className={styles.stepText}>
                      <span className={styles.stepTitle}>{step.title}</span>
                      <span className={styles.stepDesc}>{typograph(step.text)}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>

            <div ref={boxRef} className={styles.sceneBox} style={{ height: SCENE_H * scale }}>
              <div className={styles.scene} style={{ transform: `scale(${scale})` }}>
                <HowScene
                  active={active}
                  pathRef={pathRef}
                  trailRef={trailRef}
                  planeRef={planeRef}
                />
              </div>
            </div>
          </div>
        </div>

        <TripFacts />
      </div>
    </section>
  );
}
