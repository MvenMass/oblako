// Пекин: горы с Великой стеной по гребню, жёлтые крыши Запретного города,
// Храм Неба, серые хутуны с красными фонарями, ветка цветущей сливы.
// Фонари качаются, ночью светятся.
import { repeat, windows } from './draw';
import type { SceneArt } from './types';

const far =
  '<path class="f-far" d="M-60 500 L80 440 L200 470 L330 400 L460 450 L600 380 L740 440 L880 390 L1020 450 L1160 400 L1300 450 L1500 410 L1500 780 L-60 780Z"/>' +
  // Великая стена по гребню: зубчатая лента и башни
  '<path class="s-wire" stroke-width="5" fill="none" d="M-60 506 L80 446 L200 476 L330 406 L460 456 L600 386 L740 446 L880 396 L1020 456 L1160 406 L1300 456 L1500 416"/>' +
  [
    [330, 406],
    [600, 386],
    [880, 396],
    [1160, 406],
  ]
    .map(([x, y]) => `<rect class="f-mid2" x="${x - 9}" y="${y - 18}" width="18" height="18"/>`)
    .join('');

/** Китайская крыша с загнутыми краями */
const roof = (x: number, y: number, w: number, cls = 'f-city2') =>
  `<path class="${cls}" d="M${x - 18} ${y} Q${x - 4} ${y - 6} ${x + 6} ${y - 22} L${x + w - 6} ${y - 22} Q${x + w + 4} ${y - 6} ${x + w + 18} ${y}Z"/>`;

const mid =
  '<path class="f-mid" d="M-60 610 C200 540 460 530 720 540 C980 550 1200 520 1500 560 L1500 780 L-60 780Z"/>' +
  // Запретный город: красные стены и жёлтые двухъярусные крыши
  '<rect class="f-roof" x="220" y="520" width="380" height="50"/>' +
  '<rect class="f-roof" x="300" y="470" width="220" height="56"/>' +
  roof(300, 470, 220) +
  roof(330, 448, 160) +
  windows(318, 488, 8, 1, 24, 0, 12, 22) +
  // Храм Неба: круглый трёхъярусный павильон
  '<rect class="f-city" x="940" y="560" width="200" height="16"/>' +
  '<rect class="f-roof" x="985" y="500" width="110" height="60"/>' +
  '<path class="f-grape" d="M960 500 Q1040 470 1120 500Z"/>' +
  '<rect class="f-roof" x="1000" y="456" width="80" height="40"/>' +
  '<path class="f-grape" d="M978 458 Q1040 432 1102 458Z"/>' +
  '<path class="f-grape" d="M996 420 Q1040 396 1084 420 L1084 426 L996 426Z"/>' +
  '<path class="f-city2" d="M1036 398 L1040 380 L1044 398Z"/>';

/** Красный фонарь: качается, ночью светится */
const lantern = (x: number, y: number, len: number, delay: number) =>
  `<g class="sway2" style="transform-origin: ${x}px ${y}px; animation-delay: -${delay}s">` +
  `<path class="s-wire" stroke-width="1.5" d="M${x} ${y} V${y + len}"/>` +
  `<circle class="f-win-dim" cx="${x}" cy="${y + len + 14}" r="26" fill="#FFB46B"/>` +
  `<ellipse class="f-grape" cx="${x}" cy="${y + len + 14}" rx="14" ry="12"/>` +
  `<rect class="f-city2" x="${x - 6}" y="${y + len}" width="12" height="4"/>` +
  `<rect class="f-city2" x="${x - 6}" y="${y + len + 25}" width="12" height="4"/>` +
  '</g>';

/** Серый дом хутуна с черепичной крышей */
const hutong = (x: number, w: number, h: number) =>
  `<rect class="f-city" x="${x}" y="${690 - h}" width="${w}" height="${h}"/>` +
  roof(x + 6, 690 - h, w - 12, 'f-mid2') +
  `<rect class="f-grape" x="${x + w / 2 - 12}" y="${650}" width="24" height="40"/>` +
  windows(x + 12, 690 - h + 18, Math.floor((w - 24) / 26) + 1, 1, 26, 0, 14, 16);

const city =
  hutong(-20, 140, 90) +
  hutong(130, 120, 80) +
  hutong(980, 130, 86) +
  hutong(1120, 150, 96) +
  hutong(1280, 140, 80) +
  '<path class="s-wire" stroke-width="1.5" fill="none" d="M980 604 Q1150 640 1440 604"/>' +
  lantern(1040, 612, 14, 0) +
  lantern(1150, 622, 14, 1.2) +
  lantern(1260, 618, 14, 2.4) +
  lantern(1370, 610, 14, 0.6);

const water = '<rect class="f-mid2" x="-60" y="688" width="1560" height="100"/>';

/** Ветка цветущей сливы */
const plum = (x: number, y: number, s: number, r: number) =>
  `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">` +
  '<path class="s-near" stroke-width="8" fill="none" stroke-linecap="round" d="M0 0 C50 -30 110 -36 170 -20 M80 -26 C100 -60 130 -70 160 -76"/>' +
  repeat(
    7,
    (i) =>
      `<g transform="translate(${30 + i * 22} ${-22 - (i % 3) * 14})">` +
      repeat(
        5,
        (k) =>
          `<circle class="f-snow" cx="${Math.cos((k * 72 * Math.PI) / 180) * 6}" cy="${Math.sin((k * 72 * Math.PI) / 180) * 6}" r="5"/>`,
      ) +
      '<circle class="f-grape" r="3"/></g>',
  ) +
  '</g>';

const near =
  plum(-30, 250, 1.4, 20) +
  plum(1480, 300, 1.3, 160) +
  lantern(90, -10, 120, 1.8) +
  lantern(1350, -10, 90, 3);

export const art: SceneArt = { far, mid, city, water, near };
