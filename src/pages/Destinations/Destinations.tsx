import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FolderCarousel } from '@/components/destinations/FolderCarousel';
import { FILTERS, applyFilter } from '@/components/destinations/filters';
import { Aurora } from '@/components/ui/Aurora';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { SectionHead } from '@/components/ui/SectionHead';
import { citiesIndex, getCities } from '@/lib/cities';
import { usePageTitle } from '@/lib/usePageTitle';
import styles from './Destinations.module.css';

const ALL = getCities();
const BLOBS = [
  { top: 200, left: 'calc(50% - 450px)', size: 900, color: 'var(--sky-light)' },
  { top: 460, left: 'calc(50% - 380px)', size: 420, color: 'var(--aurora-2)', delay: -8 },
  { top: 420, left: 'calc(50% + 60px)', size: 420, color: 'var(--aurora-3)', delay: -14 },
];

export default function Destinations() {
  usePageTitle('Направления');
  const [params, setParams] = useSearchParams();
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const cities = useMemo(() => applyFilter(ALL, filter), [filter]);

  // Активная папка живёт в адресе (?city=), чтобы «назад» со страницы города вернул к ней
  const fromUrl = cities.findIndex((c) => c.id === params.get('city'));
  const active = fromUrl > -1 ? fromUrl : 0;
  const current = cities[active];

  const select = (i: number) => {
    setOpen(false);
    setParams({ city: cities[i].id }, { replace: true });
  };
  const step = (d: number) => cities.length && select((active + d + cities.length) % cities.length);
  const pickFilter = (id: string) => {
    setFilter(id);
    setOpen(false);
    const first = applyFilter(ALL, id)[0];
    if (first) setParams({ city: first.id }, { replace: true });
  };

  return (
    <div className={styles.page}>
      <Aurora blobs={BLOBS} grain={false} />
      <section className={`container ${styles.content}`} aria-labelledby="dest-title">
        <SectionHead
          id="dest-title"
          level={1}
          eyebrow="Направления"
          title={
            <>
              Куда <span className="grad">отправимся?</span>
            </>
          }
          action={
            <>
              <Button
                variant="glass"
                iconOnly
                aria-label="Предыдущее направление"
                onClick={() => step(-1)}
              >
                <Icon name="chevron-left" />
              </Button>
              <Button
                variant="dark"
                iconOnly
                aria-label="Следующее направление"
                onClick={() => step(1)}
              >
                <Icon name="chevron-right" />
              </Button>
            </>
          }
        />

        <div className={styles.filters} role="group" aria-label="Фильтр направлений">
          {FILTERS.map((f) => (
            <Chip key={f.id} size="lg" selected={filter === f.id} onToggle={() => pickFilter(f.id)}>
              {f.label}
            </Chip>
          ))}
        </div>

        <p className={styles.status} aria-live="polite">
          {current
            ? `${current.name}, ${current.country} — ${active + 1} из ${cities.length}`
            : 'Нет направлений под этот фильтр'}
        </p>

        <FolderCarousel
          cities={cities}
          active={active}
          open={open}
          hits={citiesIndex.hits}
          onActive={select}
          onToggle={() => setOpen((v) => !v)}
        />

        <p className={styles.hint}>
          Клик по&nbsp;папке выводит её вперёд, повторный клик открывает досье города. Цены
          и&nbsp;визы&nbsp;— демо.
        </p>
      </section>
    </div>
  );
}
