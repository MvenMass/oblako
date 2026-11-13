import styles from './Footer.module.css';

/** Детерминированные «случайные» звёзды: одинаковые при каждом рендере */
function makeStars(count: number) {
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  return Array.from({ length: count }, () => ({
    cx: Math.round(rnd() * 1440),
    cy: Math.round(280 + rnd() * 600),
    r: [0.8, 1, 1.4][Math.floor(rnd() * 3)],
    delay: -(rnd() * 3).toFixed(1),
  }));
}

const STARS = makeStars(70);

export function FooterSky() {
  return (
    <svg
      aria-hidden="true"
      className={styles.sky}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
    >
      {STARS.map((s, i) => (
        <circle
          key={i}
          className={styles.star}
          cx={s.cx}
          cy={s.cy}
          r={s.r}
          style={{ animationDelay: `${s.delay}s` }}
        />
      ))}
    </svg>
  );
}
