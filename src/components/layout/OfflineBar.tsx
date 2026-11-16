import { useEffect, useState } from 'react';
import styles from './OfflineBar.module.css';

const isOnline = () => (typeof navigator === 'undefined' ? true : navigator.onLine !== false);

/** «Нет сети»: тихая плашка сверху, данные берутся из кэша и демо (states.md) */
export function OfflineBar() {
  const [online, setOnline] = useState(isOnline);

  useEffect(() => {
    const update = () => setOnline(isOnline());
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  return (
    <div role="status" className={styles.wrap}>
      {!online && (
        <span className={styles.bar}>
          <span aria-hidden="true" className={styles.dot} />
          Нет сети: показываем сохранённые данные
        </span>
      )}
    </div>
  );
}
