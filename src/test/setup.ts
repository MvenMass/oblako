import '@testing-library/jest-dom/vitest';

// jsdom не реализует matchMedia — нужен GSAP и хукам движения
if (typeof window.matchMedia !== 'function') {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

// jsdom не рисует на canvas — без заглушки getContext пишет ошибки в консоль
HTMLCanvasElement.prototype.getContext = (() =>
  null) as typeof HTMLCanvasElement.prototype.getContext;

// jsdom не умеет прокручивать к элементу
if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = () => {};
