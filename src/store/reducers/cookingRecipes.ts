import moment from 'moment'

import { RecipeSummary } from '../../typings/Recipe'
import {
  ActionWithRecipe,
  RESET_CURRENT_RECIPE,
  SET_COOKING_RECIPES,
  SET_CURRENT_RECIPE,
  START_COOKING,
  STOP_COOKING,
  UPDATE_SERVINGS
} from '../actions/cookingRecipes'
import { sortByText } from '../../utils/sortByTitle'

export interface CookingRecipesState {
  list: RecipeSummary[]
  current: RecipeSummary | null
}

const initialState: CookingRecipesState = {
  list: [] as any[],
  current: null,
}

export default function(state: CookingRecipesState = initialState, action: ActionWithRecipe): CookingRecipesState {
  switch (action.type) {
    case SET_COOKING_RECIPES:
      return {
        ...state,
        list: action.recipes!.slice().sort(sortByText('started')).reverse(),
      }

    case START_COOKING: {
      const INDEX = state.list.findIndex(recipe => (recipe._id === action.recipe!._id))
      const updatedList = state.list.slice()

      if (INDEX < 0) {
        const recipeSummary = {
          ...action.recipe,
          multiplier: action.multiplier,
          started: moment().toISOString(),
        } as RecipeSummary

        updatedList.push(recipeSummary)
      }

      return {
        ...state,
        list: updatedList,
      }
    }

    case STOP_COOKING:
      return {
        ...state,
        list: state.list.filter(recipe => (recipe._id !== action.recipe!._id))
      }

    case UPDATE_SERVINGS: {
      const INDEX = state.list.findIndex(recipe => (recipe._id === action.recipe!._id))
      const updatedList = state.list.slice()
      updatedList[INDEX].multiplier = action.multiplier

      return {
        ...state,
        list: updatedList,
      }
    }

    case SET_CURRENT_RECIPE:
      return {
        ...state,
        current: action.recipe!,
      }

    case RESET_CURRENT_RECIPE:
      return {
        ...state,
        current: null,
      }

    default:
      return state
  }
}
