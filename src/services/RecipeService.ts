import { Recipe, Ingredient, DraftRecipe } from '../typings/Recipe'
import { apiFetch } from '../utils/apiFetch'
import { FoodItem } from '../typings/FoodItem'
import { ingredientUnitType } from '../utils/ingredientUnit'

export interface RecipeImportResult {
  url: string
  recipe?: DraftRecipe
  errorMessage?: string
}

export const ignoredGroceryItems = [
  'sel',
  'salt',
  'sel et poivre',
  'salt and pepper',
  'poivre',
  'pepper',
  'poivre du moulin',
  'poivre noir',
  'black pepper',
  'poivre noir du moulin',
  'huile d\'olive',
  'olive oil',
  'huile',
  'oil',
  'sucre',
  'sugar',
  'farine',
  'floor',
  'eau',
  'water',
]

const PATH = '/recipes'

export const RecipeService = {
  query: function (params: any): Promise<Recipe[]> {
    return apiFetch(PATH, { params })
  },

  get: async function (id: string): Promise<Recipe> {
    const path = `${PATH}/${id}`

    const recipe: Recipe = await apiFetch(path)

    return recipe
  },

  delete: async function (id: string) {
    const path = `${PATH}/${id}`

    await apiFetch(path, { method: 'DELETE' })
  },

  save: async function (recipe: DraftRecipe): Promise<Recipe> {
    if (recipe._id) {
      return RecipeService.update(recipe)
    }

    return RecipeService.create(recipe)
  },

  create: async function (recipe: DraftRecipe): Promise<Recipe> {
    const createdRecipe: Recipe = await apiFetch(PATH, { method: 'POST', body: recipe })

    return createdRecipe
  },

  update: async function (recipe: DraftRecipe): Promise<Recipe> {
    const path = `${PATH}/${recipe._id}`

    const updatedRecipe: Recipe = await apiFetch(path, { method: 'PUT', body: recipe })

    return updatedRecipe
  },

  import: async function (url: string): Promise<DraftRecipe> {
    const path = `${PATH}/import`

    const importedResult: RecipeImportResult = await apiFetch(path, { method: 'POST', body: { url } })

    const { recipe } = importedResult

    return recipe!
  },

  getShoppingListFromIngredients: function (ingredients: Ingredient[], multiplier: number): FoodItem[] {
    const items: FoodItem[] = []

    ingredients.forEach((item) => {

      // Remove quantity for mass/volume measured ingredients
      if (ingredientUnitType(item).name !== 'ITEM') {
        item.quantity = undefined
      } else {
        item.quantity = item.quantity! * multiplier
      }

      // Ignore basic ingredients such as water, salt, etc
      if (ignoredGroceryItems.indexOf(item.name) < 0) {
        items.push(item)
      }
    })

    return items
  },
}