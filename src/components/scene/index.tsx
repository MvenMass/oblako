import type { ReactNode } from 'react';
import { ArtScene } from './ArtScene';
import { GenericScene } from './GenericScene';
import { art as istanbul } from './art/istanbul';
import { art as tbilisi } from './art/tbilisi';
import type { SceneArt } from './art/types';

/** Нарисованные сцены по id. Пока своей нет — общая сцена в цветах темы. */
const ARTS: Record<string, SceneArt> = { tbilisi, istanbul };

export function renderScene(cityId: string): ReactNode {
  const art = ARTS[cityId];
  return art ? <ArtScene art={art} /> : <GenericScene />;
}
