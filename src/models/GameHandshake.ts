import { Battlefield, EntityInfoFull, EntityInfoTooltip, TranslatableString } from './Battlefield'

export type GameMessage = Array<TranslatableString>

export interface GameHandshake {
    roundCount: string
    messages: Array<GameMessage>
    combatStatus: 'ongoing' | 'pending'
    currentBattlefield: Battlefield
    controlledEntities: Array<EntityInfoFull> | null
    entityTooltips: { [square: string]: EntityInfoTooltip | null }
    turnOrder: IndividualTurnOrder
}

export interface IndividualTurnOrder {
    order: Array<CharacterInTurnOrder>
    current: number | null
}

export interface CharacterInTurnOrder {
    controlledByYou: false
    descriptor: string
    decorations: {
        name: string
        description: string
        sprite: string
    }
    square: {
        line: string
        column: string
    }
}
