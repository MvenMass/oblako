import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { passData } from '@/components/booking/passData';
import { PrintTerminal, type PrintPhase } from '@/components/booking/PrintTerminal';
import { SeatMap } from '@/components/booking/SeatMap';
import { Stepper } from '@/components/booking/Stepper';
import { Wallet } from '@/components/booking/Wallet';
import { WindowView } from '@/components/booking/WindowView';
import { Aurora } from '@/components/ui/Aurora';
import { isValidSeat, seatInfo, seatNote, seatPrice } from '@/lib/booking';
import { formatRub, getCity } from '@/lib/cities';
import { moscowMinutes } from '@/lib/flights';
import { usePageTitle } from '@/lib/usePageTitle';
import { useUserStore } from '@/store/user';
import styles from './Booking.module.css';

/** Направление: ?city= → результат подбора → маршрут → Стамбул */
function useBookingCity() {
  const [params] = useSearchParams();
  const quizCity = useUserStore((s) => s.quiz.result);
  const routeCity = useUserStore((s) => s.route?.cityId);
  return (
    getCity(params.get('city') ?? undefined) ??
    getCity(quizCity ?? undefined) ??
    getCity(routeCity) ??
    getCity('istanbul')!
  );
}

export default function Booking() {
  const city = useBookingCity();
  usePageTitle(`Бронирование · ${city.name}`);
  const stored = useUserStore((s) => s.booking.seat);
  const shade = useUserStore((s) => s.booking.shade);
  const name = useUserStore((s) => s.profile.name);
  const setSeat = useUserStore((s) => s.setSeat);
  const setShade = useUserStore((s) => s.setShade);
  const completeBooking = useUserStore((s) => s.completeBooking);
  const [phase, setPhase] = useState<PrintPhase>('idle');
  const [preview, setPreview] = useState<string | null>(null);
  const [nowMin, setNowMin] = useState(() => moscowMinutes(Date.now()));

  useEffect(() => {
    const id = setInterval(() => setNowMin(moscowMinutes(Date.now())), 60000);
    return () => clearInterval(id);
  }, []);

  const seat = isValidSeat(stored) ? stored : null;
  const data = seat ? passData(city.id, seat, name, nowMin) : null;
  const info = seat ? seatInfo(seat) : null;
  const step = !seat ? 1 : phase === 'idle' ? 2 : phase === 'printed' ? 3 : 4;

  const pick = (id: string) => {
    setSeat(id);
    setPhase('idle');
  };
  const tear = () => {
    if (!seat) return;
    completeBooking({
      id: `pass-${Date.now().toString(36)}`,
      cityId: city.id,
      seat,
      issuedAt: new Date().toISOString(),
    });
    setPhase('torn');
  };

  return (
    <div className={styles.page}>
      <Aurora grain={false} />
      <section className={`container ${styles.content}`} aria-labelledby="booking-title">
        <div className={styles.head}>
          <p className={styles.eyebrow}>
            Бронирование · {data?.no ?? 'OB'} · Москва → {city.name} · демо
          </p>
          <h1 id="booking-title" className={styles.h1}>
            Выберите <span className="grad">место</span>
          </h1>
        </div>
        <Stepper current={step} />
        <SeatMap seat={seat} onPick={pick} onPreview={setPreview} />

        <div className={styles.grid}>
          <div className={styles.left}>
            <WindowView seat={preview ?? seat ?? '7A'} shade={shade} onShade={setShade} />
            <dl className={styles.summary}>
              <div>
                <dt>Место</dt>
                <dd className={styles.big}>{seat ?? '—'}</dd>
              </div>
              <div>
                <dt>Тип</dt>
                <dd>{info ? seatNote(info) : 'не выбрано'}</dd>
              </div>
              <div>
                <dt>Тариф</dt>
                <dd>Эконом</dd>
              </div>
              <div>
                <dt>Итого · демо</dt>
                <dd className={styles.big}>
                  {formatRub(info ? seatPrice(city.quiz.flightRub, info) : city.quiz.flightRub)}
                </dd>
              </div>
            </dl>
          </div>
          <aside className={styles.right} aria-label="Посадочный талон">
            <PrintTerminal
              data={data}
              phase={phase}
              onPay={() => setPhase('printed')}
              onTear={tear}
            />
            <Wallet nowMin={nowMin} />
            <p className={styles.note}>
              Демо-оплата: деньги не&nbsp;списываются. Наклоните талон курсором&nbsp;— на&nbsp;нём
              голограмма.
            </p>
          </aside>
        </div>
      </section>
    </div>
  );
}
