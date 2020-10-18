import React from 'react'
import { useTranslation } from 'react-i18next'

import './LoginLayout.scss'
import logo from '../img/logo-icon.png'

interface Props {
  children: React.ReactNode
}

export default React.memo<Props>(({ children }) => {
  const { i18n: { language, changeLanguage } } = useTranslation()

  return (
    <div className="LoginLayout">
      <div className="l-block toggled">
        <div className="lb-header palette-Teal bg">
          <div className="logo">
            <img src={logo} />
              <h1>Basil</h1>
          </div>
        </div>

        {children}

        <div className="links">
          {language !== 'en' && <a onClick={() => changeLanguage('en')}>English</a>}
          {language !== 'fr' && <a onClick={() => changeLanguage('fr')}>Français</a>}
        </div>
      </div>
    </div>
  )
})
