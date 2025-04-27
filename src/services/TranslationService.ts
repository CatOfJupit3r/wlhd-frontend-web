import axios from 'axios';
import { FALLBACK_LANGUAGE, SUPPORTED_DLCs, VITE_CDN_URL } from 'config';
import i18next, { Resource } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import en_US from '../locales/en_US.json';
import ua_UK from '../locales/ua_UK.json';

class TranslationService {
    constructor(fallbackLng: string = FALLBACK_LANGUAGE) {
        i18next
            .use(initReactI18next)
            .use(this.createLanguageDetector())
            .init({
                fallbackLng,
                resources: {
                    'en-US': this.getDefaultLanguageResourcePack('en-US'),
                    'uk-UA': this.getDefaultLanguageResourcePack('uk-UA'),
                },
            })
            .then();

        this.loadTranslations().then(
            () => {
                console.log('Custom translations loaded');
            },
            (error) => {
                console.log('Error loading translations', error);
            },
        );
    }

    public async loadTranslations() {
        await Promise.all(
            SUPPORTED_DLCs.map(async ({ descriptor: dlc }) => {
                await this.spawnDLCTranslations(dlc);
            }),
        );
    }

    private createLanguageDetector() {
        const detector = new LanguageDetector();
        detector.init({
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
        });
        return detector;
    }

    private getLanguages = () => {
        return [FALLBACK_LANGUAGE, i18next.language];
    };

    private spawnDLCTranslations = async (dlc: string) => {
        try {
            const { data: translations }: { data: Resource } = await axios.get(
                `${VITE_CDN_URL}/game/${dlc}/translations?languages=${this.getLanguages()
                    .map((language) => language.replace('-', '_'))
                    .join(',')}`,
            );
            for (const language in translations) {
                if (translations[language] === null) continue;
                for (const dlc in translations[language]) {
                    if (translations[language][dlc] === null) continue;
                    i18next.addResourceBundle(language.replace('_', '-'), dlc, translations[language][dlc], true, true);
                }
                console.log(`Translations for ${dlc} loaded`);
            }
        } catch (error) {
            console.log('Failed to fetch game DLC translations', error);
        }
    };

    private getDefaultLanguageResourcePack = (lang: string): Resource => {
        switch (lang) {
            case 'uk-UA':
                return { local: ua_UK };
            case 'en-US':
                return { local: en_US };
        }
        return { local: {} };
    };
}

export default new TranslationService();
