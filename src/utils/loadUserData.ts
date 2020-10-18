import { CookingRecipeService } from '../services/CookingRecipeService'
import { TagService } from '../services/TagService'

export async function loadUserData() {
  return Promise.all([
    CookingRecipeService.query(),
    TagService.query(),
  ])
}