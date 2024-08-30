import APIService from '@services/APIService'
import { getLanguageFiles } from '@utils'
import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

const languageDetector = new LanguageDetector()
languageDetector.init({
    order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
    lookupQuerystring: 'lng',
    lookupCookie: 'i18next',
    lookupLocalStorage: 'i18nextLng',
    lookupFromPathIndex: 0,
    lookupFromSubdomainIndex: 0,
    caches: ['localStorage', 'cookie'],
    excludeCacheFor: ['cimode'],
    cookieMinutes: 10,
    cookieDomain: 'myDomain',
    htmlTag: document.documentElement,
    checkWhitelist: true,
})

const FALLBACK_LANGUAGE = 'uk-UA'

i18next
    .use(initReactI18next)
    .use(languageDetector)
    .init({
        fallbackLng: FALLBACK_LANGUAGE,
        resources: {
            ...getLanguageFiles(),
        },
    })
    .then()

APIService.getTranslations([FALLBACK_LANGUAGE, i18next.language], ['builtins', 'nyrzamaer'])
    .then((translations) => {
        for (const language in translations) {
            if (translations[language] === null) continue
            for (const dlc in translations[language]) {
                if (translations[language][dlc] === null) continue
                i18next.addResourceBundle(language, dlc, translations[language][dlc], true, true)
            }
        }
    })
    .catch((error) => {
        console.log('Failed to fetch game DLC translations', error)
    })
