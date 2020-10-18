import React from 'react'
import { connect } from 'react-redux'
import { Translation } from 'react-i18next'
import i18n from '../../i18n'
import { Link } from 'react-router-dom'

import './index.scss'

import { Recipe } from '../../typings/Recipe'
import { AppDispatch, AppState } from '../../store'
import { getTags } from '../../store/selectors/tags'
import TimerComponent from '../Timer'
import { getCookingRecipes } from '../../store/selectors/cookingRecipes'
import { getTimers } from '../../store/selectors/timers'
import { Tag } from '../../typings/Tag'
import { setCurrentRecipe } from '../../store/actions/cookingRecipes'
import { Dialog } from '../../services/Dialog'
import { TimerService } from '../../services/TimerService'
import { CookingRecipeService } from '../../services/CookingRecipeService'
import { NotificationService } from '../../services/NotificationService'
import { GroceryService } from '../../services/GroceryService'
import IngredientList from './IngredientList'
import { RecipeService } from '../../services/RecipeService'
import UserOnly from '../UserOnly'
import { UIContext } from '../../contexts/UIContext'

export interface ServingOption {
  label: string
  multiplier: number
}

const mapState = (state: AppState, ownProps) => {
  const { recipeId } = ownProps
  const cookingRecipes = getCookingRecipes(state)
  const cookingRecipe = cookingRecipes.find(recipe => (recipe._id === recipeId))

  return {
    isCooking: !!cookingRecipe,
    cookingMultiplier: (cookingRecipe && cookingRecipe.multiplier) || null,
    activeTimers: getTimers(state).filter(timer => (timer.recipeId === recipeId && !timer.completed)),
    tags: getTags(state),
  }
}

const mapDispatch = (dispatch: AppDispatch) => ({
  setCurrentRecipe: (recipe) => dispatch(setCurrentRecipe(recipe)),
})

interface Props extends ReturnType<typeof mapState>, ReturnType<typeof mapDispatch> {
  recipeId: string
}

interface State {
  recipe: Recipe | null
  selectedServing: ServingOption | null
  tags: Tag[]
}

class RecipeDetail extends React.Component<Props, State> {

  static contextType = UIContext
  context!: React.ContextType<typeof UIContext>

  state: State = {
    recipe: null,
    selectedServing: null,
    tags: []
  }

  componentDidMount() {
    const { recipeId } = this.props

    this.loadRecipe(recipeId)
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    if (prevProps.recipeId !== this.props.recipeId) {
      this.loadRecipe(this.props.recipeId)
    }
  }

  private async loadRecipe(recipeId) {
    const { tags, setCurrentRecipe } = this.props

    const recipe = await RecipeService.get(recipeId)
    const recipeTags = recipe.tags.map(id => tags.find(tag => tag._id === id)!).filter(Boolean)

    this.setState({
      recipe,
      tags: recipeTags,
    })

    setCurrentRecipe(recipe)
  }

  startCooking = async () => {
    const { recipe, selectedServing } = this.state

    const multiplier = (selectedServing && selectedServing.multiplier) || 1

    this.context.setCookMode(true)

    try {
      await CookingRecipeService.startCooking(recipe!, multiplier)
    } catch (error) {
      NotificationService.notify(error.message)
    }
  }

  stopCooking = async () => {
    const { activeTimers } = this.props
    const { recipe } = this.state

    if (activeTimers.length) {
      const message = activeTimers.length > 1 ? i18n.t('recipeDetail.manyExistingTimers', { count: activeTimers.length }) : i18n.t('recipeDetail.oneExistingTimer')

      const confirmed = await Dialog.confirm(message)
      if (confirmed) {
        activeTimers.forEach(timer => {
          TimerService.remove(timer)
        })
      }
    }

    this.context.setCookMode(false)

    try {
      await CookingRecipeService.stopCooking(recipe!)
    } catch (error) {
      NotificationService.notify(error.message)
    }
  }

  changeServing = async (serving: ServingOption) => {
    const { isCooking } = this.props
    const { recipe } = this.state

    this.setState({ selectedServing: serving })

    if (isCooking) {
      try {
        await CookingRecipeService.updateServings(recipe!, serving.multiplier)
      } catch (error) {
        NotificationService.notify(error.message)
      }
    }
  }

  addIngredientsToShoppingList = async (serving: ServingOption) => {
    const { recipe } = this.state

    const items = RecipeService.getShoppingListFromIngredients(recipe!.ingredients, serving.multiplier)

    try {
      await GroceryService.add(items)

      NotificationService.notify(i18n.t('recipeDetail.ingredientsAddedShoppingList'))
    } catch (error) {
      NotificationService.notify(error.message)
    }
  }

  render() {
    const { activeTimers, isCooking, cookingMultiplier } = this.props
    const { recipe, selectedServing, tags } = this.state

    if (!recipe) return null

    return (
      <Translation>
        {
          (t) => (
            <div className="RecipeDetail">
              <div className="c-header">
                <h2>{recipe.title}</h2>

                <UserOnly>
                  <ul className="actions a-alt">
                    <li>
                      <Link
                        to={`/recipes/edit/${recipe._id}`}
                        className="btn btn-icon btn-link"
                        title={t('recipeDetail.editRecipe')}
                      >
                        <i className="zmdi zmdi-edit"/>
                      </Link>
                    </li>
                  </ul>
                </UserOnly>
              </div>

              <div className="card">
                <div className="left">
                  <div className="recipe-picture" style={{ backgroundImage: (recipe.image ? 'url(' + recipe.image + ')' : undefined) }}>
                    {isCooking &&
                    <>
                      <div className="cooking-recipe">
                        <i className="zmdi zmdi-fire"/> <span className="hidden-xs">{t('common.recipe')} </span>{t('recipeDetail.currentRecipe')}
                      </div>

                      <button className="stop-cooking" onClick={() => this.stopCooking()}>
                        <i className="zmdi zmdi-assignment-check"/> {t('common.actions.finish')}<span className="hidden-xs"> {t('recipeDetail.finishRecipe')}</span>
                      </button>
                    </>
                    }
                  </div>

                  {!isCooking &&
                  <button onClick={() => this.startCooking()}
                          className="btn start-cooking btn-float btn-primary btn-icon waves-effect waves-circle waves-float"
                          title={t('recipeDetail.startRecipe')}>
                    <i className="zmdi zmdi-cutlery"/>
                  </button>
                  }

                  <IngredientList
                    recipe={recipe}
                    servingMultiplier={cookingMultiplier || (selectedServing && selectedServing.multiplier)}
                    changeServing={this.changeServing}
                    addIngredientsToShoppingList={this.addIngredientsToShoppingList}
                  />
                </div>

                <div className="pm-body">
                  <div className="pmb-block">
                    <div className="pmbb-header">
                      <h2>{t('common.preparation')}</h2>
                    </div>

                    <div className="pmbb-body">
                      <div className="pmbb-view">
                        <ol className="instructions">
                          {recipe.recipeInstructions.map((step, i) => (
                            <li key={i}>
                              <button className="step"><span>{(i + 1)}</span><i className="zmdi zmdi-hourglass-alt"/>
                              </button>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>

                      {recipe.notes &&
                      <div className="pmbb-view">
                        <hr/>
                        {recipe.notes}
                      </div>
                      }

                      {recipe.originalUrl &&
                      <div className="pmbb-view">
                        <hr/>
                        {t('common.source')} : <a href={recipe.originalUrl} target="_blank">{recipe.originalUrl}</a>
                      </div>
                      }

                      {!!tags.length &&
                      <div className="pmbb-view clearfix">
                        <hr/>
                        {tags.map(tag => (<div key={tag._id} className="tag">{tag.name}</div>))}
                      </div>
                      }
                    </div>

                    <div className="timers">
                      {activeTimers.map(timer => (
                        <TimerComponent key={timer.id} timer={timer}/>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
      </Translation>
    )
  }
}

export default connect(mapState, mapDispatch)(RecipeDetail)