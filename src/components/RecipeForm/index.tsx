import React from 'react'
import { Translation } from 'react-i18next'
import { Tab, Tabs } from 'react-bootstrap'
import { connect } from 'react-redux'

import './index.scss'

import WebImportTab from './WebImportTab'
import FormTab from './FormTab'
import { RecipeService } from '../../services/RecipeService'
import { Dialog } from '../../services/Dialog'
import { NotificationService } from '../../services/NotificationService'
import { DraftRecipe } from '../../typings/Recipe'
import { AppState } from '../../store'
import { getTags } from '../../store/selectors/tags'

const mapState = (state: AppState) => ({
  tags: getTags(state),
})

interface Props extends ReturnType<typeof mapState> {
  navigate(path: string): void
  recipeId?: string
}

interface State {
  recipe: DraftRecipe | null
  tab: 'web-import' | 'form'
  saving: boolean
  validated: boolean
}

class RecipeForm extends React.Component<Props, State> {

  formRef = React.createRef<any>()

  state = {
    recipe: null,
    tab: 'web-import' as any,
    saving: false,
    validated: false,
  }

  async componentDidMount() {
    const { recipeId } = this.props

    let recipe: DraftRecipe
    if (recipeId) {
      this.setState({ tab: 'form' })

      recipe = await RecipeService.get(recipeId) as any

      recipe.combinedIngredients = recipe.ingredients.map(({ description }) => description).join('\n')
      recipe.combinedInstructions = recipe.recipeInstructions.join('\n')
    } else {
      recipe = {} as any
    }

    this.setState({ recipe })
  }

  onRecipeChange = (recipe: DraftRecipe) => {
    this.setState({ recipe })
  }

  onImportRecipe = (recipe: DraftRecipe) => {
    this.setState({ recipe, tab: 'form' })
  }

  remove = async () => {
    const { navigate } = this.props
    const { recipe } = this.state

    const confirmed = await Dialog.confirm('recipeForm.askDeleteRecipe')

    if (confirmed) {
      try {
        await RecipeService.delete((recipe! as DraftRecipe)._id)

        NotificationService.notify('recipeForm.recipeDeleted')
        navigate('/recipes')
      } catch (error) {
        NotificationService.notify(error.message)
      }
    }
  }

  submit = async (event) => {
    const { navigate } = this.props
    const { recipe } = this.state
    const form = this.formRef.current

    event.preventDefault()
    event.stopPropagation()

    if (!form.checkValidity()) {
      this.setState({ validated: true })

      return
    }

    // @ts-ignore
    const isExisting: boolean = !!recipe._id
    this.setState({ saving: true })

    try {
      const savedRecipe = await RecipeService.save(recipe!)

      NotificationService.notify(isExisting ? 'recipeForm.recipeSaved': 'recipeForm.recipeAdded')

      navigate(`/recipes/detail/${savedRecipe._id}`)
    } catch (error) {
      NotificationService.notify(error.message)
      this.setState({ saving: false })
    }
  }

  render() {
    const { tags } = this.props
    const { recipe, tab, saving, validated } = this.state

    if (!recipe) return null

    return (
      <Translation>
        {
          (t) => (
            <div className="RecipeForm">
              <div className="c-header">
                <h2>{t((recipe! as DraftRecipe)._id ? 'recipeForm.editTitle' : 'recipeForm.createTitle')}</h2>

                <ul className="actions a-alt">
                  <li>
                    <button type="submit" className="btn btn-icon-text btn-link" onClick={this.submit} disabled={saving || tab !== 'form'}>
                      <i className="zmdi zmdi-check"/> {t('common.actions.save')}
                    </button>
                  </li>
                </ul>
              </div>

              <div className="card">
                <div className="card-body card-padding">
                  <Tabs defaultActiveKey="web-import" id="tabs" activeKey={tab} onSelect={(key: string | null) => this.setState({ tab: key! as any })}>
                    <Tab eventKey="web-import" title={t('recipeForm.webRecipe')}>
                      <WebImportTab onImport={this.onImportRecipe} />
                    </Tab>
                    <Tab eventKey="form" title={t('recipeForm.newRecipe')}>
                      <FormTab ref={this.formRef} recipe={recipe!} onChange={this.onRecipeChange} formValidated={validated} tags={tags} />
                    </Tab>
                  </Tabs>
                </div>
              </div>

              {(recipe! as DraftRecipe)._id &&
              <div className="text-center delete-button-container">
                <button type="button" className="btn btn-warning btn-icon-text waves-effect" onClick={this.remove}><i
                  className="zmdi zmdi-delete"/> {t('recipeForm.deleteRecipe')}</button>
              </div>
              }
            </div>
          )
        }
      </Translation>
    )
  }
}

export default connect(mapState)(RecipeForm)