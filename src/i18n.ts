import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import translationEN from './i18n/en.json'
import translationFR from './i18n/fr.json'

const resources = {
  en: { translation: translationEN },
  fr: { translation: translationFR },
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'fr',
    keySeparator: '.',
  })

export default i18n