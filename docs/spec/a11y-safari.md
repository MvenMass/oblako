# Доступность и поддержка браузеров

## Цели

- WCAG 2.1 AA.
- Lighthouse: Accessibility ≥ 95, Performance ≥ 85 на десктопе.
- Минимум Safari 14 / iOS 14, плюс последние Chrome, Firefox, Edge.

## Доступность — обязательные правила

- Только семантичные элементы: `<button>`, `<a href>`, `<input>` + `<label>`. Никаких `onClick` на `div`/`span`.
- У кнопок-иконок есть `aria-label`. Декоративные SVG помечены `aria-hidden="true"`, смысловые — `role="img"` + `aria-label`.
- Состояния:
  - тогглы — `aria-pressed`;
  - радиогруппы (месяц, компания, время суток) — `role="radiogroup"` / `role="radio"` + `aria-checked`;
  - аккордеоны — `aria-expanded`;
  - слайдер сравнения — `role="slider"` + `aria-valuenow`;
  - чат — `role="log"` + `aria-live="polite"`;
  - статусы — `role="status"`.
- Карусели: `aria-roledescription="карусель"`, неактивные слайды `aria-hidden`, управление стрелками на сфокусированном регионе (без глобальных keydown), пауза автоплея при фокусе и наведении.
- Фокус: `outline: 3px solid #C8146F; outline-offset: 3px` через `:focus-visible`.
- Контраст:
  - розовый текст и кнопки — только `#C8146F`;
  - `#E8288E` — только декор;
  - серый текст — не светлее `#45607A` на светлом фоне.
- Тач-цели ≥ 44×44.
- `prefers-reduced-motion` — см. `motion.md`.
- Язык фраз: `lang="ka"`, `lang="hy"` и т. п. на элементе с местным текстом.
- Модалки и сторис: фокус ловится внутри, Esc закрывает, после закрытия фокус возвращается на триггер.

## Safari 14 — чек-лист

- `backdrop-filter` только вместе с `-webkit-backdrop-filter`. Фолбэк `@supports not (backdrop-filter: blur(1px))` — плотный фон.
- `gap` у flex работает с Safari 14.1. Для 14.0 допустимо, но в критичных местах (кнопки, навигация) лучше grid или margin.
- `clip-path: inset()` — с префиксом `-webkit-clip-path`.
- `aspect-ratio` появился только в Safari 15, поэтому используем padding-hack или фиксированную высоту.
- `inset` поддерживается с 14.1 — для 14.0 через PostCSS-плагин или `top/right/bottom/left`.
- Нельзя: `:has()`, `@container`, CSS nesting без сборки, `structuredClone`, `Array.at()` без полифила, top-level await.
- Vite: `build.target = ['es2019', 'safari14']`, Autoprefixer с browserslist `safari >= 14, ios_saf >= 14, last 2 chrome versions, last 2 firefox versions`.
- `position: sticky` — с `-webkit-sticky`.
- Lenis отключать на тач-устройствах (`smoothTouch: false`) и при reduced motion.
- Web Speech API в Safari есть, но голоса зависят от системы.
- Canvas: учитывать `devicePixelRatio` (не больше 2).
