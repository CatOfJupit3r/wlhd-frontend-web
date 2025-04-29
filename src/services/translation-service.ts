import i18next, { Resource } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import { FALLBACK_LANGUAGE } from '@configuration';
import { SUPPORTED_DLCs } from '@constants/game-support';
import ApiService from '@services/api-service';

import en_US from '../locales/en_US.json';
import ua_UK from '../locales/ua_UK.json';

class TranslationService {
    private _loaders: Array<Promise<unknown>> = [];

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

        this.loadTranslations();
    }

    /**
     * Used to await translations to be loaded so that the game data is not displayed before the translations are loaded
     */
    public async awaitTranslations() {
        await Promise.all(this._loaders);
    }

    public loadTranslations() {
        this._loaders = SUPPORTED_DLCs.map(async ({ descriptor: dlc }) => {
            await this.spawnDLCTranslations(dlc);
        });
    }

    public spawnCustomTranslations(lobbyId: string) {
        this._loaders.push(
            ApiService.getCustomLobbyTranslations(lobbyId)
                .then((data) => {
                    i18next.addResourceBundle(i18next.language, 'coordinator', data, true, true);
                })
                .catch((e) => {
                    console.log(e);
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
            const translations = await ApiService.getTranslations(
                this.getLanguages().map((language) => language.replace('-', '_')),
                [dlc],
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
