// Казань: Волга и мост «Миллениум», кремль с башней Сююмбике, Кул-Шариф,
// купеческие дома, Казанка с теплоходом, орнамент-тюльпаны. Ночью подсвечены минареты.
import { house, repeat, win, windows } from './draw';
import type { SceneArt } from './types';

/** Минарет: ствол, балкон, шатёр; ночная подсветка — полоса f-win */
const minaret = (x: number, base: number, h: number) =>
  `<rect class="f-city" x="${x - 7}" y="${base - h}" width="14" height="${h}"/>` +
  `<rect class="f-city2" x="${x - 11}" y="${base - h * 0.62}" width="22" height="6"/>` +
  `<path class="f-roof" d="M${x - 8} ${base - h} L${x} ${base - h - 46} L${x + 8} ${base - h}Z"/>` +
  `<rect class="f-win" x="${x - 2}" y="${base - h + 8}" width="4" height="${h - 20}"/>`;

/** Луковичный купол */
const dome = (cx: number, base: number, r: number, cls = 'f-roof') =>
  `<path class="${cls}" d="M${cx - r} ${base} C${cx - r} ${base - r * 1.2} ${cx} ${base - r * 1.5} ${cx} ${base - r * 2.1} C${cx} ${base - r * 1.5} ${cx + r} ${base - r * 1.2} ${cx + r} ${base}Z"/>`;

const far =
  // Волжский берег
  '<path class="f-far" d="M-60 520 C200 495 420 505 700 498 C980 490 1200 505 1500 492 L1500 780 L-60 780Z"/>' +
  // Мост «Миллениум»: полотно и арка-«М» с вантами
  '<rect class="f-mid2" x="880" y="506" width="620" height="8"/>' +
  '<path class="f-mid2" d="M1120 506 L1150 400 L1180 450 L1210 400 L1240 506 L1228 506 L1210 430 L1180 474 L1150 430 L1132 506Z"/>' +
  repeat(
    6,
    (i) =>
      `<path class="s-wire" stroke-width="1.5" fill="none" d="M1150 ${410 + i * 6} L${1000 + i * 22} 506 M1210 ${410 + i * 6} L${1360 - i * 22} 506"/>`,
  );

const mid =
  // Холм и белые стены кремля
  '<path class="f-mid" d="M160 640 C260 560 420 540 620 548 C780 554 880 580 960 640Z"/>' +
  '<rect class="f-city" x="230" y="540" width="640" height="40"/>' +
  repeat(26, (i) => `<rect class="f-city" x="${232 + i * 24.4}" y="530" width="12" height="12"/>`) +
  // Башня Сююмбике: ярусы и зелёный шпиль
  '<rect class="f-city2" x="300" y="430" width="44" height="110"/>' +
  '<rect class="f-city2" x="306" y="390" width="32" height="44"/>' +
  '<rect class="f-city2" x="311" y="360" width="22" height="32"/>' +
  '<path class="f-roof" d="M308 360 L322 300 L336 360Z"/>' +
  win(316, 450) +
  win(316, 400, 10, 14) +
  // Кул-Шариф: четыре минарета и бирюзовый купол
  minaret(470, 540, 150) +
  minaret(620, 540, 150) +
  minaret(500, 540, 110) +
  minaret(590, 540, 110) +
  '<rect class="f-city" x="500" y="470" width="90" height="70"/>' +
  dome(545, 470, 34) +
  windows(512, 490, 4, 1, 18, 30, 10, 22) +
  // Благовещенский собор: белый корпус, золотые главки
  '<rect class="f-city" x="720" y="470" width="110" height="70"/>' +
  dome(775, 470, 22, 'f-city2') +
  dome(738, 470, 12, 'f-city2') +
  dome(812, 470, 12, 'f-city2') +
  windows(735, 490, 4, 1, 22, 30, 10, 20);

const city =
  // Купеческие дома улицы Баумана — слева и справа от кремля
  house(-20, 600, 90, 100) +
  house(80, 620, 70, 80, 'f-city2') +
  house(980, 590, 100, 110, 'f-city2') +
  house(1090, 610, 80, 90) +
  house(1180, 580, 110, 120, 'f-city2') +
  house(1300, 605, 90, 95) +
  house(1400, 590, 80, 110, 'f-city2');

const water =
  '<rect class="f-water" x="-60" y="688" width="1560" height="100"/>' +
  '<g fill="none" stroke="rgba(255,255,255,.5)" stroke-width="2" stroke-linecap="round"><path class="shim" d="M80 716 h120 M420 730 h160 M760 712 h110 M1100 728 h160"/></g>' +
  // Теплоход идёт по Казанке
  '<g class="ferry" style="--run: 380px"><g transform="translate(540 676)">' +
  '<path class="f-city" d="M0 16 L150 16 L136 34 L12 34Z"/>' +
  '<rect class="f-city2" x="24" y="2" width="96" height="14"/>' +
  '<rect class="f-roof" x="40" y="-8" width="56" height="10"/>' +
  windows(30, 5, 5, 1, 18, 0, 10, 7) +
  '</g></g>';

/** Орнамент-тюльпан */
const tulip = (x: number, y: number, s: number, r: number) =>
  `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">` +
  '<path class="f-near" d="M0 0 C-4 -40 -2 -70 0 -90 C2 -70 4 -40 0 0Z"/>' +
  '<path class="f-near" d="M0 -40 C-24 -46 -36 -66 -30 -84 C-16 -72 -6 -60 0 -40Z M0 -40 C24 -46 36 -66 30 -84 C16 -72 6 -60 0 -40Z"/>' +
  '<path class="f-grape" d="M0 -88 C-20 -96 -24 -124 -14 -142 C-8 -128 -4 -122 0 -128 C4 -122 8 -128 14 -142 C24 -124 20 -96 0 -88Z"/>' +
  '</g>';

const near =
  tulip(20, 800, 1.5, 14) +
  tulip(110, 810, 1.1, -10) +
  tulip(1330, 810, 1.3, -12) +
  tulip(1420, 800, 1.6, 10);

export const art: SceneArt = { far, mid, city, water, near };
