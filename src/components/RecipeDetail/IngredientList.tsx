import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DropdownButton, Dropdown } from 'react-bootstrap'

import './IngredientList.scss'
import { Recipe } from '../../typings/Recipe'
import { ServingOption } from './index'
import { ingredientUnit } from '../../utils/ingredientUnit'
import { multiplyIngredient } from '../../utils/multiplyIngredient'

interface Props {
  recipe: Recipe
  servingMultiplier: number | null
  changeServing(serving: ServingOption): void
  addIngredientsToShoppingList(serving: ServingOption): void
}

function getServingOptionForServing(recipe: Recipe, serving: number): ServingOption {
  let label = `${serving} portion`
  if (serving > 1) {
    label += 's'
  }

  return { label, multiplier: (serving / recipe.recipeYield) }
}

function getServingOptionForYield(recipeYield: number): ServingOption {
  return { label: `${recipeYield} x`, multiplier: recipeYield }
}

export default React.memo<Props>(({ recipe, servingMultiplier, changeServing, addIngredientsToShoppingList }) => {
  const { t } = useTranslation()
  const [showServingMenu, setOpen] = useState<boolean>(false)
  const toggleServingMenu = () => setOpen(!showServingMenu)

  const servingOptions: ServingOption[] = useMemo(() => {
    const options = [] as ServingOption[]

    if (recipe.recipeYield) {
      for (let i = 1; i <= (recipe.recipeYield * 2); i++) {
        options.push(getServingOptionForServing(recipe, i))
      }
    } else {
      for (let i = 1; i <= 4; i++) {
        options.push(getServingOptionForYield(i))
      }
    }

    return options
  }, [recipe])

  const serving: ServingOption = useMemo(() => {
    const multiplier = servingMultiplier || 1

    return servingOptions.find(option => (option.multiplier === multiplier))!
  }, [servingMultiplier, servingOptions])

  return (
    <div className="IngredientList pmo-block">
      <h2>
        <span>{t('common.ingredients')}</span>

        <DropdownButton id="recipe-multiplier" title={serving.label} className="multiplier">
          {servingOptions.map(option => (
            <Dropdown.Item
              key={option.multiplier}
              onClick={() => {
                toggleServingMenu()
                changeServing(option)
              }}
              active={serving.multiplier === option.multiplier}
              className={serving.multiplier === option.multiplier ? ' selected' : ''}
            >
              {option.label}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </h2>

      <ul className="ingredients">
        {recipe.ingredients.map((ingredient, i) => (
          <li key={i}>
            {ingredient.quantity &&
            <div className="quantity">
              {multiplyIngredient(ingredient, serving.multiplier)}&nbsp;
              {ingredient.unit && <small className="unit">{ingredientUnit(ingredient.unit)}</small>}
            </div>
            }

            {ingredient.name ?
              <div className="ingredient-name">
                {ingredient.name}
                {ingredient.type && <span className="ingredient-type">{ingredient.type}</span>}
              </div>
              :
              <span>{ingredient.description}</span>
            }
          </li>
        ))}
      </ul>

      <button
        onClick={() => addIngredientsToShoppingList(serving)}
        className="btn btn-icon-text btn-default btn-groceries waves-effect"
      >
        <i className="zmdi zmdi-assignment-check" /> {t('recipeDetail.addShoppingList')}
      </button>
    </div>
  )
})