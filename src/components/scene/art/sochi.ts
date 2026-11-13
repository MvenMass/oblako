// Сочи: снежный Кавказский хребет, зелёные горы с канаткой, Морской вокзал
// со шпилем и пальмы, Чёрное море с яхтой, пальмовые листья и магнолия.
import { repeat, windows } from './draw';
import type { SceneArt } from './types';

const far =
  '<path class="f-far" d="M-60 470 L80 420 L180 450 L300 360 L420 430 L560 340 L680 410 L820 330 L960 420 L1080 350 L1220 420 L1340 370 L1500 430 L1500 780 L-60 780Z"/>' +
  '<path class="f-snow" d="M272 386 L300 360 L328 386 L312 380 L300 390 L288 380Z"/>' +
  '<path class="f-snow" d="M530 366 L560 340 L590 366 L574 360 L560 370 L546 360Z"/>' +
  '<path class="f-snow" d="M790 356 L820 330 L850 356 L834 350 L820 360 L806 350Z"/>' +
  '<path class="f-snow" d="M1052 374 L1080 350 L1108 374 L1092 368 L1080 378 L1068 368Z"/>';

/** Кабинка канатки: едет по тросу туда-обратно */
const cabin = (x: number, y: number, dx: number, dy: number, delay: number) =>
  `<g class="cable" style="--dx: ${dx}px; --dy: ${dy}px; animation-delay: -${delay}s">` +
  `<path class="s-wire" stroke-width="2" d="M${x} ${y} v12"/>` +
  `<rect class="f-snow" x="${x - 13}" y="${y + 10}" width="26" height="20" rx="5"/>` +
  `<rect class="f-win-base" x="${x - 9}" y="${y + 14}" width="18" height="7" rx="2"/>` +
  '</g>';

const mid =
  '<path class="f-mid" d="M-60 610 C140 500 320 450 520 470 C700 488 820 540 920 600 L920 780 L-60 780Z"/>' +
  '<path class="f-mid2" d="M700 640 C860 520 1060 470 1260 486 C1380 496 1440 520 1500 560 L1500 780 L700 780Z"/>' +
  // Трос канатки и кабинки
  '<path class="s-wire" stroke-width="2" fill="none" d="M140 600 L620 440"/>' +
  cabin(150, 597, 420, -140, 0) +
  cabin(150, 597, 420, -140, 11);

/** Пальма: изогнутый ствол и веер листьев */
const palm = (x: number, base: number, h: number, lean: number) => {
  const top = `${x + lean} ${base - h}`;
  return (
    `<path class="s-near" stroke-width="9" fill="none" stroke-linecap="round" d="M${x} ${base} Q${x + lean * 0.2} ${base - h * 0.6} ${top}"/>` +
    repeat(
      6,
      (i) =>
        `<path class="f-mid2" transform="translate(${top}) rotate(${-150 + i * 50})" d="M0 0 C20 -12 52 -10 74 8 C50 2 22 6 0 0Z"/>`,
    )
  );
};

const city =
  // Морской вокзал: колоннада, башня, шпиль со звездой
  '<rect class="f-city" x="560" y="570" width="320" height="120"/>' +
  '<rect class="f-city2" x="550" y="560" width="340" height="12"/>' +
  repeat(
    10,
    (i) =>
      `<rect class="f-win-base" x="${574 + i * 30}" y="600" width="14" height="70"/><rect class="f-win" x="${574 + i * 30}" y="600" width="14" height="70"/>`,
  ) +
  '<rect class="f-city" x="690" y="440" width="60" height="122"/>' +
  '<rect class="f-city2" x="684" y="432" width="72" height="10"/>' +
  '<rect class="f-city" x="704" y="380" width="32" height="54"/>' +
  '<path class="f-roof" d="M704 380 L720 250 L736 380Z"/>' +
  '<path class="f-city2" d="M720 236 L724 246 L734 246 L726 252 L729 262 L720 256 L711 262 L714 252 L706 246 L716 246Z"/>' +
  windows(702, 460, 2, 3, 22, 30, 12, 18) +
  palm(470, 690, 170, 30) +
  palm(950, 690, 190, -36) +
  palm(1040, 690, 150, 24);

/** Яхта с парусом — покачивается на волнах */
const yacht =
  '<g class="bob"><g transform="translate(1120 650)">' +
  '<path class="f-city" d="M0 40 L120 40 L104 58 L12 58Z"/>' +
  '<path class="s-wire" stroke-width="3" d="M60 40 V-60"/>' +
  '<path class="f-snow" d="M64 -56 L64 34 L118 34Z"/>' +
  '<path class="f-city2" d="M56 -40 L56 34 L14 34Z"/>' +
  '</g></g>';

const water =
  '<rect class="f-water" x="-60" y="688" width="1560" height="100"/>' +
  '<g fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2" stroke-linecap="round"><path class="shim" d="M120 720 h120 M460 734 h160 M800 714 h120 M1180 740 h140"/></g>' +
  yacht;

/** Лист пальмы и цветок магнолии на переднем плане */
const frond = (x: number, y: number, s: number, r: number) =>
  `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">` +
  '<path class="s-near" stroke-width="4" fill="none" d="M0 0 C60 -10 120 -10 180 10"/>' +
  repeat(
    9,
    (i) =>
      `<path class="f-near" transform="translate(${20 + i * 18} ${-2 + i * 0.4}) rotate(${i % 2 ? 40 : -60})" d="M0 0 C8 -18 22 -30 36 -34 C28 -18 16 -6 0 0Z"/>`,
  ) +
  '</g>';

const magnolia = (x: number, y: number) =>
  `<g transform="translate(${x} ${y})">` +
  repeat(
    5,
    (i) =>
      `<path class="f-snow" transform="rotate(${i * 72})" d="M0 0 C-12 -14 -10 -34 0 -42 C10 -34 12 -14 0 0Z"/>`,
  ) +
  '<circle class="f-grape" r="6"/></g>';

const near =
  frond(-40, 760, 1.6, -30) +
  frond(1500, 720, 1.5, -150) +
  magnolia(120, 720) +
  magnolia(1360, 700);

export const art: SceneArt = { far, mid, city, water, near };
