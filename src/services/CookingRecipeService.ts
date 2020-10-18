import { Recipe, RecipeSummary } from '../typings/Recipe'
import { apiFetch } from '../utils/apiFetch'
import store from '../store'
import { setCookingRecipes, stopCooking, startCooking, updateServings } from '../store/actions/cookingRecipes'

const PATH = '/cookingRecipes'

export const CookingRecipeService = {
  query: async function(): Promise<RecipeSummary[]> {
    const recipes = await apiFetch(PATH)

    store.dispatch(setCookingRecipes(recipes))

    return recipes
  },

  startCooking: async function(recipe: Recipe, multiplier: number) {
    const path = `${PATH}/${recipe._id}/startCooking`

    await apiFetch(path, { method: 'PATCH', body: { multiplier } })

    store.dispatch(startCooking(recipe, multiplier))
  },

  stopCooking: async function (recipe: Recipe) {
    const path = `${PATH}/${recipe._id}/stopCooking`

    await apiFetch(path, { method: 'PATCH' })

    store.dispatch(stopCooking(recipe))
  },

  updateServings: async function (recipe: Recipe, multiplier: number) {
    const path = `${PATH}/${recipe._id}/servings`

    await apiFetch(path, { method: 'PATCH', body: { multiplier } })

    store.dispatch(updateServings(recipe, multiplier))
  },
}