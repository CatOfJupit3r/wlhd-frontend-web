import { GameMessage } from './GameHandshake'

export interface GameComponentDecoration {
    name: string
    sprite: string
    description: string
}

export interface Battlefield {
    field: string[][]
    columns: string[]
    lines: string[]
    connectors: string
    separators: string
    pawns: {
        [key: string]: string
    }
}

export interface TranslatableString {
    main_string: string
    format_args?: {
        [key: string]: string | TranslatableString
    }
}

export type GameStateContainer = Array<GameMessage>

export interface EntityInfoTooltip {
    decorations: GameComponentDecoration
    square: { line: string; column: string }
    health: { current: string; max: string }
    action_points: { current: string; max: string }
    armor: { current: string; base: string }
    status_effects: Array<StatusEffectInfo>
}

export interface EntityInfoTurn {
    decorations: GameComponentDecoration
    square: { line: string; column: string }
    action_points: { current: string; max: string }
}

export interface EntityInfoFull {
    decorations: GameComponentDecoration
    square: { line: string; column: string }
    attributes: EntityAttributes

    items: Array<ItemInfo>
    weapons: Array<WeaponInfo>
    spells: Array<SpellInfo>
    status_effects: Array<StatusEffectInfo>
}

export interface EntityAttributes {
    [attribute: string]: string
}

export interface WeaponInfo {
    descriptor: string
    decorations: GameComponentDecoration
    cost: number
    uses: {
        current: number
        max: number | null
    }
    consumable: boolean
    quantity: number
    user_needs_range: Array<number>
    cooldown: { current: number; max: number }
    isActive: boolean
}

export interface ItemInfo {
    descriptor: string
    decorations: GameComponentDecoration
    cost: number
    uses: {
        current: number
        max: number | null
    }
    user_needs_range: Array<number>
    cooldown: { current: number; max: number }
    quantity: number // how many of given item entity has
    consumable: boolean // if item is consumable
}

export interface SpellInfo {
    descriptor: string
    decorations: GameComponentDecoration
    cost: number
    user_needs_range: Array<number>
    uses: {
        current: number
        max: number | null
    }
    cooldown: { current: number; max: number | null }
    isActive?: boolean // CHARACTER PAGE EXCLUSIVE
}

export interface StatusEffectInfo {
    decorations: GameComponentDecoration
    duration: string | null
}

export interface AttributeInfo {
    [attribute: string]: string
}

export type CharacterFeaturesType = WeaponInfo | ItemInfo | SpellInfo | StatusEffectInfo
