import { useEffect, type CSSProperties } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Advise } from '@/components/city/Advise';
import { CityHero } from '@/components/city/CityHero';
import { Dishes } from '@/components/city/Dishes';
import { Facts } from '@/components/city/Facts';
import { Gallery } from '@/components/city/Gallery';
import { Know } from '@/components/city/Know';
import { Phrasebook } from '@/components/city/Phrasebook';
import { Prices } from '@/components/city/Prices';
import { Plan, Seasons } from '@/components/city/SeasonsPlan';
import { renderSignature } from '@/components/city/signature';
import { getCity } from '@/lib/cities';
import { mix, readable, rgba } from '@/lib/color';
import { usePageTitle } from '@/lib/usePageTitle';
import type { City as CityData } from '@/types/city';
import NotFound from '../NotFound/NotFound';
import styles from './City.module.css';

/** Шрифт местной письменности (грузинский) — только на странице своего города */
function useCityFont(font: CityData['theme']['font']) {
  useEffect(() => {
    if (!font) return;
    const id = `font-${font.googleParam}`;
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${font.googleParam}&display=swap`;
    document.head.appendChild(link);
  }, [font]);
}

function CityPage({ city }: { city: CityData }) {
  usePageTitle(city.name);
  useCityFont(city.theme.font);
  const { theme } = city;
  // Акцент для текста и кнопок — с контрастом AA; исходный цвет остаётся в сцене и декоре
  const accent = readable(theme.accent, theme.bg);

  // Тема города — CSS-переменные на корне страницы
  const vars = {
    '--c-bg': theme.bg,
    '--c-ink': theme.ink,
    '--c-muted': theme.muted,
    '--c-accent': accent,
    '--c-accent2': theme.accent2,
    '--c-line': mix(theme.accent, '#ffffff', 0.82),
    '--c-shadow': `0 14px 34px ${rgba(accent, 0.28)}`,
    '--c-grad-bar': `linear-gradient(180deg, ${theme.accent2}, ${theme.accent})`,
    '--c-font': theme.font ? `'${theme.font.family}', serif` : 'var(--font)',
    '--grad-text':
      theme.gradient ??
      `linear-gradient(90deg, ${theme.accent}, ${theme.accent2} 50%, ${theme.accent})`,
  } as CSSProperties;

  return (
    <div className={styles.page} style={vars}>
      <nav aria-label="Хлебные крошки" className={styles.crumbs}>
        <Link to={`/destinations?city=${city.id}`}>Направления</Link>
        <span aria-hidden="true">/</span>
        <span>{city.country}</span>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className={styles.current}>
          {city.name}
        </span>
      </nav>
      <CityHero city={city} />
      <Facts city={city} />
      <Gallery city={city} />
      {renderSignature(city.id)}
      <Know city={city} />
      <Advise city={city} />
      <Dishes city={city} />
      <Phrasebook city={city} />
      <Prices city={city} />
      <Seasons city={city} />
      <Plan city={city} />
    </div>
  );
}

export default function City() {
  const { id } = useParams();
  const city = getCity(id);
  // key: при переходе между городами состояние секций сбрасывается
  return city ? <CityPage key={city.id} city={city} /> : <NotFound />;
}
