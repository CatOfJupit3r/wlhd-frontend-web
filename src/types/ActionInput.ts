export interface TranslationInfoAction {
    descriptor: string,
    co_descriptor: string | null,
    level_descriptor: string,
}

export interface Action {
    id: string,
    available: boolean,
    translation_info: TranslationInfoAction
    level: string,
    requires: null | Action[][]
}

export interface ActionInput {
    actions: Action[],
    entity_name: string,
    line: number,
    column: number,
    current_ap: number,
    max_ap: number,
}

export interface ActionOutput {
    action: string,
    [key: string]: string
}