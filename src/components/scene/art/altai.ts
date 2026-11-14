// Алтай: снежные пики Северо-Чуйского хребта, лиственничные склоны, юрта с дымком,
// бирюзовая Катунь с порогами и рафтом, кедровые ветки и маралий рог.
// Ночью — Млечный путь.
import { repeat } from './draw';
import type { SceneArt } from './types';

const far =
  // Млечный путь: размытая светлая полоса, видна только ночью
  '<path class="milky" fill="#EAF4FB" d="M-60 120 C300 260 700 160 1000 280 C1200 360 1360 300 1500 360 L1500 300 C1360 240 1200 300 1000 220 C700 100 300 200 -60 60Z"/>' +
  '<path class="f-far" d="M-60 480 L100 380 L200 420 L340 300 L460 380 L600 280 L720 360 L860 260 L1000 350 L1120 290 L1260 380 L1380 320 L1500 380 L1500 780 L-60 780Z"/>' +
  [
    [340, 300],
    [600, 280],
    [860, 260],
    [1120, 290],
  ]
    .map(
      ([x, y]) =>
        `<path class="f-snow" d="M${x - 46} ${y + 50} L${x} ${y} L${x + 46} ${y + 50} L${x + 26} ${y + 40} L${x + 10} ${y + 54} L${x - 8} ${y + 38} L${x - 26} ${y + 50}Z"/>`,
    )
    .join('');

/** Лиственница — узкая ёлочка */
const larch = (x: number, base: number, h: number) =>
  `<path class="f-mid2" d="M${x} ${base - h} L${x + h * 0.22} ${base} L${x - h * 0.22} ${base}Z"/>`;

const mid =
  '<path class="f-mid" d="M-60 620 C160 520 360 480 560 500 C760 520 900 560 1000 620 L1000 780 L-60 780Z"/>' +
  '<path class="f-mid" d="M800 640 C980 540 1180 500 1340 520 C1420 530 1470 550 1500 570 L1500 780 L800 780Z"/>' +
  repeat(14, (i) => larch(40 + i * 66, 600 - Math.abs(7 - i) * 8, 70 + (i % 3) * 22)) +
  // Юрта с дымком
  '<path class="f-city" d="M1120 600 L1120 572 Q1170 536 1220 572 L1220 600Z"/>' +
  '<path class="f-roof" d="M1114 574 Q1170 532 1226 574 Q1170 556 1114 574Z"/>' +
  '<rect class="f-wood" x="1160" y="578" width="20" height="22"/>' +
  '<rect class="f-win" x="1164" y="582" width="12" height="18"/>' +
  repeat(
    3,
    (i) =>
      `<circle class="smoke f-snow" cx="${1170 + i * 4}" cy="532" r="${8 + i * 2}" style="animation-delay: -${(i * 1.6).toFixed(1)}s"/>`,
  );

const city = '';

/** Рафт на порогах */
const raft =
  '<g class="ferry" style="--run: 480px"><g class="bob"><g transform="translate(280 690)">' +
  '<path class="f-roof" d="M0 10 C10 22 90 22 100 10 L94 0 L6 0Z"/>' +
  repeat(4, (i) => `<circle class="f-city2" cx="${20 + i * 20}" cy="-6" r="6"/>`) +
  '</g></g></g>';

const water =
  '<path class="f-water" d="M-60 700 C300 670 700 690 1000 676 C1200 668 1380 680 1500 674 L1500 790 L-60 790Z"/>' +
  // Пороги — белые гребни
  '<g fill="none" stroke="rgba(255,255,255,.7)" stroke-width="3" stroke-linecap="round"><path class="shim" d="M60 712 q20 -10 40 0 M420 724 q24 -12 48 0 M760 708 q20 -10 40 0 M1100 726 q24 -12 48 0 M1320 716 q20 -10 40 0"/></g>' +
  raft;

/** Кедровая ветка: пучки хвои в обе стороны */
const cedar = (x: number, y: number, s: number, r: number) =>
  `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">` +
  '<path class="s-near" stroke-width="6" fill="none" stroke-linecap="round" d="M0 0 C60 -10 120 -20 180 -16"/>' +
  repeat(
    20,
    (i) =>
      `<path class="s-near" stroke-width="3" stroke-linecap="round" d="M${8 + i * 9} ${-1 - i * 0.8} l12 -24 M${8 + i * 9} ${-1 - i * 0.8} l12 22"/>`,
  ) +
  '</g>';

/** Маралий рог */
const antler =
  '<g transform="translate(1340 780)"><path class="s-near" stroke-width="10" fill="none" stroke-linecap="round" d="M0 0 C10 -60 30 -120 70 -170 M18 -60 L-26 -96 M34 -110 L-4 -150 M56 -150 L40 -196 M66 -164 L104 -190"/></g>';

const near = cedar(-40, 300, 1.4, 20) + cedar(-30, 720, 1.5, -10) + antler;

export const art: SceneArt = { far, mid, city, water, near };
