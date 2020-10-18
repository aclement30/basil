import React from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  enabled: boolean
  setCookMode(value: boolean): void
}

const CookModeButton = React.memo<Props>(({ enabled, setCookMode }) => {
  const { t } = useTranslation()

  return (
    <button onClick={() => setCookMode(!enabled)} title={t('common.cookMode')}>
      <i className={'zmdi ' + (enabled ? 'zmdi-fullscreen-alt' : 'zmdi-fullscreen-exit')} />
    </button>
  )
})

export default CookModeButton