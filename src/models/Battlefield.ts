import { GameMessage } from './GameHandshake'

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
    square: { line: string; column: string }
    action_points: { current: string; max: string }
}

export interface EntityInfoFull {
    name: string
    square: {
        line: string
        column: string
    }
    attributes: { [attribute: string]: string }
    items: Array<ItemInfo>
    weapons: Array<WeaponInfo>
    spells: Array<SpellInfo>
    status_effects: Array<StatusEffectInfo>
}

export interface WeaponInfo {
    descriptor: string
    cost: number
    uses: number | null
    consumable: boolean
    count: number
    cooldown: { current: number; max: number }
    isActive: boolean
}

export interface ItemInfo {
    descriptor: string
    cost: number
    uses: number | null
    cooldown: { current: number; max: number }
    count: number // how many of given item entity has
    consumable: boolean // if item is consumable
}

export interface SpellInfo {
    descriptor: string
    cost: number
    uses: number | null
    cooldown: { current: number; max: number }
}

export interface StatusEffectInfo {
    descriptor: TranslatableString
    duration: string
}
