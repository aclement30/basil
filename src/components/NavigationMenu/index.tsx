import React, { useCallback, useContext } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import './index.scss'

import { AppState } from '../../store'
import { getCookingRecipes } from '../../store/selectors/cookingRecipes'
import { getTimers } from '../../store/selectors/timers'
import Timer from '../Timer'
import { GoogleAuthService } from '../../services/GoogleAuthService'
import { isAuthenticated } from '../../utils/isAuthenticated'
import { UIContext } from '../../contexts/UIContext'

const mapState = (state: AppState) => ({
  cookingRecipes: getCookingRecipes(state),
  timers: getTimers(state),
})

type Props = ReturnType<typeof mapState>

function NavigationMenu ({ cookingRecipes, timers }: Props) {
  const { t } = useTranslation()
  const history = useHistory()
  const { recipeId: currentRecipeId } = useParams<any>()
  const { navigationMenuVisible, toggleNavigationMenu } = useContext<UIContext>(UIContext)

  const logout = useCallback(() => {
    toggleNavigationMenu()

    GoogleAuthService.logoutUser()

    history.push('/login')
  }, [toggleNavigationMenu, history])

  const hideMenu = useCallback(() => toggleNavigationMenu(false), [toggleNavigationMenu])

  return (
    <div className={'NavigationMenu' + (navigationMenuVisible ? ' -toggled' : '')}>
      <aside className="menu">
        <div className="smm-header">
          <i className="zmdi zmdi-long-arrow-left" onClick={hideMenu} />
        </div>

        <ul className="main-menu">
          {isAuthenticated() ? (
            <>
              <li className="sub-menu recipes toggled">
                <Link to="/recipes" onClick={hideMenu}><i className="zmdi zmdi-apps" /> {t('menu.recipes')}</Link>
                <ul className="cooking-recipes">
                  {cookingRecipes.map(recipe => (
                    <li key={recipe._id}>
                      <Link to={'/recipes/detail/' + recipe._id} onClick={hideMenu} className={recipe._id === currentRecipeId ? 'active' : ''}>{recipe.title}</Link>
                    </li>
                  ))}
                </ul>
              </li>

              <li>
                <Link to="/recipes/add" onClick={hideMenu}><i className="zmdi zmdi-plus" /> {t('menu.addRecipe')}</Link>
              </li>
              <li>
                <Link to="/groceries" onClick={hideMenu}><i className="zmdi zmdi-assignment" /> {t('menu.groceriesList')}</Link>
              </li>
              <li>
                <a onClick={logout}><i className="zmdi zmdi-time-restore" /> {t('menu.logout')}</a>
              </li>
            </>
            ) : (
              <>
                <li>
                  <Link to="/login"><i className="zmdi zmdi-sign-in" /> {t('menu.login')}</Link>
                </li>
              </>
            )}
        </ul>

        <div className="timers">
          {timers.map(timer => (
            <Timer key={timer.id} timer={timer} />
          ))}
        </div>
      </aside>
    </div>
  )
}

export default connect(mapState)(NavigationMenu)