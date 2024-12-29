import { CharacterDataInSave } from '@models/CombatEditorModels'
import { AttributeInfo, GameStateContainer } from '@models/GameModels'

export interface CharacterClassConversion {
    decorations: {
        name: string
        description: string
        sprite: string
    }
    attributes: AttributeInfo
    spellBook: {
        maxActiveSpells: number | null
        knownSpells: Array<{
            descriptor: string
            isActive: boolean
        }>
    }
    inventory: Array<{
        descriptor: string
        quantity: number
    }>
    statusEffects: Array<{
        descriptor: string
        duration: number | null
    }>
    weaponry: Array<{
        descriptor: string
        quantity: number
    }>
}

type ControlledByPrototype = {
    type: string
    id?: string
}

interface ControlledByPlayer extends ControlledByPrototype {
    type: 'player'
    id: string
}

interface ControlledByAI extends ControlledByPrototype {
    type: 'ai'
    id: string
}

interface ControlledByGameLogic extends ControlledByPrototype {
    type: 'game_logic'
}

export type ControlledBy = ControlledByPlayer | ControlledByAI | ControlledByGameLogic | ControlledByPrototype

interface CharacterInCombat {
    decorations: {
        name: string
        description: string
        sprite: string
    }
    attributes: {
        [descriptor: string]: number
    }
    spellBook: {
        maxActiveSpells: number | null
        knownSpells: Array<{
            descriptor: string
            turns_until_usage: number
            current_consecutive_uses: number
            is_active: boolean
        }>
    }
    inventory: Array<{
        descriptor: string
        quantity: number
        turns_until_usage: number
        current_consecutive_uses: number
    }>
    statusEffects: Array<{
        descriptor: string
        duration: number | null
    }>
    weaponry: Array<{
        descriptor: string
        quantity: number
        is_active: boolean
        turns_until_usage: number
        current_consecutive_uses: number
    }>
}

export interface CreateCombatBody {
    nickname: string
    preset: {
        round: number
        turnOrder: Array<string | null>
        messages: GameStateContainer
        battlefield: {
            [square: string]: {
                descriptor: string
                source: Partial<CharacterDataInSave>
                control: ControlledBy
            }
        }
    }
}

export interface MinifiedCombatPreset {
    nickName: string
    battlefield: {
        [square: string]: {
            descriptor: string
            character: CharacterInCombat
            control: ControlledBy
        }
    }
}
