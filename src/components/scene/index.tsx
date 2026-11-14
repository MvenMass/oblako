import type { ReactNode } from 'react';
import { ArtScene } from './ArtScene';
import { GenericScene } from './GenericScene';
import { art as beijing } from './art/beijing';
import { art as hanoi } from './art/hanoi';
import { art as istanbul } from './art/istanbul';
import { art as kazan } from './art/kazan';
import { art as shanghai } from './art/shanghai';
import { art as sochi } from './art/sochi';
import { art as tbilisi } from './art/tbilisi';
import { art as yerevan } from './art/yerevan';
import type { SceneArt } from './art/types';

/** Нарисованные сцены по id. Пока своей нет — общая сцена в цветах темы. */
const ARTS: Record<string, SceneArt> = {
  tbilisi,
  istanbul,
  kazan,
  yerevan,
  sochi,
  beijing,
  shanghai,
  hanoi,
};

export function renderScene(cityId: string): ReactNode {
  const art = ARTS[cityId];
  return art ? <ArtScene art={art} /> : <GenericScene />;
}
