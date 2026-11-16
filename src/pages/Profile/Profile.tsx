import { useEffect, useState } from 'react';
import { Globe } from '@/components/globe/Globe';
import { Achievements } from '@/components/profile/Achievements';
import { NextTrip } from '@/components/profile/NextTrip';
import { TripsList } from '@/components/profile/TripsList';
import { Passport, type StampEntry } from '@/components/profile/Passport';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { Aurora } from '@/components/ui/Aurora';
import { getCities, getCity } from '@/lib/cities';
import { addDays, daysUntil } from '@/lib/trip';
import { achievementsOf, countriesOf, kmInSky, levelOf, stampCities } from '@/lib/profile';
import { usePageTitle } from '@/lib/usePageTitle';
import { useUserStore } from '@/store/user';
import styles from './Profile.module.css';

const CITIES = getCities();
const DESTINATIONS = CITIES.map((c) => c.coords);
const DATE = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
});
const fmt = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export default function Profile() {
  usePageTitle('Профиль');
  const name = useUserStore((s) => s.profile.name);
  const stamps = useUserStore((s) => s.passport.stamps);
  const unlocked = useUserStore((s) => s.passport.achievements);
  const passes = useUserStore((s) => s.booking.passes);
  const trips = useUserStore((s) => s.journal.trips);
  const unlock = useUserStore((s) => s.unlockAchievement);
  const plans = useUserStore((s) => s.plans);
  const [now] = useState(() => Date.now());
  // Ближайшая — активная сохранённая, если она ещё не закончилась
  const next = plans.list.find(
    (p) => p.id === plans.activeId && p.saved && daysUntil(addDays(p.dateFrom, p.nights), now) >= 0,
  );
  const nextCity = next && getCity(next.cityId);

  const state = { stamps, passes, trips };
  const level = levelOf(state);
  const achievements = achievementsOf(state);
  const countries = countriesOf(stamps).length;
  const photos = trips.reduce((s, t) => s + t.photoIds.length, 0);

  // Полученные достижения записываем в store (паспорт помнит их и после сброса условий)
  const newly = achievements.filter((a) => a.got && !unlocked.includes(a.id)).map((a) => a.id);
  const newlyKey = newly.join('|');
  useEffect(() => {
    if (newlyKey) newlyKey.split('|').forEach(unlock);
  }, [newlyKey, unlock]);

  const entries: StampEntry[] = stampCities(stamps).map((city) => {
    const pass = passes.find((p) => p.cityId === city.id);
    return { city, date: pass ? DATE.format(new Date(pass.issuedAt)) : '' };
  });
  const highlight = stamps.map((id) => CITIES.findIndex((c) => c.id === id)).filter((i) => i >= 0);
  const stats: [string, number][] = [
    ['Поездки', trips.length],
    ['Страны', countries],
    ['Км в небе', kmInSky(passes)],
    ['Фото в дневнике', photos],
  ];

  return (
    <div className={styles.page}>
      <Aurora grain={false} />
      <div className={`container ${styles.content}`}>
        <ProfileHeader
          level={level.level}
          progress={level.progress}
          toNext={level.toNext}
          stamps={stamps.length}
        />
        {next && nextCity && <NextTrip plan={next} city={nextCity} now={now} />}
        <TripsList plans={plans.list} now={now} />
        <Passport stamps={entries} name={name} countries={countries} />

        <div className={styles.world}>
          <section className={styles.globeCard} aria-labelledby="globe-title">
            <div className={styles.globeHead}>
              <h2 id="globe-title">Мир по&nbsp;штампам</h2>
              <span>потяните глобус</span>
            </div>
            <Globe
              destinations={DESTINATIONS}
              highlight={highlight}
              className={styles.globe}
              label={
                stamps.length
                  ? `Глобус: подсвечены ${stampCities(stamps)
                      .map((c) => c.name)
                      .join(', ')}`
                  : 'Глобус: штампов пока нет'
              }
            />
          </section>
          <dl className={styles.stats}>
            {stats.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{fmt(v)}</dd>
              </div>
            ))}
          </dl>
        </div>

        <Achievements list={achievements} />
      </div>
    </div>
  );
}
