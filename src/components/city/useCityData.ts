import { getRate, rateCaption, type Rate } from '@/lib/api/rates';
import { getCurrentWeather } from '@/lib/api/weather';
import { useAsync } from '@/lib/useAsync';
import type { City } from '@/types/city';

/** Живой курс валюты города (ЦБ → сохранённый → демо). Для рубля — null. */
export function useCityRate(city: City) {
  const state = useAsync(
    (signal) => {
      void signal;
      return getRate(city.facts.currency);
    },
    [city.id],
  );
  const rate: Rate | null = state.status === 'ready' ? state.data : null;
  return {
    loading: state.status === 'loading',
    rate,
    /** Рублей за 1 единицу: живой курс или демо, пока он не пришёл */
    rub: rate?.rub ?? city.facts.currency.demoRateRub,
    caption: rate ? rateCaption(rate) : 'демо-курс',
    isRub: city.facts.currency.rateCode === 'RUB',
  };
}

export function useCityWeather(city: City) {
  return useAsync((signal) => getCurrentWeather(city.coords, signal), [city.id]);
}

/** «2,4» — курс с запятой */
export function formatRate(rub: number): string {
  const digits = rub >= 10 ? 1 : rub >= 1 ? 2 : 4;
  return rub.toFixed(digits).replace('.', ',');
}

/** «1 GEL = 31,7 ₽» или для дешёвых валют «1000 VND = 3,2 ₽» */
export function rateText(code: string, rub: number): string {
  const per = rub < 0.1 ? 1000 : 1;
  return `${per} ${code} = ${formatRate(rub * per)} ₽`;
}
