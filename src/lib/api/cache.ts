interface Entry<T> {
  savedAt: number;
  value: T;
}

const PREFIX = 'oblako:cache:';

/** Хранилище может быть недоступно (приватный режим Safari) — тогда кэша просто нет */
function safe<T>(fn: () => T, fallback: T): T {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

export function readCache<T>(storage: Storage, key: string, maxAgeMs = Infinity): T | null {
  return safe(() => {
    const raw = storage.getItem(PREFIX + key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as Entry<T>;
    return Date.now() - entry.savedAt <= maxAgeMs ? entry.value : null;
  }, null);
}

export function writeCache<T>(storage: Storage, key: string, value: T): void {
  safe(
    () => storage.setItem(PREFIX + key, JSON.stringify({ savedAt: Date.now(), value })),
    undefined,
  );
}

/** fetch с таймаутом; бросает на не-2xx */
export async function fetchJson<T>(
  url: string,
  signal?: AbortSignal,
  timeoutMs = 8000,
): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  const onAbort = () => ctrl.abort();
  signal?.addEventListener('abort', onAbort);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onAbort);
  }
}
