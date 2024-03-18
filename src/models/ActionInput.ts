export interface TranslationInfoAction {
    descriptor: string,
    co_descriptor: string | null,
}

export interface Action {
    id: string,
    translation_info: TranslationInfoAction,
    available: boolean,
    requires: null | string
}

export interface ActionInput {
    root: Array<Action>,
    aliases: {
        [key: string]: Action
    },
    alias_translations: {
        [key: string]: string
    }
}
