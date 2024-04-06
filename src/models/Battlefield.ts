export interface Battlefield {
    field: string[][]
    columns: string[]
    lines: string[]
    connectors: string
    separators: string
    field_pawns: {
        [key: string]: string
    }
}

export interface TranslatableString {
    main_string: string
    format_args?: {
        [key: string]: string | TranslatableString
    }
}

export interface GameStateContainer {
    [key: string]: Array<TranslatableString>
}

export interface EntityInfoTooltip {
    name: TranslatableString
    square: { line: string; column: string }
    health: { current: string; max: string }
    action_points: { current: string; max: string }
    armor: { current: string; base: string }
    status_effects: Array<{
        descriptor: TranslatableString
        duration: string
    }>
}

export interface EntityInfoTurn {
    name: string
    square: string
    current_action_points: string
    max_action_points: string
}

export interface EntityInfoFull {
    name: string
    square: string
    attributes: { [attribute: string]: string }

    items: Array<{
        descriptor: string
        cost: number
        uses: number | null
        cooldown: { current: number; max: number }
        count: number // how many of given item entity has
        consumable: boolean // if item is consumable
    }>
    weapons: Array<{
        descriptor: string
        cost: number
        uses: number | null
        consumable: boolean
        count: number
        cooldown: { current: number; max: number }
        isActive: boolean
    }>
    spells: Array<{
        descriptor: string
        cost: number
        uses: number | null
        cooldown: { current: number; max: number }
    }>
    status_effects: Array<{
        descriptor: TranslatableString
        duration: number
    }>
}
