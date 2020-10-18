import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Translation } from 'react-i18next'
import { History } from 'history'
import { DropdownButton, Dropdown } from 'react-bootstrap'

import './index.scss'

import { Recipe } from '../../typings/Recipe'
import { Tag } from '../../typings/Tag'
import { AppDispatch, AppState } from '../../store'
import { getCurrentTag, getTags } from '../../store/selectors/tags'
import { RecipeService } from '../../services/RecipeService'
import { sortByTitle } from '../../utils/sortByTitle'
import { NotificationService } from '../../services/NotificationService'
import UserOnly from '../UserOnly'
import { setCurrentTag } from '../../store/actions/tags'
import { getCurrentUser } from '../../store/selectors/session'
import { UserProfile } from '../../typings/User'
import { ProfileService } from '../../services/ProfileService'
import LoadingCard from '../LoadingCard'
import BlankSlate from '../BlankSlate'

const mapState = (state: AppState) => ({
  selectedTag: getCurrentTag(state),
  tags: getTags(state),
  user: getCurrentUser(state),
})

const mapDispatch = (dispatch: AppDispatch) => ({
  onSelectTag: (tag: Tag | null) => dispatch(setCurrentTag(tag))
})

interface Props extends ReturnType<typeof mapState>, ReturnType<typeof mapDispatch> {
  userId: string
  tag?: string
  history: History
}

interface State {
  recipesLoaded: boolean
  recipes: Recipe[]
  filteredRecipes: Recipe[]
  ownerProfile: UserProfile | null
}

class RecipeList extends React.PureComponent<Props, State> {

  state = {
    recipesLoaded: false,
    recipes: [] as Recipe[],
    filteredRecipes: [] as Recipe[],
    ownerProfile: null
  }

  async componentDidMount() {
    const { userId, user: currentUser } = this.props

    this.fetchRecipes(userId)

    if (userId !== currentUser?.id) {
      this.fetchOwnerProfile(userId)
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    const { userId, selectedTag } = this.props

    if (prevProps.userId !== userId) {
      this.fetchRecipes(userId)
    }

    if (prevProps.selectedTag?._id !== selectedTag?._id) {
      const { recipes } = this.state
      const filteredRecipes = this.filterRecipes(recipes)
      this.setState({ filteredRecipes })
    }
  }

  select(recipe: Recipe): void {
    this.props.history.push('/recipes/detail', recipe._id)
  }

  private filterRecipes(recipes: Recipe[]): Recipe[] {
    const { selectedTag } = this.props

    if (!selectedTag) return recipes

    return recipes.filter(recipe => recipe.tags.find(tagId => selectedTag._id === tagId))
  }

  private async fetchRecipes(userId: string) {
    try {
      const recipes = await RecipeService.query({ userId })

      const filteredRecipes = this.filterRecipes(recipes)

      this.setState({
        recipes,
        filteredRecipes,
        recipesLoaded: true,
      })
    } catch (error) {
      NotificationService.notify(error.message)
    }
  }

  private async fetchOwnerProfile(userId: string) {
    try {
      const ownerProfile = await ProfileService.get(userId)

      this.setState({ ownerProfile })
    } catch (error) {
      NotificationService.notify(error.message)
    }
  }

  render() {
    const { selectedTag, tags, onSelectTag } = this.props
    const { recipes, filteredRecipes, recipesLoaded, ownerProfile } = this.state

    return (
      <Translation>
        {
          (t) => (
            <div className="RecipeList">
              <div className="c-header">
                <h2>{ownerProfile ? t('home.titleFromOwner', { name: (ownerProfile! as UserProfile).name }) : t('home.title')}</h2>

                <UserOnly>
                  <ul className="actions">
                    <li>
                      <Link to="/recipes/add" className="btn btn-icon-text btn-link"><i
                        className="zmdi zmdi-plus"/> {t('common.actions.add')}</Link>
                    </li>
                  </ul>
                </UserOnly>
              </div>

              <div className="action-header card">
                <DropdownButton id="dropdown-tags" title={selectedTag ? selectedTag.name : t('home.allRecipes')}>
                  <Dropdown.Item key="all" active={!selectedTag} onClick={() => onSelectTag(null)}>{t('home.allRecipes')}</Dropdown.Item>

                  {tags.map(tag => (
                    <Dropdown.Item key={tag._id} active={!!selectedTag && selectedTag._id === tag._id} onClick={() => onSelectTag(tag)}>{tag.name}</Dropdown.Item>
                  ))}
                </DropdownButton>
              </div>

              <div className="row">
                {filteredRecipes.sort(sortByTitle).map(recipe => (
                  <Link to={`/recipes/detail/${recipe._id}`} key={recipe._id} className="col-md-4 col-sm-6">
                    <div>
                      <div className="card recipe"
                           style={{ backgroundImage: (recipe.image ? 'url(' + recipe.image + ')' : undefined) }}>
                        <div className="card-header">
                          <h2>{recipe.title}</h2>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {!filteredRecipes.length && (
                !recipesLoaded
                  ? (<LoadingCard text={t('home.loading')} />)
                  : (
                    <>
                      {!recipes.length && (
                        <BlankSlate
                          icon="zmdi-cutlery"
                          text={t('home.empty')}
                          button={
                            <Link to="/recipes/add" className="btn btn-primary btn-icon-text waves-effect">
                              <i className="zmdi zmdi-plus"/> {t('home.addRecipe')}
                            </Link>
                          }
                        />
                      )}

                      {selectedTag && (<BlankSlate icon="zmdi-folder-outline" text={t('home.emptyCategory')} />)}
                    </>
                  )
              )}
            </div>
          )}
      </Translation>
    )
  }
}

export default connect(mapState, mapDispatch)(RecipeList)