export interface TranslationJSON {
    [languageCode: string]: {
        [dlc: string]: TranslationSnippet;
    };
}

export interface TranslationSnippet {
    [key: string]: TranslationSnippet | string;
}
