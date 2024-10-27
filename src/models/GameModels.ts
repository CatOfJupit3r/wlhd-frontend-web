import { OneOf } from '@models/OneOf'

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

export type TranslatableString =
    | { key: string }
    | {
          key: string
          args: {
              [key: string]: string | TranslatableString
          }
      }

export type GameMessage = Array<TranslatableString>
export type GameStateContainer = Array<GameMessage>

export interface GameHandshake {
    roundCount: number
    messages: GameStateContainer // but only last 10 instead of all
    combatStatus: 'ongoing' | 'pending'
    currentBattlefield: Battlefield
    controlledEntities: Array<EntityInfoFull> | null
    turnOrder: IndividualTurnOrder
}

export type IndividualTurnOrder = Array<CharacterInTurnOrder | null>

export interface CharacterInTurnOrder {
    controlledByYou: boolean
    descriptor: string
    decorations: {
        name: string
        description: string
        sprite: string
    }
    square: {
        line: number
        column: number
    } | null
    id_: string
}

export interface EntityInfoTooltip {
    decorations: GameComponentDecoration
    square: { line: number; column: number }
    health: { current: number; max: number }
    action_points: { current: number; max: number }
    armor: { current: number; base: number }
    statusEffects: Array<StatusEffectInfo>
}

export interface EntityInfoFull {
    decorations: GameComponentDecoration
    square: { line: number; column: number } | null
    attributes: AttributeInfo

    inventory: Array<ItemInfo>
    weaponry: Array<WeaponInfo>
    spellBook: {
        knownSpells: Array<SpellInfo>
        maxActiveSpells: number | null
    }
    statusEffects: Array<StatusEffectInfo>
    tags: Array<string>
    memory: GameComponentMemory | null
}

export interface EntityAttributes {
    [attribute: string]: number
}

interface CommonGameComponentInfoFields {
    decorations: GameComponentDecoration
    memory: GameComponentMemory | null
    tags: Array<string>
}

export interface AttributeInfo {
    [attribute: string]: number
}

export interface WeaponInfo extends CommonGameComponentInfoFields {
    descriptor: string
    cost: number | null
    uses: {
        current: number
        max: number | null
    }
    consumable: boolean
    quantity: number
    userNeedsRange: Array<number>
    cooldown: { current: number; max: number | null }
    isActive: boolean
}

export interface ItemInfo extends CommonGameComponentInfoFields {
    descriptor: string
    cost: number | null
    uses: {
        current: number
        max: number | null
    }
    userNeedsRange: Array<number>
    cooldown: { current: number; max: number | null }
    quantity: number // how many of given item entity has
    consumable: boolean // if item is consumable
}

export interface SpellInfo extends CommonGameComponentInfoFields {
    descriptor: string
    cost: number | null
    userNeedsRange: Array<number>
    uses: {
        current: number
        max: number | null
    }
    cooldown: { current: number; max: number | null }
    isActive: boolean
}

export interface StatusEffectInfo extends CommonGameComponentInfoFields {
    descriptor: string
    duration: number | null
}

export interface TranslationInfoAction {
    descriptor: string
    co_descriptor: string | null
}

export interface Action {
    id: string
    translation_info: TranslationInfoAction
    available: boolean
    requires: null | {
        [argument: string]: string
    }
}

export interface ActionInput {
    action: Array<Action>
    aliases: {
        [key: string]: Array<Action>
    }
    alias_translations: {
        [key: string]: string
    }
}

interface MemoryType {
    type: string
    value: unknown
    display_name: string
    display_value: string
    internal: boolean
}

export interface DiceMemory extends MemoryType {
    type: 'dice'
    value: {
        sides: number
        amount: number
    }
}

export interface StringMemory extends MemoryType {
    type: 'string'
    value: string
}

export interface ComponentIDMemory extends MemoryType {
    type: 'component_id'
    value: string
}

export interface NumberMemory extends MemoryType {
    type: 'number'
    value: number
}

interface BooleanMemory extends MemoryType {
    type: 'boolean'
    value: boolean
}

export type PossibleMemory = OneOf<
    [DiceMemory, StringMemory, NumberMemory, BooleanMemory, ComponentIDMemory, MemoryType]
>

export interface GameComponentMemory {
    [variable: string]: PossibleMemory
}
