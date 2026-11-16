import { useState } from 'react';
import { MemoryBanner } from '@/components/journal/MemoryBanner';
import { PhotoRoute } from '@/components/journal/PhotoRoute';
import { PhotoTable, type TableItem } from '@/components/journal/PhotoTable';
import { TripForm } from '@/components/journal/TripForm';
import { usePhotoUrls } from '@/components/journal/usePhotoUrls';
import { Aurora } from '@/components/ui/Aurora';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { StoryViewer, type StorySlide } from '@/components/ui/StoryViewer';
import { getCity } from '@/lib/cities';
import {
  DEMO_TRIP_ID,
  formatTripDate,
  journalTrips,
  memoryOf,
  tripPhotos,
  type TripPhoto,
} from '@/lib/journal';
import { useReducedMotion } from '@/lib/motion';
import { deletePhoto } from '@/lib/photos';
import { usePageTitle } from '@/lib/usePageTitle';
import { useUserStore } from '@/store/user';
import type { Trip } from '@/types/user';
import styles from './Journal.module.css';

const label = (t: Trip) => `${t.title} · ${formatTripDate(t.date)}`;

export default function Journal() {
  usePageTitle('Дневник');
  const reduced = useReducedMotion();
  const stored = useUserStore((s) => s.journal.trips);
  const removeTrip = useUserStore((s) => s.removeTrip);
  const [now] = useState(() => Date.now());
  const [filter, setFilter] = useState<string>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [story, setStory] = useState<{ title: string; list: TripPhoto[]; start: number } | null>(
    null,
  );

  const trips = journalTrips(stored, now);
  const memory = memoryOf(trips, now)?.trip ?? trips[trips.length - 1];
  const shown = trips.filter((t) => filter === 'all' || t.id === filter);
  const items = shown.flatMap((t) => tripPhotos(t).map((photo) => ({ photo, trip: t })));
  const mapTrip = shown.length === 1 ? shown[0] : memory;
  const mapPhotos = tripPhotos(mapTrip);
  const urls = usePhotoUrls([...items.map((i) => i.photo), ...tripPhotos(memory), ...mapPhotos]);
  const mapCity = getCity(mapTrip.cityId)!;

  const slides = (list: TripPhoto[]): StorySlide[] =>
    list.filter((p) => urls[p.id]).map((p) => ({ src: urls[p.id], text: p.place.name }));
  const table: TableItem[] = items.map((i) => ({
    photo: i.photo,
    src: urls[i.photo.id],
    trip: i.trip.title,
  }));

  const remove = (t: Trip) => {
    t.photoIds.forEach((id) => void deletePhoto(id));
    removeTrip(t.id);
    setFilter('all');
  };

  return (
    <div className={styles.page}>
      <Aurora grain={false} />
      <div className={`container ${styles.content}`}>
        <MemoryBanner
          trip={memory}
          srcs={tripPhotos(memory)
            .map((p) => urls[p.id])
            .filter(Boolean)}
          onPlay={() => setStory({ title: label(memory), list: tripPhotos(memory), start: 0 })}
        />

        <section className={styles.section} aria-labelledby="photos-title">
          <div className={styles.head}>
            <h2 id="photos-title" className={styles.h2}>
              Фото и&nbsp;<span className="grad">воспоминания</span>
            </h2>
            <div role="group" aria-label="Фильтр поездок" className={styles.chips}>
              {[
                { id: 'all', text: 'Все' },
                ...trips.map((t) => ({ id: t.id, text: label(t) })),
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={filter === f.id}
                  className={styles.chip}
                  onClick={() => setFilter(f.id)}
                >
                  {f.text}
                  {f.id === DEMO_TRIP_ID && ' · демо'}
                </button>
              ))}
            </div>
          </div>
          <p className={styles.hint}>
            Фото можно двигать по&nbsp;столу. Нажмите на&nbsp;снимок, чтобы открыть сторис.
          </p>
          <PhotoTable
            items={table}
            onOpen={(i) =>
              setStory({ title: label(items[i].trip), list: items.map((x) => x.photo), start: i })
            }
          />
        </section>

        {stored.length === 0 && (
          <EmptyState
            title="Добавьте первые фото"
            text="Пока здесь только демо-поездка в Тбилиси. Свои снимки остаются в этом браузере."
            action={
              <Button
                iconStart="plus"
                onClick={() => {
                  setFormOpen(true);
                  requestAnimationFrame(() => document.getElementById('trip-city')?.focus());
                }}
              >
                Добавить поездку
              </Button>
            }
          />
        )}
        <TripForm open={formOpen} onOpenChange={setFormOpen} onAdded={setFilter} />

        <section className={styles.route} aria-labelledby="route-title">
          <div className={styles.routeText}>
            <h2 id="route-title" className={styles.h2}>
              Маршрут <span className="grad">по&nbsp;фото</span>
            </h2>
            <p className={styles.hint}>
              Точки по&nbsp;порядку съёмки. Для своих фото места города берутся по&nbsp;очереди —
              это схема.
            </p>
            <b>
              {label(mapTrip)} · {mapPhotos.length}&nbsp;фото
            </b>
            {mapTrip.id !== DEMO_TRIP_ID && (
              <Button variant="ghost" size="sm" onClick={() => remove(mapTrip)}>
                Удалить поездку
              </Button>
            )}
          </div>
          <div className={styles.map}>
            <PhotoRoute city={mapCity} photos={mapPhotos} urls={urls} />
          </div>
        </section>
      </div>

      {story && slides(story.list).length > 0 && (
        <StoryViewer
          title={story.title}
          slides={slides(story.list)}
          start={Math.min(story.start, slides(story.list).length - 1)}
          reduced={reduced}
          onClose={() => setStory(null)}
        />
      )}
    </div>
  );
}
