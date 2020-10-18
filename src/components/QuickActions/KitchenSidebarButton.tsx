import React from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  toggleKitchenSidebar(): void
}

const KitchenSidebarButton = React.memo<Props>(({ toggleKitchenSidebar }) => {
  const { t } = useTranslation()

  return (
    <button onClick={() => toggleKitchenSidebar()} title={t('common.cookingRecipes')}>
      <i className="zmdi zmdi-view-list-alt" />
    </button>
  )
})

export default KitchenSidebarButton