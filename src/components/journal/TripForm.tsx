import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { getCities, getCity } from '@/lib/cities';
import { newTripId } from '@/lib/journal';
import { savePhoto } from '@/lib/photos';
import { useUserStore } from '@/store/user';
import styles from './TripForm.module.css';

const today = () => new Date().toISOString().slice(0, 10);

/** Новая поездка: город, дата, фото (в IndexedDB) и попробованные блюда */
export function TripForm({ onAdded }: { onAdded: (id: string) => void }) {
  const addTrip = useUserStore((s) => s.addTrip);
  const [cityId, setCityId] = useState('istanbul');
  const [date, setDate] = useState(today);
  const [files, setFiles] = useState<File[]>([]);
  const [dishes, setDishes] = useState<string[]>([]);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const city = getCity(cityId)!;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!files.length || busy) return;
    setBusy(true);
    const id = newTripId();
    // Порядок съёмки — по времени изменения файла
    const sorted = [...files].sort((a, b) => a.lastModified - b.lastModified);
    const photoIds = sorted.map((_, i) => `${id}-${i}`);
    const saved = await Promise.all(sorted.map((f, i) => savePhoto(photoIds[i], f)));
    addTrip({ id, cityId, title: `${city.name}`, date, photoIds, dishes });
    setStatus(
      saved.every(Boolean)
        ? `Поездка добавлена: ${photoIds.length} фото сохранены в браузере`
        : 'Поездка добавлена, но браузер не дал сохранить фото',
    );
    setFiles([]);
    setDishes([]);
    setBusy(false);
    onAdded(id);
  };

  return (
    <details className={styles.box}>
      <summary>Добавить поездку</summary>
      <form className={styles.form} onSubmit={submit}>
        <div className={styles.row}>
          <label className={styles.field}>
            <span>Город</span>
            <select
              value={cityId}
              onChange={(e) => {
                setCityId(e.target.value);
                setDishes([]);
              }}
            >
              {getCities().map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.field}>
            <span>Дата</span>
            <input
              type="date"
              value={date}
              max={today()}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label className={styles.field}>
            <span>Фото</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            />
          </label>
        </div>
        <fieldset className={styles.dishes}>
          <legend>Что попробовали</legend>
          {city.dishes.map((d) => (
            <label key={d.name}>
              <input
                type="checkbox"
                checked={dishes.includes(d.name)}
                onChange={(e) =>
                  setDishes((list) =>
                    e.target.checked ? [...list, d.name] : list.filter((x) => x !== d.name),
                  )
                }
              />
              {d.name}
            </label>
          ))}
        </fieldset>
        <div className={styles.submit}>
          <Button type="submit" iconStart="plus" disabled={!files.length || busy}>
            Сохранить поездку
          </Button>
          <span>Фото остаются только в&nbsp;этом браузере (IndexedDB)</span>
        </div>
        <p className="visually-hidden" aria-live="polite">
          {status}
        </p>
      </form>
    </details>
  );
}
