import React from 'react'
import { Router } from 'react-router'
import { Switch, Redirect, Route } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import { GoogleAuthService } from '../services/GoogleAuthService'
import { NotificationService } from '../services/NotificationService'

import LoginPage from './LoginPage'
import PrivateRoute from '../components/PrivateRoute'
import HomePage from './HomePage'
import RecipeDetailPage from './RecipeDetailPage'
import RecipeFormPage from './RecipeFormPage'
import { loadUserData } from '../utils/loadUserData'
import { getCurrentUser } from '../store/selectors/session'
import store from '../store'
import GroceriesPage from './GroceriesPage'

const history = createBrowserHistory()

class Root extends React.PureComponent {

  constructor(props) {
    super(props)

    GoogleAuthService.init(history)
  }

  async componentDidMount() {
    try {
      await GoogleAuthService.fetchUser()
    } catch (error) {
      if (error.message !== 'Unauthorized') {
        NotificationService.notify(error.message)
      }
    }

    const user = getCurrentUser(store.getState())
    if (user) {
      // Load initial user data
      await loadUserData()
    }
  }

  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route path="/login">
            <LoginPage />
          </Route>

          <PrivateRoute exact path={['/recipes']}>
            <HomePage />
          </PrivateRoute>

          <Route exact path={['/recipes/user/:userId']}>
            <HomePage />
          </Route>

          <Route path={['/recipes/detail/:recipeId']}>
            <RecipeDetailPage />
          </Route>

          <PrivateRoute path={['/recipes/add', '/recipes/edit/:recipeId']}>
            <RecipeFormPage />
          </PrivateRoute>

          <PrivateRoute exact path={['/groceries']}>
            <GroceriesPage />
          </PrivateRoute>

          <Redirect from='/' to='/recipes' />
        </Switch>
      </Router>
    )
  }
}

export default Root
