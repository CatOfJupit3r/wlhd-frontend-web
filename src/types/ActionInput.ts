export interface TranslationInfoAction {
    descriptor: string,
    co_descriptor: string,
    level_descriptor: string,
}

export interface Action {
    id: string,
    available: boolean,
    translation_info: TranslationInfoAction
    level: string,
    requires: null | Action[]
}

export interface ActionInput {
    actions: Action[],
    entity_name: string,
    line: string,
    column: string,
    current_ap: string,
    max_ap: string,
}

export interface ActionOutput {
    action: string,
    [key: string]: string
}