import { Battlefield, EntityInfoFull, EntityInfoTooltip, EntityInfoTurn, TranslatableString } from './Battlefield'

export type GameMessage = Array<TranslatableString>

export interface GameHandshake {
    roundCount: string
    messages: Array<GameMessage>
    combatStatus: 'ongoing' | 'pending'
    currentBattlefield: Battlefield
    controlledEntities: Array<EntityInfoFull> | null
    currentEntityInfo: EntityInfoTurn | null
    entityTooltips: { [square: string]: EntityInfoTooltip | null }
}
