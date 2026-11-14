import { useState, type CSSProperties } from 'react';
import { plural } from '@/lib/plural';
import { useUserStore } from '@/store/user';
import { Barcode, PassCard } from './PassCard';
import { passDataOf } from './passData';
import styles from './Wallet.module.css';

/** Кошелёк: корешки талонов; на телефоне — стопка из трёх последних, нажатие достаёт талон */
export function Wallet({ nowMin }: { nowMin: number }) {
  const passes = useUserStore((s) => s.booking.passes);
  const name = useUserStore((s) => s.profile.name);
  const [open, setOpen] = useState<string | null>(null);
  const items = passes
    .slice(-3)
    .reverse()
    .map((p) => ({ p, data: passDataOf(p, name, nowMin) }))
    .filter((x) => x.data);
  const count = passes.length;

  return (
    <section className={styles.wallet} aria-labelledby="wallet-title">
      <div className={styles.head}>
        <h2 id="wallet-title" className={styles.title}>
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24">
            <rect x="3" y="6" width="18" height="13" rx="3" />
            <path d="M3 10h18M16 14h2" />
          </svg>
          Кошелёк
        </h2>
        <span className={styles.count} aria-live="polite">
          {count} {plural(count, ['талон', 'талона', 'талонов'])}
        </span>
      </div>

      <div className={styles.pocket}>
        {items.length ? (
          <ul className={styles.stubs}>
            {items.map(({ p, data }, i) => (
              <li key={p.id} className={i === 0 ? styles.fresh : undefined}>
                <Barcode className={styles.code} />
                <b>
                  {data!.no} · {data!.seat}
                </b>
                <span>MOW → {data!.iata}</span>
              </li>
            ))}
          </ul>
        ) : (
          <span className={styles.empty}>Здесь появится корешок талона</span>
        )}
      </div>

      {items.length > 0 && (
        <div className={styles.stack} style={{ '--n': items.length } as CSSProperties}>
          {items.map(({ p, data }, i) => {
            const on = open === p.id;
            return (
              <button
                key={p.id}
                type="button"
                className={styles.card}
                data-open={on || undefined}
                data-dim={(open && !on) || undefined}
                style={{ '--i': i } as CSSProperties}
                aria-expanded={on}
                aria-label={`Талон ${data!.no} в ${data!.iata}, место ${data!.seat}`}
                onClick={() => setOpen(on ? null : p.id)}
              >
                <PassCard data={data!} />
                <span aria-hidden="true" className={styles.holo} />
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
