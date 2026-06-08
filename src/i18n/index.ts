import { createI18n } from 'vue-i18n'

import fr from '../locales/fr.json'
import en from '../locales/en.json'

function getBrowserLocale(): 'fr' | 'en' {
  const browserLanguage = navigator.language.toLowerCase()

  if (browserLanguage.startsWith('fr')) {
    return 'fr'
  }

  if (browserLanguage.startsWith('en')) {
    return 'en'
  }

  return 'fr'
}

export const i18n = createI18n({
  legacy: false,
  locale: getBrowserLocale(),
  fallbackLocale: 'fr',
  messages: {
    fr,
    en,
  },
})
