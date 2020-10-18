import * as ingredientParser from '../utils/ingredient.parser'
import { GroceryItem } from '../typings/GroceryItem'
import { apiFetch } from '../utils/apiFetch'
import { FoodItem } from '../typings/FoodItem'

const PATH = '/groceries'

export const GroceryService = {
  query: function (): Promise<GroceryItem[]> {
    return apiFetch(PATH)
  },

  remove: async function (id: string) {
    const path = `${PATH}/${id}`

    await apiFetch(path, { method: 'DELETE' })
  },

  add: function (items: FoodItem[]): Promise<GroceryItem[]> {
    return apiFetch(PATH, {
      method: 'POST',
      body: items,
    })
  },

  parse: function (text: string): GroceryItem {
    let parsedIngredient: GroceryItem

    try {
      parsedIngredient = ingredientParser.parse(text.trim()) as any
    } catch (error) {
      parsedIngredient = { name: text.trim() }
    }

    return parsedIngredient
  },

  toggleItem: function (item: GroceryItem): Promise<GroceryItem> {
    const path = `${PATH}/${item._id}/toggle`

    return apiFetch(path, { method: 'PATCH' })
  },

  clearCrossedItems: async function () {
    const path = `${PATH}/clear`

    await apiFetch(path, { method: 'DELETE' })
  },

  update: function (item: GroceryItem): Promise<GroceryItem> {
    const path = `${PATH}/${item._id}`

    return apiFetch(path, { method: 'PUT' })
  },
}