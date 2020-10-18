import * as convert from 'convert-units'
import i18n from '../i18n'
import { Ingredient } from '../typings/Recipe'

interface IUnitType {
  name: string
  units: string[]
  baseUnit?: string
}

interface IUnitTypes {
  VOLUME: IUnitType
  MASS: IUnitType
  ITEM: IUnitType
}

export const UNIT_TYPES: IUnitTypes = {
  VOLUME: {
    name: 'VOLUME',
    units: convert().possibilities('volume'),
    baseUnit: 'ml',
  },
  MASS: {
    name: 'MASS',
    units: convert().possibilities('mass'),
    baseUnit: 'g',
  },
  ITEM: {
    name: 'ITEM',
    units: ['box', 'tablet', 'pinch'],
  },
}

export function ingredientUnit(value: string): string {
  switch (value) {
    case 'cup':
    case 'box':
    case 'tablet':
    case 'bit':
    case 'packet':
    case 'tsp':
    case 'tbsp':
    case 'pinch':
      return i18n.t(`units.${value}`)
    default:
      return value
  }
}

export function ingredientUnitType(ingredient: Ingredient): IUnitType {
  if (!ingredient.unit) {
    return UNIT_TYPES.ITEM
  }

  if (UNIT_TYPES.VOLUME.units.indexOf(ingredient.unit)) {
    return UNIT_TYPES.VOLUME
  } else if (UNIT_TYPES.MASS.units.indexOf(ingredient.unit)) {
    return UNIT_TYPES.MASS
  } else {
    return UNIT_TYPES.ITEM
  }
}