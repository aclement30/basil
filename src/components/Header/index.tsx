import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import './index.scss'
import CookModeButton from '../QuickActions/CookmodeButton'
import { UIContext } from '../../contexts/UIContext'

export default React.memo(() => {
  const { t } = useTranslation()
  const context = useContext<UIContext>(UIContext)

  return (
    <div className="Header">
      <div className="left h-logo">
        <Link to="/" className="hidden-xs">
          <h1>Basil</h1>
          <small>{t('common.tagline')}</small>
        </Link>

        <div className="menu-collapse" onClick={() => context.toggleNavigationMenu()}>
          <div className="mc-wrap">
            <div className="mcw-line top" />
            <div className="mcw-line center" />
            <div className="mcw-line bottom" />
          </div>
        </div>
      </div>

      <ul className="right h-menu">
        {/*<li>*/}
        {/*  <VoiceAssistantButton enabled={context.voiceAssistantEnabled} listening={context.voiceAssistantListening} toggleVoiceAssistant={context.toggleVoiceAssistant} />*/}
        {/*</li>*/}

        <li>
          <CookModeButton enabled={context.cookMode} setCookMode={context.setCookMode} />
        </li>
      </ul>
    </div>
  )
})