import React from 'react'
import { useParams, useHistory, Redirect } from 'react-router-dom'

import RecipeList from '../components/RecipeList'
import { getCurrentUser } from '../store/selectors/session'
import store from '../store'
import MainLayout from '../layouts/MainLayout'
import CategorySidebar from '../components/CategorySidebar'

function HomePage() {
  const { userId, tag } = useParams<any>()
  const history = useHistory()

  if (!userId) {
    const user = getCurrentUser(store.getState())

    if (!user) return (
      <Redirect to="login" />
    )

    return (
      <Redirect to={`/recipes/user/${user.id}`} />
    )
  }

  return (
    <MainLayout sidebar={<CategorySidebar />}>
      <RecipeList userId={userId} tag={tag} history={history} />
    </MainLayout>
  )
}

export default HomePage