import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/motion';
import styles from './FlapText.module.css';

const ABC = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЭЮЯ0123456789';
const STEPS = 12;

interface FlapTextProps {
  text: string;
  /** Ширина в знаках — короткие слова дополняются пустыми флапами */
  size?: number;
  small?: boolean;
  /** Вызывается на каждом щелчке перебора (для звука) */
  onTick?: () => void;
}

/** Перекидные буквы: при смене текста по ячейкам пробегают случайные символы */
export function FlapText({ text, size = text.length, small, onTick }: FlapTextProps) {
  const reduced = useReducedMotion();
  const target = text.padEnd(size, ' ').slice(0, Math.max(size, text.length));
  // Шаг перебора привязан к тексту: новый текст сразу начинается с шага 0, без мигания
  const [anim, setAnim] = useState({ text: target, step: STEPS + 1 });
  const step = anim.text === target || reduced ? anim.step : 0;
  const last = useRef(target);
  const tick = useRef(onTick);
  useEffect(() => {
    tick.current = onTick;
  });

  // Новый текст — перебор слева направо; без анимации буквы просто меняются
  useEffect(() => {
    if (reduced || last.current === target) return;
    last.current = target;
    let k = 0;
    const id = setInterval(() => {
      k += 1;
      setAnim({ text: target, step: k });
      tick.current?.();
      if (k > STEPS) clearInterval(id);
    }, 70);
    return () => clearInterval(id);
  }, [target, reduced]);

  const spinning = !reduced && step <= STEPS;
  const cells = target.split('').map((ch, i) => {
    const scramble = spinning && i >= step && ch !== ' ';
    return {
      ch: scramble ? ABC[(i * 7 + step * 13) % ABC.length] : ch,
      cls: spinning && i >= step - 1 ? (step % 2 ? styles.flipA : styles.flipB) : '',
    };
  });

  return (
    <span className={`${styles.row} ${small ? styles.small : ''}`}>
      <span className="visually-hidden">{text}</span>
      {cells.map((c, i) => (
        <span key={i} aria-hidden="true" className={`${styles.flap} ${c.cls}`}>
          {c.ch}
        </span>
      ))}
    </span>
  );
}
