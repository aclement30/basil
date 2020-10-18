import { FoodItem } from './FoodItem'

export interface Ingredient extends FoodItem {
  description: string
  container?: any
  type?: string
}

export interface RecipeSummary {
  _id: string
  title: string
  image: string
  multiplier?: number
  started?: string
}

export interface Recipe extends RecipeSummary {
  cookTime: number
  prepTime: number
  totalTime: number
  recipeYield: number
  ingredientsUnit: string
  ingredients: Ingredient[]
  recipeInstructions: string[]
  notes: string
  rating: number
  originalUrl: string
  tags: String[]
  user: string
  created: Date
  isDeleted: boolean
}

export interface DraftRecipe extends Recipe {
  combinedIngredients: string
  combinedInstructions: string
}
