// Шанхай: силуэты Шанхайской башни, Цзиньмао и «Восточной жемчужины»,
// здания Бунда с часовой башней, река Хуанпу с круизным корабликом,
// красные фонари и ветка платана. Ночью по небоскрёбам бегут неоновые полосы.
import { repeat, windows } from './draw';
import type { SceneArt } from './types';

const far =
  // Шанхайская башня: закрученный силуэт
  '<path class="f-far" d="M930 690 L938 330 C944 270 960 230 984 200 L996 200 C1000 260 1008 320 1010 380 L1012 690Z"/>' +
  '<path class="neon neon-blue" d="M950 680 L956 360 C962 300 976 260 990 230"/>' +
  // Цзиньмао: ступенчатая пагода-небоскрёб
  '<path class="f-far" d="M820 690 L826 380 L834 380 L836 330 L846 330 L848 290 L856 290 L860 240 L864 290 L872 290 L874 330 L884 330 L886 380 L894 380 L900 690Z"/>' +
  '<path class="neon neon-pink" d="M860 680 L860 260"/>' +
  // Всемирный финансовый центр — «открывашка»
  '<path class="f-far" d="M1060 690 L1066 300 L1110 280 L1116 690Z M1078 320 L1100 312 L1100 334 L1078 340Z"/>' +
  // Восточная жемчужина: шары на опорах
  '<path class="s-wire" stroke-width="6" d="M680 690 L700 470 M740 690 L720 470 M710 470 V250"/>' +
  '<circle class="f-grape" cx="710" cy="480" r="34"/>' +
  '<circle class="f-grape" cx="710" cy="340" r="22"/>' +
  '<path class="s-wire" stroke-width="3" d="M710 250 V190"/>' +
  repeat(
    8,
    (i) =>
      `<rect class="f-far" x="${1140 + i * 40}" y="${520 + (i % 3) * 30}" width="34" height="${170 - (i % 3) * 30}"/>`,
  ) +
  '<path class="neon neon-blue" d="M1150 540 H1450"/>';

/** Колониальное здание Бунда */
const bund = (x: number, w: number, h: number, dome = false) =>
  `<rect class="f-city" x="${x}" y="${690 - h}" width="${w}" height="${h}"/>` +
  `<rect class="f-city2" x="${x - 4}" y="${690 - h - 8}" width="${w + 8}" height="10"/>` +
  (dome
    ? `<path class="f-roof" d="M${x + w / 2 - 26} ${690 - h - 8} A26 26 0 0 1 ${x + w / 2 + 26} ${690 - h - 8}Z"/>`
    : '') +
  windows(
    x + 12,
    690 - h + 14,
    Math.floor((w - 24) / 22) + 1,
    Math.floor((h - 30) / 30),
    22,
    30,
    12,
    18,
  );

const mid =
  bund(-30, 150, 150) +
  bund(130, 110, 170, true) +
  bund(250, 130, 140) +
  // Таможня с часовой башней
  '<rect class="f-city" x="390" y="520" width="120" height="170"/>' +
  '<rect class="f-city" x="430" y="440" width="40" height="80"/>' +
  '<circle class="f-snow" cx="450" cy="470" r="13"/>' +
  '<path class="s-wire" stroke-width="2" fill="none" d="M450 470 V462 M450 470 L456 474"/>' +
  '<path class="f-roof" d="M426 440 L450 400 L474 440Z"/>' +
  windows(402, 540, 5, 4, 22, 34, 12, 20) +
  bund(520, 140, 130);

const city = '';

/** Круизный кораблик на Хуанпу */
const cruise =
  '<g class="ferry" style="--run: 520px"><g transform="translate(360 670)">' +
  '<path class="f-city" d="M0 20 L180 20 L164 40 L14 40Z"/>' +
  '<rect class="f-city2" x="20" y="4" width="140" height="16"/>' +
  '<rect class="f-city" x="40" y="-10" width="96" height="14"/>' +
  windows(28, 8, 6, 1, 22, 0, 12, 7) +
  '<path class="neon neon-pink" d="M2 22 H178"/>' +
  '</g></g>';

const water =
  '<rect class="f-water" x="-60" y="688" width="1560" height="100"/>' +
  '<g fill="none" stroke="rgba(255,255,255,.45)" stroke-width="2" stroke-linecap="round"><path class="shim" d="M100 718 h140 M520 734 h160 M900 716 h120 M1200 738 h140"/></g>' +
  cruise;

/** Лист платана */
const leaf = (x: number, y: number, s: number, r: number) =>
  `<path class="f-near" transform="translate(${x} ${y}) rotate(${r}) scale(${s})" d="M0 0 L-22 -18 L-40 -14 L-30 -32 L-44 -52 L-20 -48 L-10 -70 L0 -50 L10 -70 L20 -48 L44 -52 L30 -32 L40 -14 L22 -18Z"/>`;

const lantern = (x: number, y: number, delay: number) =>
  `<g class="sway2" style="transform-origin: ${x}px ${y}px; animation-delay: -${delay}s">` +
  `<path class="s-wire" stroke-width="1.5" d="M${x} ${y} V${y + 40}"/>` +
  `<circle class="f-win-dim" cx="${x}" cy="${y + 56}" r="28" fill="#FFB46B"/>` +
  `<ellipse class="f-roof" cx="${x}" cy="${y + 56}" rx="16" ry="14"/>` +
  '</g>';

/** Ветка платана в нижнем углу: ствол и листья */
const branch = (x: number, y: number, s: number, flip: boolean) =>
  `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">` +
  '<path class="s-near" stroke-width="8" fill="none" stroke-linecap="round" d="M0 0 C40 -40 90 -70 160 -80"/>' +
  leaf(60, -40, 0.9, -20) +
  leaf(110, -64, 1, 10) +
  leaf(160, -80, 0.8, 40) +
  '</g>';

const near =
  branch(-20, 790, 1.2, false) +
  branch(1460, 790, 1.2, true) +
  lantern(200, -10, 0) +
  lantern(1250, -10, 1.5);

export const art: SceneArt = { far, mid, city, water, near };
