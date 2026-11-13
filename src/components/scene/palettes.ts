import { contrast, mix } from '@/lib/color';
import type { City, TodPalette } from '@/types/city';

// Опорные небеса — по палитрам Тбилиси (city.md): день светлый, закат розово-лиловый, ночь #06172F
const SKY = {
  day: ['#9BD8F0', '#D9F1FB', '#FFF4E6'],
  sunset: ['#4B2A6B', '#C2557A', '#F6A86B'],
  night: ['#06172F', '#0D2648', '#1C3B63'],
};
const NIGHT = '#06172F';

/**
 * Три палитры сцены (день, закат, ночь) из темы города —
 * для городов без нарисованных палитр в scene.todPalettes.
 */
export function generatePalettes(city: City): TodPalette[] {
  const { accent, accent2, folder } = city.theme;
  // Светлый из пары folder — тот, что хуже контрастирует с белым
  const [dark, light] = [...folder].sort((a, b) => contrast(b, '#ffffff') - contrast(a, '#ffffff'));

  const day: TodPalette = {
    far: mix(dark, '#CFE6F0', 0.72),
    snow: '#FFFFFF',
    mid: mix(light, '#3E6B55', 0.45),
    mid2: mix(light, '#2F5A47', 0.55),
    city: mix(light, '#FFFFFF', 0.72),
    city2: mix(accent2, '#FFFFFF', 0.5),
    roof: mix(accent, '#B5644A', 0.25),
    wood: mix(accent, '#5A3A2E', 0.6),
    winBase: '#5E7C93',
    win: 0,
    water: mix(dark, '#5DB3D6', 0.55),
    near: mix(dark, '#24402F', 0.55),
    grape: accent,
    sun: '#FFE9A8',
    stars: 0,
    cloud: 1,
    wire: '#33485C',
    gull: '#33485C',
    sky: `linear-gradient(180deg, ${SKY.day[0]} 0%, ${SKY.day[1]} 60%, ${SKY.day[2]} 100%)`,
    sx: 1080,
    sy: 150,
    ink: city.theme.ink,
  };

  const sunset: TodPalette = {
    ...day,
    far: mix(dark, '#8A5A8F', 0.65),
    mid: mix(light, '#5B3557', 0.6),
    mid2: mix(light, '#4A2B48', 0.65),
    city: mix(light, '#F2C2A8', 0.6),
    city2: mix(accent2, '#E39A7E', 0.5),
    roof: mix(accent, '#7A2E3A', 0.35),
    winBase: '#6E4A5A',
    win: 0.65,
    water: mix(dark, '#C2557A', 0.5),
    near: mix(dark, '#2E1F33', 0.7),
    sun: '#FFB46B',
    stars: 0.2,
    cloud: 0.8,
    wire: '#2B1A2E',
    gull: '#2B1A2E',
    sky: `linear-gradient(180deg, ${SKY.sunset[0]} 0%, ${SKY.sunset[1]} 55%, ${SKY.sunset[2]} 100%)`,
    sx: 1080,
    sy: 470,
    ink: '#FFFFFF',
  };

  const night: TodPalette = {
    ...day,
    far: mix(dark, NIGHT, 0.7),
    snow: '#9FB3C8',
    mid: mix(light, NIGHT, 0.78),
    mid2: mix(light, NIGHT, 0.82),
    city: mix(light, NIGHT, 0.72),
    city2: mix(accent2, NIGHT, 0.75),
    roof: mix(accent, NIGHT, 0.7),
    wood: mix(accent, NIGHT, 0.8),
    winBase: '#1B2C44',
    win: 1,
    water: mix(dark, NIGHT, 0.65),
    near: mix(dark, NIGHT, 0.88),
    grape: mix(accent, NIGHT, 0.6),
    sun: '#EAF4FB',
    stars: 1,
    cloud: 0.25,
    wire: '#8FA6BD',
    gull: '#8FA6BD',
    sky: `linear-gradient(180deg, ${SKY.night[0]} 0%, ${SKY.night[1]} 60%, ${SKY.night[2]} 100%)`,
    sx: 300,
    sy: 140,
    ink: '#FFFFFF',
  };

  return [day, sunset, night];
}

export function palettesFor(city: City): TodPalette[] {
  return city.scene.todPalettes ?? generatePalettes(city);
}

const VAR_KEYS = [
  'far',
  'snow',
  'mid',
  'mid2',
  'city',
  'city2',
  'roof',
  'wood',
  'winBase',
  'win',
  'water',
  'near',
  'grape',
  'sun',
  'stars',
  'cloud',
  'wire',
  'gull',
] as const;

/** CSS-переменные слоёв сцены для выбранной палитры */
export function paletteVars(p: TodPalette): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const k of VAR_KEYS) vars[`--${k}`] = String(p[k]);
  return vars;
}
