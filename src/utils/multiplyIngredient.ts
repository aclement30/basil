import * as Fraction from 'fraction.js'

import { Ingredient } from '../typings/Recipe'

function formatFraction(fraction: string) {
  fraction = fraction.replace('1/4', '¼')
  fraction = fraction.replace('1/2', '½')
  fraction = fraction.replace('3/4', '¾')
  fraction = fraction.replace('1/3', '⅓')
  fraction = fraction.replace('2/3', '⅔')
  fraction = fraction.replace('1/6', '⅙')
  fraction = fraction.replace('1/8', '⅛')

  return fraction
}

export function multiplyIngredient(ingredient: Ingredient, multiplier: number): string {
  if (!multiplier) {
    return ''
  }

  let newQuantity
  let matches

  if (String(ingredient.quantity).match(/^([0-9.])+$/)) {
    // @ts-ignore
    newQuantity = new Fraction(+ingredient.quantity! * multiplier)
  } else if ((matches = String(ingredient.quantity).match(/^([0-9])+\/([0-9])+$/))) {
    // @ts-ignore
    newQuantity = new Fraction(+matches[1] * multiplier, +matches[2])
  } else if ((matches = String(ingredient.quantity).match(/^([0-9])+\s([0-9])+\/([0-9])+$/))) {
    const numerator = (+matches[1] * +matches[3]) + +matches[2]
    // @ts-ignore
    newQuantity = new Fraction(numerator * multiplier, +matches[3])
  }

  return formatFraction(newQuantity.toFraction(true))
}