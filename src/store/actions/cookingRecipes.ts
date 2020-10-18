import { Action } from 'redux'
import { RecipeSummary } from '../../typings/Recipe'

export interface ActionWithRecipe extends Action {
  recipes?: RecipeSummary[]
  recipe?: RecipeSummary
  multiplier?: number
}

export const SET_COOKING_RECIPES = 'SET_COOKING_RECIPES'
export const START_COOKING = 'START_COOKING'
export const STOP_COOKING = 'STOP_COOKING'
export const UPDATE_SERVINGS = 'UPDATE_SERVINGS'
export const SET_CURRENT_RECIPE = 'SET_CURRENT_RECIPE'
export const RESET_CURRENT_RECIPE = 'RESET_CURRENT_RECIPE'

export const setCookingRecipes = (recipes: RecipeSummary[]): ActionWithRecipe => ({
  type: SET_COOKING_RECIPES,
  recipes
})

export const startCooking = (recipe: RecipeSummary, multiplier: number): ActionWithRecipe => ({
  type: START_COOKING,
  recipe,
  multiplier,
})

export const stopCooking = (recipe: RecipeSummary): ActionWithRecipe => ({
  type: STOP_COOKING,
  recipe,
})

export const updateServings = (recipe: RecipeSummary, multiplier: number): ActionWithRecipe => ({
  type: UPDATE_SERVINGS,
  recipe,
  multiplier,
})

export const setCurrentRecipe = (recipe: RecipeSummary): ActionWithRecipe => ({
  type: SET_CURRENT_RECIPE,
  recipe,
})

export const resetCurrentRecipe = (): ActionWithRecipe => ({
  type: RESET_CURRENT_RECIPE,
})