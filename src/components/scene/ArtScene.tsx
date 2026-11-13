import type { SceneArt } from './art/types';
import { Layer } from './SceneFrame';

// Разметка — наша собственная статика из docs/design, без пользовательских данных
const html = (markup: string) => ({ __html: markup });

/** Сцена из готового арта: 4 слоя параллакса (8 / 18 / 30 / 56 px) и вода */
export function ArtScene({ art }: { art: SceneArt }) {
  return (
    <>
      <Layer depth={8}>
        <g dangerouslySetInnerHTML={html(art.far)} />
      </Layer>
      <Layer depth={18}>
        <g dangerouslySetInnerHTML={html(art.mid)} />
      </Layer>
      <Layer depth={30}>
        <g dangerouslySetInnerHTML={html(art.city)} />
      </Layer>
      <g dangerouslySetInnerHTML={html(art.water)} />
      <Layer depth={56}>
        <g dangerouslySetInnerHTML={html(art.near)} />
      </Layer>
    </>
  );
}
