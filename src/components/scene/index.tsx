import type { ReactNode } from 'react';
import { ArtScene } from './ArtScene';
import { GenericScene } from './GenericScene';
import { art as altai } from './art/altai';
import { art as beijing } from './art/beijing';
import { art as hanoi } from './art/hanoi';
import { art as istanbul } from './art/istanbul';
import { art as kaliningrad } from './art/kaliningrad';
import { art as kazan } from './art/kazan';
import { art as shanghai } from './art/shanghai';
import { art as sochi } from './art/sochi';
import { art as tbilisi } from './art/tbilisi';
import { art as yerevan } from './art/yerevan';
import { art as zanzibar } from './art/zanzibar';
import type { SceneArt } from './art/types';

/** Нарисованные сцены по id. Общая сцена — запасная, если город добавят без арта. */
const ARTS: Record<string, SceneArt> = {
  tbilisi,
  istanbul,
  kazan,
  yerevan,
  sochi,
  beijing,
  shanghai,
  hanoi,
  zanzibar,
  altai,
  kaliningrad,
};

export function renderScene(cityId: string): ReactNode {
  const art = ARTS[cityId];
  return art ? <ArtScene art={art} /> : <GenericScene />;
}
