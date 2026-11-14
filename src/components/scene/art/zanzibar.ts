// Занзибар: ровная линия горизонта, белые дома Стоун-Тауна и минарет,
// бирюзовый океан с отмелью, доу с треугольным парусом, пальмы и гибискус.
// Доу медленно плывёт, пальмы качаются.
import { repeat, windows } from './draw';
import type { SceneArt } from './types';

// Горизонт — низкая полоса берега без гор
const far = '<rect class="f-far" x="-60" y="560" width="1560" height="20"/>';

/** Белый дом Стоун-Тауна: плоская крыша, резная дверь */
const stone = (x: number, w: number, h: number, i: number) =>
  `<rect class="${i % 2 ? 'f-city2' : 'f-city'}" x="${x}" y="${600 - h}" width="${w}" height="${h}"/>` +
  `<rect class="f-wood" x="${x + w / 2 - 9}" y="${574}" width="18" height="26"/>` +
  windows(
    x + 10,
    600 - h + 14,
    Math.floor((w - 20) / 22) + 1,
    Math.max(1, Math.floor((h - 50) / 30)),
    22,
    30,
    12,
    16,
  );

const mid =
  '<path class="f-mid" d="M-60 610 C300 590 700 586 1100 592 C1300 596 1420 600 1500 604 L1500 640 L-60 640Z"/>' +
  repeat(6, (i) => stone(560 + i * 74, 70, 70 + ((i * 29) % 50), i)) +
  // Минарет
  '<rect class="f-city" x="760" y="430" width="22" height="120"/>' +
  '<rect class="f-city2" x="754" y="470" width="34" height="6"/>' +
  '<path class="f-roof" d="M758 430 L771 396 L784 430Z"/>' +
  '<rect class="f-win" x="768" y="440" width="6" height="90"/>';

/** Пальма: ствол и листья, крона качается */
const palm = (x: number, base: number, h: number, lean: number, delay: number) => {
  const tx = x + lean;
  const ty = base - h;
  return (
    `<path class="s-near" stroke-width="10" fill="none" stroke-linecap="round" d="M${x} ${base} Q${x + lean * 0.2} ${base - h * 0.6} ${tx} ${ty}"/>` +
    `<g class="sway2" style="transform-origin: ${tx}px ${ty}px; animation-delay: -${delay}s">` +
    repeat(
      7,
      (i) =>
        `<path class="f-near" transform="translate(${tx} ${ty}) rotate(${-170 + i * 45})" d="M0 0 C22 -14 60 -12 86 10 C58 2 24 6 0 0Z"/>`,
    ) +
    '</g>'
  );
};

const city =
  palm(1180, 690, 230, -40, 0) + palm(1290, 690, 280, 30, 1.6) + palm(240, 690, 210, 36, 0.8);

/** Доу: изогнутый корпус и треугольный парус */
const dhow =
  '<g class="ferry" style="--run: 420px"><g class="bob"><g transform="translate(300 650)">' +
  '<path class="f-wood" d="M0 30 C30 46 130 46 170 24 L160 40 C120 56 40 56 8 42Z"/>' +
  '<path class="s-wire" stroke-width="3" d="M80 36 V-60"/>' +
  '<path class="f-snow" d="M84 -58 L84 28 L150 28 C140 0 116 -34 84 -58Z"/>' +
  '</g></g></g>';

const water =
  '<rect class="f-water" x="-60" y="640" width="1560" height="150"/>' +
  // Отмель — светлая полоса бирюзы
  '<path class="f-city" opacity=".35" d="M-60 660 C300 650 700 676 1100 664 C1300 658 1420 666 1500 662 L1500 690 L-60 690Z"/>' +
  '<g fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2" stroke-linecap="round"><path class="shim" d="M100 712 h120 M480 730 h160 M860 712 h120 M1200 742 h140"/></g>' +
  dhow;

/** Цветок гибискуса */
const hibiscus = (x: number, y: number, s: number) =>
  `<g transform="translate(${x} ${y}) scale(${s})">` +
  repeat(
    5,
    (i) =>
      `<path class="f-grape" transform="rotate(${i * 72})" d="M0 0 C-18 -10 -20 -36 0 -44 C20 -36 18 -10 0 0Z"/>`,
  ) +
  '<path class="s-wire" stroke-width="2" d="M0 0 L18 -26"/><circle class="f-city2" cx="18" cy="-26" r="3"/></g>';

const near =
  '<path class="f-near" d="M-60 780 C20 720 90 700 160 730 C120 750 60 770 -60 780Z"/>' +
  '<path class="f-near" d="M1500 780 C1420 714 1350 700 1290 726 C1330 750 1400 772 1500 780Z"/>' +
  hibiscus(110, 720, 1.2) +
  hibiscus(40, 680, 0.9) +
  hibiscus(1360, 710, 1.1);

export const art: SceneArt = { far, mid, city, water, near };
