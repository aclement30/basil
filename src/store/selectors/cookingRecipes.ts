import { AppState } from '../index'
import { RecipeSummary } from '../../typings/Recipe'

export const getCookingRecipes = (state: AppState): RecipeSummary[] => (state.cookingRecipes.list)
export const getCurrentCookingRecipe = (state: AppState): RecipeSummary | null => (state.cookingRecipes.current)
