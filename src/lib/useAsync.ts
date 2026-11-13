import { useEffect, useState, type DependencyList } from 'react';

export type AsyncState<T> =
  | { status: 'loading'; data: null }
  | { status: 'ready'; data: T }
  | { status: 'empty'; data: null };

const LOADING = { status: 'loading', data: null } as const;

function sameDeps(a: DependencyList, b: DependencyList): boolean {
  return a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
}

/**
 * Загрузка данных с отменой при размонтировании и смене зависимостей.
 * null из load → статус 'empty' (тихая ошибка: интерфейс показывает «—»).
 */
export function useAsync<T>(
  load: (signal: AbortSignal) => Promise<T | null>,
  deps: DependencyList,
): AsyncState<T> {
  const [result, setResult] = useState<{ deps: DependencyList; state: AsyncState<T> } | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    const settle = (state: AsyncState<T>) => {
      if (!ctrl.signal.aborted) setResult({ deps, state });
    };
    load(ctrl.signal).then(
      (data) => settle(data == null ? { status: 'empty', data: null } : { status: 'ready', data }),
      () => settle({ status: 'empty', data: null }),
    );
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  // Пока ответ относится к старым зависимостям — показываем загрузку
  return result && sameDeps(result.deps, deps) ? result.state : LOADING;
}
