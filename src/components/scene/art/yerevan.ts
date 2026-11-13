// Ереван: двуглавый Арарат в снегу, розовые туфовые дома, Каскад ступенями
// с ночной подсветкой, площадь Республики с часами и фонтанами, ветки абрикоса.
import { house, repeat, win, windows } from './draw';
import type { SceneArt } from './types';

const far =
  // Большой и Малый Арарат
  '<path class="f-far" d="M-60 520 L300 470 L560 330 L700 250 L780 236 L860 260 L1000 350 L1080 320 L1140 300 L1210 330 L1320 400 L1500 450 L1500 780 L-60 780Z"/>' +
  '<path class="f-snow" d="M660 272 L700 250 L780 236 L860 260 L900 290 L860 282 L830 300 L800 276 L770 296 L740 274 L700 296 L680 280Z"/>' +
  '<path class="f-snow" d="M1110 312 L1140 300 L1170 312 L1160 320 L1140 314 L1124 322Z"/>';

/** Каскад: ступени-террасы, ночью светятся ряды огней */
const cascade = repeat(
  6,
  (i) =>
    `<rect class="f-city2" x="${880 + i * 26}" y="${450 + i * 32}" width="${300 - i * 52}" height="34"/>` +
    `<rect class="f-win" x="${890 + i * 26}" y="${458 + i * 32}" width="${280 - i * 52}" height="3"/>`,
);

const mid =
  '<path class="f-mid" d="M-60 600 C160 540 420 520 700 530 C900 536 1100 470 1500 500 L1500 780 L-60 780Z"/>' +
  cascade +
  // Розовые туфовые дома на склоне
  house(120, 520, 90, 90) +
  house(230, 540, 70, 70, 'f-city2') +
  house(1240, 500, 100, 110) +
  house(1350, 520, 90, 90, 'f-city2');

/** Арочный дом площади Республики */
const arcade = (x: number, w: number) =>
  `<rect class="f-city" x="${x}" y="580" width="${w}" height="110"/>` +
  `<rect class="f-city2" x="${x}" y="572" width="${w}" height="10"/>` +
  repeat(
    Math.floor(w / 34),
    (i) =>
      `<path class="f-win-base" d="M${x + 10 + i * 34} 690 L${x + 10 + i * 34} 650 A11 11 0 0 1 ${x + 32 + i * 34} 650 L${x + 32 + i * 34} 690Z"/>` +
      `<path class="f-win" d="M${x + 10 + i * 34} 690 L${x + 10 + i * 34} 650 A11 11 0 0 1 ${x + 32 + i * 34} 650 L${x + 32 + i * 34} 690Z"/>`,
  ) +
  windows(x + 14, 596, Math.floor(w / 34), 1, 34, 30, 14, 20);

/** Фонтан: чаша и пульсирующие струи */
const fountain = (cx: number) =>
  `<ellipse class="f-water" cx="${cx}" cy="700" rx="44" ry="8"/>` +
  repeat(
    5,
    (i) =>
      `<rect class="jet f-snow" x="${cx - 22 + i * 10}" y="${652 + Math.abs(2 - i) * 10}" width="4" height="${46 - Math.abs(2 - i) * 10}" rx="2" style="animation-delay: -${(i * 0.3).toFixed(1)}s"/>`,
  );

const city =
  arcade(520, 240) +
  arcade(820, 200) +
  // Башня с часами
  '<rect class="f-city" x="620" y="470" width="48" height="110"/>' +
  '<path class="f-roof" d="M614 470 L644 430 L674 470Z"/>' +
  '<circle class="f-snow" cx="644" cy="500" r="14"/>' +
  '<path class="s-wire" stroke-width="2.5" fill="none" d="M644 500 V490 M644 500 L652 504"/>' +
  win(636, 530, 16, 28) +
  fountain(700) +
  fountain(800);

/** Ветка абрикоса с плодами */
const branch = (x: number, y: number, s: number, r: number) =>
  `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">` +
  '<path class="s-near" stroke-width="7" fill="none" stroke-linecap="round" d="M0 0 C40 -20 80 -30 140 -26"/>' +
  repeat(
    5,
    (i) =>
      `<path class="f-near" transform="translate(${20 + i * 26} ${-12 - i * 3}) rotate(${i % 2 ? 30 : -40})" d="M0 0 C10 -16 30 -18 40 -6 C26 2 10 4 0 0Z"/>`,
  ) +
  '<circle class="f-roof" cx="56" cy="-4" r="11"/><circle class="f-roof" cx="98" cy="-12" r="10"/><circle class="f-roof" cx="122" cy="-8" r="9"/>' +
  '</g>';

const near = branch(-30, 300, 1.6, 30) + branch(1480, 240, 1.5, 150) + branch(-40, 760, 1.4, -20);

export const art: SceneArt = { far, mid, city, water: '', near };
