import React, { useCallback } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import MainLayout from '../layouts/MainLayout'
import RecipeForm from '../components/RecipeForm'

export default function() {
  const { recipeId } = useParams<any>()
  const history = useHistory()

  const navigate = useCallback((path: string) => {
    history.push(path)
  }, [history])

  return (
    <MainLayout>
      <RecipeForm recipeId={recipeId} navigate={navigate} />
    </MainLayout>
  )
}
