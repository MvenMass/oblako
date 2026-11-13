/** Время суток сцены: 0 — день, 1 — закат, 2 — ночь */
export type Tod = 0 | 1 | 2;

/** Местное время города по смещению UTC */
export function localDate(utc: number, now = Date.now()): Date {
  return new Date(now + utc * 3600000);
}

export function formatClock(utc: number, now = Date.now(), seconds = false): string {
  const d = localDate(utc, now);
  const pad = (n: number) => String(n).padStart(2, '0');
  const hm = `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
  return seconds ? `${hm}:${pad(d.getUTCSeconds())}` : hm;
}

/** Время суток по местному часу: 7–17 день, 17–20 закат, иначе ночь */
export function todByHour(hour: number): Tod {
  if (hour >= 7 && hour < 17) return 0;
  if (hour >= 17 && hour < 20) return 1;
  return 2;
}

export function todNow(utc: number, now = Date.now()): Tod {
  return todByHour(localDate(utc, now).getUTCHours());
}

export function utcLabel(utc: number): string {
  return `UTC${utc >= 0 ? '+' : '−'}${Math.abs(utc)}`;
}
