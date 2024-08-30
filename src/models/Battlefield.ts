import { GameMessage } from './GameHandshake'

export interface GameComponentDecoration {
    name: string
    sprite: string
    description: string
}

export interface Battlefield {
    pawns: {
        [key: string]: {
            character: EntityInfoTooltip | null
            areaEffects: Array<unknown>
        }
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
    square: { line: number; column: number }
    health: { current: number; max: number }
    action_points: { current: number; max: number }
    armor: { current: number; base: number }
    statusEffects: Array<Omit<StatusEffectInfo, 'descriptor'>>
}

export interface EntityInfoFull {
    decorations: GameComponentDecoration
    square: { line: number; column: number }
    attributes: EntityAttributes

    inventory: Array<ItemInfo>
    weaponry: Array<WeaponInfo>
    spellBook: {
        spells: Array<SpellInfo>
        maxActiveSpells: number | null
    }
    statusEffects: Array<StatusEffectInfo>
}

export interface EntityAttributes {
    [attribute: string]: number
}

interface InfoWithMethodVariables {
    methodVariables?: { [variable: string]: string | number | Record<string, unknown> | unknown }
}

export interface WeaponInfo extends InfoWithMethodVariables {
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

export interface ItemInfo extends InfoWithMethodVariables {
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

export interface SpellInfo extends InfoWithMethodVariables {
    descriptor: string
    decorations: GameComponentDecoration
    cost: number
    user_needs_range: Array<number>
    uses: {
        current: number
        max: number | null
    }
    cooldown: { current: number; max: number | null }
    isActive?: boolean
}

export interface StatusEffectInfo extends InfoWithMethodVariables {
    descriptor: string
    decorations: GameComponentDecoration
    duration: string | null
}
