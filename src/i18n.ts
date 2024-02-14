import getLanguageFiles from "./utils/languageLoader"
import i18next from 'i18next'
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector'


// const resources: object = getLanguageFiles()


i18next
    .use(initReactI18next)
    // .use(LanguageDetector)
    .init({
        fallbackLng: "en_US",
        resources: {
            en_US: {
                translation: {
                    "stuff": "BRUH",
                    "brrruhhh": "123123"
                }
            },
            en: {
                "translation": {
                    "stuff": "RRRRRRRRRR"
                }
            }
        }
})
