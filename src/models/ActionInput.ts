export interface TranslationInfoAction {
    descriptor: string,
    co_descriptor: string | null,
}

export interface Action {
    id: string,
    translation_info: TranslationInfoAction,
    available: boolean,
    requires: null | {
        [argument: string]: string
    }
}

export interface ActionInput {
    action: Array<Action>,
    aliases: {
        [key: string]:  Array<Action>
    },
    alias_translations: {
        [key: string]: string
    }
}
