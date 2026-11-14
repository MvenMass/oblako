// Ханой: карстовые скалы Халонга в дымке, Черепашья башня на озере,
// колониальные дома, узкие «трубчатые» дома с балконами и флагами,
// листья банана и лотосы. Мотобайки едут по улице, ночью горят фонари.
import { repeat, windows } from './draw';
import type { SceneArt } from './types';

const far =
  // Карстовые скалы: высокие округлые «столбы»
  [
    [120, 420, 70],
    [230, 380, 60],
    [340, 430, 80],
    [900, 400, 70],
    [1020, 360, 66],
    [1140, 420, 74],
    [1260, 390, 60],
    [1380, 430, 70],
  ]
    .map(
      ([x, top, w]) =>
        `<path class="f-far" d="M${x - w} 560 C${x - w} ${top + 40} ${x - w * 0.6} ${top} ${x} ${top} C${x + w * 0.6} ${top} ${x + w} ${top + 40} ${x + w} 560Z"/>`,
    )
    .join('') + '<rect class="f-far" x="-60" y="540" width="1560" height="40"/>';

const mid =
  '<path class="f-mid" d="M-60 620 C200 580 460 570 700 578 C940 586 1200 570 1500 600 L1500 780 L-60 780Z"/>' +
  // Озеро и Черепашья башня
  '<ellipse class="f-water" cx="640" cy="606" rx="200" ry="22"/>' +
  '<rect class="f-city" x="610" y="530" width="60" height="70"/>' +
  '<rect class="f-city" x="620" y="500" width="40" height="32"/>' +
  '<path class="f-roof" d="M600 532 Q640 514 680 532Z M612 502 Q640 486 668 502Z"/>' +
  '<path class="f-win-base" d="M630 600 V572 A10 10 0 0 1 650 572 V600Z"/><path class="f-win" d="M630 600 V572 A10 10 0 0 1 650 572 V600Z"/>' +
  // Колониальные дома с ставнями
  '<rect class="f-city2" x="860" y="520" width="160" height="90"/>' +
  '<path class="f-roof" d="M850 520 L940 492 L1030 520Z"/>' +
  windows(878, 540, 6, 2, 22, 32, 12, 20);

/** Узкий «трубчатый» дом с балконом и флагом */
const tube = (x: number, w: number, h: number, i: number) =>
  `<rect class="${i % 2 ? 'f-city2' : 'f-city'}" x="${x}" y="${690 - h}" width="${w}" height="${h}"/>` +
  `<rect class="f-roof" x="${x - 4}" y="${690 - h - 6}" width="${w + 8}" height="8"/>` +
  windows(x + (w - 30) / 2, 690 - h + 16, 2, Math.floor((h - 40) / 34), 18, 34, 12, 18) +
  repeat(
    Math.floor((h - 40) / 34),
    (r) =>
      `<rect class="f-wood" x="${x - 4}" y="${690 - h + 36 + r * 34}" width="${w + 8}" height="3"/>`,
  ) +
  (i % 3 === 0
    ? `<path class="s-wire" stroke-width="2" d="M${x + w - 6} ${690 - h - 6} V${690 - h - 46}"/><path class="f-grape" d="M${x + w - 5} ${690 - h - 46} h26 v16 h-26Z"/>`
    : '');

const city =
  repeat(5, (i) => tube(-20 + i * 58, 54, 120 + ((i * 37) % 60), i)) +
  repeat(6, (i) => tube(1080 + i * 58, 54, 110 + ((i * 41) % 70), i + 1)) +
  // Фонари вдоль улицы: ночью светятся
  repeat(
    4,
    (i) =>
      `<circle class="f-win-dim" cx="${360 + i * 220}" cy="652" r="22" fill="#FFB46B"/><path class="s-wire" stroke-width="3" d="M${360 + i * 220} 690 V654"/><circle class="f-win" cx="${360 + i * 220}" cy="652" r="6"/>`,
  );

/** Мотобайк с седоком */
const bike = (y: number, delay: number, dur: number) =>
  `<g class="ride" style="animation-delay: -${delay}s; animation-duration: ${dur}s"><g transform="translate(0 ${y})">` +
  '<circle class="s-wire" stroke-width="3" fill="none" cx="0" cy="0" r="8"/><circle class="s-wire" stroke-width="3" fill="none" cx="34" cy="0" r="8"/>' +
  '<path class="f-roof" d="M0 -4 L34 -4 L28 -14 L8 -14Z"/>' +
  '<path class="f-wood" d="M14 -14 L18 -36 L26 -36 L24 -14Z"/>' +
  '<path class="f-city2" d="M12 -36 Q22 -50 32 -36Z"/>' +
  '</g></g>';

const water =
  '<rect class="f-mid2" x="-60" y="688" width="1560" height="100"/>' +
  bike(708, 0, 9) +
  bike(730, 4, 11) +
  bike(716, 7, 8);

/** Лист банана и лотос */
const banana = (x: number, y: number, s: number, r: number) =>
  `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">` +
  '<path class="f-near" d="M0 0 C40 -60 120 -90 220 -80 C160 -50 80 -20 0 0Z"/>' +
  '<path class="s-wire" stroke-width="2" fill="none" d="M0 0 C60 -40 140 -70 220 -80"/>' +
  '</g>';

const lotus = (x: number, y: number) =>
  `<g transform="translate(${x} ${y})">` +
  repeat(
    5,
    (i) =>
      `<path class="f-grape" transform="rotate(${-60 + i * 30})" d="M0 0 C-10 -16 -8 -34 0 -44 C8 -34 10 -16 0 0Z"/>`,
  ) +
  '<ellipse class="f-near" cx="0" cy="6" rx="40" ry="8"/></g>';

const near =
  banana(-40, 520, 1.4, -10) + banana(1500, 480, 1.4, 190) + lotus(160, 760) + lotus(1300, 750);

export const art: SceneArt = { far, mid, city, water, near };
