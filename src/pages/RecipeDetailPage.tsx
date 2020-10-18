import React from 'react'
import { useParams } from 'react-router-dom'

import MainLayout from '../layouts/MainLayout'
import RecipeDetail from '../components/RecipeDetail'
import CategorySidebar from '../components/CategorySidebar'

export default function() {
  const { recipeId } = useParams<any>()

  return (
    <MainLayout sidebar={<CategorySidebar />}>
      <RecipeDetail recipeId={recipeId} />
    </MainLayout>
  )
}
