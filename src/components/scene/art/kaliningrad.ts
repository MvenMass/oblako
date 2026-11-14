// Калининград: дюны Куршской косы и маяк, Кафедральный собор на острове Канта,
// фахверковые дома Рыбной деревни, Преголя и чайки, сосновые ветки и капля янтаря.
// Ночью вращается луч маяка.
import { repeat, windows } from './draw';
import type { SceneArt } from './types';

const far =
  // Дюны
  '<path class="f-far" d="M-60 560 C120 500 260 490 420 530 C560 566 680 520 820 500 C980 478 1120 520 1260 530 C1360 536 1440 520 1500 516 L1500 780 L-60 780Z"/>' +
  // Маяк с вращающимся лучом
  '<path class="f-city" d="M1230 528 L1240 420 L1256 420 L1266 528Z"/>' +
  repeat(
    3,
    (i) =>
      `<rect class="f-roof" x="${1236 + i}" y="${440 + i * 28}" width="${24 - i * 2}" height="10"/>`,
  ) +
  '<rect class="f-wood" x="1238" y="404" width="20" height="18"/>' +
  '<rect class="f-win" x="1242" y="408" width="12" height="10"/>' +
  '<path class="beam" style="transform-origin: 1248px 412px" fill="#FFE9A8" d="M1248 412 L1700 362 L1700 462Z"/>';

const mid =
  '<path class="f-mid" d="M-60 630 C200 590 420 580 640 590 C860 600 1080 590 1500 610 L1500 780 L-60 780Z"/>' +
  // Кафедральный собор: кирпичный корпус, башня со шпилем, стрельчатые окна
  '<rect class="f-roof" x="520" y="500" width="240" height="96"/>' +
  '<path class="f-mid2" d="M510 500 L640 444 L770 500Z"/>' +
  '<rect class="f-roof" x="440" y="420" width="80" height="176"/>' +
  '<path class="f-mid2" d="M434 420 L480 330 L526 420Z"/>' +
  '<path class="s-wire" stroke-width="2" d="M480 330 V300"/>' +
  repeat(
    5,
    (i) =>
      `<path class="f-win-base" d="M${546 + i * 42} 580 V540 Q${556 + i * 42} 524 ${566 + i * 42} 540 V580Z"/><path class="f-win" d="M${546 + i * 42} 580 V540 Q${556 + i * 42} 524 ${566 + i * 42} 540 V580Z"/>`,
  ) +
  windows(462, 444, 2, 3, 22, 40, 14, 22);

/** Фахверковый дом: тёмные балки на светлой стене, крутая крыша */
const fachwerk = (x: number, w: number, h: number, i: number) =>
  `<rect class="${i % 2 ? 'f-city2' : 'f-city'}" x="${x}" y="${690 - h}" width="${w}" height="${h}"/>` +
  `<path class="f-roof" d="M${x - 6} ${690 - h} L${x + w / 2} ${690 - h - w * 0.7} L${x + w + 6} ${690 - h}Z"/>` +
  `<path class="s-near" stroke-width="4" fill="none" d="M${x} ${690 - h / 2} H${x + w} M${x + w / 3} ${690 - h} V690 M${x + (2 * w) / 3} ${690 - h} V690 M${x} ${690 - h} L${x + w / 3} ${690 - h / 2} M${x + w} ${690 - h} L${x + (2 * w) / 3} ${690 - h / 2}"/>` +
  windows(x + w / 6 - 6, 690 - h + h / 4 - 8, 3, 2, w / 3, h / 2, 12, 16);

const city = repeat(4, (i) => fachwerk(860 + i * 104, 96, 100 + ((i * 23) % 40), i));

/** Чайка: силуэт-галочка, летает */
const gull = (x: number, y: number, delay: number) =>
  `<g class="gull" style="animation-delay: -${delay}s"><path class="s-gull" stroke-width="3" fill="none" stroke-linecap="round" d="M${x - 14} ${y} q7 -8 14 0 q7 -8 14 0"/></g>`;

const water =
  '<rect class="f-water" x="-60" y="690" width="1560" height="100"/>' +
  '<g fill="none" stroke="rgba(255,255,255,.5)" stroke-width="2" stroke-linecap="round"><path class="shim" d="M120 720 h120 M500 736 h160 M880 716 h120 M1220 740 h140"/></g>' +
  gull(300, 420, 0) +
  gull(380, 452, 2.2) +
  gull(1040, 400, 4.4);

/** Сосновая ветка: густая хвоя парами в обе стороны */
const pine = (x: number, y: number, s: number, r: number) =>
  `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">` +
  '<path class="s-near" stroke-width="6" fill="none" stroke-linecap="round" d="M0 0 C60 -6 120 -12 180 -8"/>' +
  repeat(
    22,
    (i) =>
      `<path class="s-near" stroke-width="3" stroke-linecap="round" d="M${8 + i * 8} ${-1 - i * 0.35} l10 -22 M${8 + i * 8} ${-1 - i * 0.35} l10 20"/>`,
  ) +
  '</g>';

const amber =
  '<g transform="translate(140 742)"><path class="f-city2" d="M0 -30 C14 -12 20 0 20 10 C20 22 10 30 0 30 C-10 30 -20 22 -20 10 C-20 0 -14 -12 0 -30Z"/>' +
  '<path fill="#FFFFFF" opacity=".5" d="M-8 6 C-8 -2 -4 -8 0 -12 C-2 -4 -2 2 -4 8Z"/></g>';

const near = pine(-40, 280, 1.4, 16) + pine(1490, 250, 1.4, 170) + amber;

export const art: SceneArt = { far, mid, city, water, near };
