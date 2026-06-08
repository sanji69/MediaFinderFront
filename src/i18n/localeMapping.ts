export function getApiLocale(locale: string) {
  if (locale === 'en') {
    return {
      language: 'en-US',
      countryCode: 'US',
    }
  }

  return {
    language: 'fr-FR',
    countryCode: 'FR',
  }
}
