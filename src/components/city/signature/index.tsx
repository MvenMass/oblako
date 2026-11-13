import type { ComponentType, ReactNode } from 'react';
import { Continents } from './Continents';
import { Wine } from './Wine';

/** Тематические секции по макетам: есть только у Тбилиси и Стамбула */
const SIGNATURES: Record<string, ComponentType> = {
  tbilisi: Wine,
  istanbul: Continents,
};

export function renderSignature(cityId: string): ReactNode {
  const Signature = SIGNATURES[cityId];
  return Signature ? <Signature /> : null;
}
