import React from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '../../i18n'

import './index.scss'

export default React.memo(() => {
  const { i18n: { language } } = useTranslation()

  return (
    <div className="Footer">
      <ul className="menu">
        {language !== 'en' && <li><a onClick={() => i18n.changeLanguage('en')}>English</a></li>}
        {language !== 'fr' && <li><a onClick={() => i18n.changeLanguage('fr')}>Français</a></li>}
      </ul>
      <div className="copyright">Copyright &copy; {new Date().getFullYear()} - <a href="http://www.alexandreclement.com" target="_blank">Alexandre Clément</a></div>
    </div>
  )
})