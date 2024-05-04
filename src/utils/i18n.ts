import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { getLanguageFiles } from './languageLoader'

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

i18next
    .use(initReactI18next)
    .use(languageDetector)
    .init({
        fallbackLng: 'uk-UA',
        resources: getLanguageFiles(),
    })
    .then()
