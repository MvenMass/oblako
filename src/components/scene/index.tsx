import type { ComponentType, ReactNode } from 'react';
import { GenericScene } from './GenericScene';

/** Сцены городов по id. Пока своей нет — общая сцена в цветах темы. */
const SCENES: Record<string, ComponentType> = {};

export function renderScene(cityId: string): ReactNode {
  const Scene = SCENES[cityId] ?? GenericScene;
  return <Scene />;
}
