/** Слои нарисованной сцены: статическая SVG-разметка (внутренность <g>) */
export interface SceneArt {
  far: string;
  mid: string;
  city: string;
  /** Вода — без параллакса, между городом и передним планом */
  water: string;
  near: string;
}
