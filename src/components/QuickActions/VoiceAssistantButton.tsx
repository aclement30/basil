import React from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  enabled: boolean
  listening: boolean
  toggleVoiceAssistant(): void
}

const VoiceAssistantButton = React.memo<Props>(({ enabled, listening, toggleVoiceAssistant }) => {
  const { t } = useTranslation()

  let iconClass = 'zmdi-mic-off'
  if (enabled) iconClass = 'zmdi-mic'
  if (listening) iconClass = 'zmdi-spinner zmdi-hc-spin'

  return (
    <button onClick={() => toggleVoiceAssistant()} title={t('common.vocalAssistant')}>
      <i className={'zmdi ' + iconClass} />
    </button>
  )
})

export default VoiceAssistantButton