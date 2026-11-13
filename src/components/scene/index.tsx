import type { ReactNode } from 'react';
import { ArtScene } from './ArtScene';
import { GenericScene } from './GenericScene';
import { art as istanbul } from './art/istanbul';
import { art as kazan } from './art/kazan';
import { art as sochi } from './art/sochi';
import { art as tbilisi } from './art/tbilisi';
import { art as yerevan } from './art/yerevan';
import type { SceneArt } from './art/types';

/** Нарисованные сцены по id. Пока своей нет — общая сцена в цветах темы. */
const ARTS: Record<string, SceneArt> = { tbilisi, istanbul, kazan, yerevan, sochi };

export function renderScene(cityId: string): ReactNode {
  const art = ARTS[cityId];
  return art ? <ArtScene art={art} /> : <GenericScene />;
}
