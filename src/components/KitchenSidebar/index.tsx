import React, { useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import moment from 'moment'

import './index.scss'

import { AppState } from '../../store'
import { getCookingRecipes } from '../../store/selectors/cookingRecipes'
import { connect } from 'react-redux'
import { UIContext } from '../../contexts/UIContext'

const mapState = (state: AppState) => ({
  cookingRecipes: getCookingRecipes(state),
})

type Props = ReturnType<typeof mapState>

const KitchenSidebar = React.memo<Props>(({ cookingRecipes }) => {
  const { kitchenSidebarVisible, toggleKitchenSidebar } = useContext<UIContext>(UIContext)
  const { recipeId: currentRecipeId } = useParams<any>()

  return (
    <div className="KitchenSidebar">
      <aside className={'pane' + (kitchenSidebarVisible ? ' toggled' : '')}>
        <ul className="sua-menu list-inline list-unstyled">
          <li>
            <button onClick={() => toggleKitchenSidebar()} data-ma-action="sidebar-close">
              <i className="zmdi zmdi-close" /> Fermer</button>
          </li>
        </ul>

        <div className="list-group lg-alt c-overflow">
          {cookingRecipes.map(recipe => (
            <Link to={'/recipes/detail/' + recipe._id} className={'list-group-item media' + (recipe._id === currentRecipeId ? ' active' : '')} key={recipe._id}>
              <div className="pull-left">
                <img className="avatar-img" src={recipe.image} />
              </div>

              <div className="media-body">
                <div className="lgi-heading">{recipe.title}</div>
                <small className="lgi-text">Commencé {moment(recipe.started).fromNow()}</small>
              </div>
            </Link>
          ))}
        </div>
      </aside>
    </div>
  )
})

export default connect(mapState)(KitchenSidebar)