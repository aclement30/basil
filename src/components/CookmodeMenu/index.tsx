import React, { useContext } from 'react'

import './index.scss'

import { UIContext } from '../../contexts/UIContext'
import CookModeButton from '../QuickActions/CookmodeButton'
import KitchenSidebarButton from '../QuickActions/KitchenSidebarButton'

const CookmodeMenu = React.memo(() => {
  const context = useContext<UIContext>(UIContext)

  return (
    <div className="CookmodeMenu">
      <ul className="quick-actions">
        {/*<li>*/}
        {/*  <VoiceAssistantButton enabled={context.voiceAssistantEnabled} listening={context.voiceAssistantListening} toggleVoiceAssistant={context.toggleVoiceAssistant} />*/}
        {/*</li>*/}

        <li>
          <CookModeButton enabled={context.cookMode} setCookMode={context.setCookMode} />
        </li>

        <li>
          <KitchenSidebarButton toggleKitchenSidebar={context.toggleKitchenSidebar} />
        </li>
      </ul>
    </div>
  )
})

export default CookmodeMenu