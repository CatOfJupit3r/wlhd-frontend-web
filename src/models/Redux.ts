import { ActionInput as ActionInputInterface } from './ActionInput'
import { Battlefield, EntityInfoFull, EntityInfoTooltip, EntityInfoTurn, GameStateContainer } from './Battlefield'

export interface notifyState {
    message: string
    code: number
}

export interface LobbyState {
    lobbyId: string
    combats: Array<{
        nickname: string
        isActive: boolean
        roundCount: number
    }>
    players: Array<{
        userId: string
        nickname: string
        mainCharacter: string
    }>
    gm: string
    layout: 'default' | 'gm'
    controlledEntity: {
        name: string
        id: string
    } | null
}

export interface TurnState {
    playersTurn: boolean
    readyToSubmit: boolean
    isLoadingEntityActions: boolean
    needToChooseSquare: boolean

    entityActions: ActionInputInterface
    currentAlias: string
    scope: {
        [key: string]: string
    }
    highlightedComponents: {
        [key: string]: number // not only do we need to know which component was chosen, but also how many times it was chosen to not accidentally unhighlight it
    }
    choices: {
        [key: string]: string
    }
    translatedChoices: {
        [key: string]: string
    }
    chosenAction: {
        chosenActionValue: string
        translatedActionValue: string
    }
}

export interface InfoState {
    round: number
    allMessages: GameStateContainer
    isLoadingBattlefield: boolean
    isLoadingEntitiesInfo: boolean
    isLoadingCurrentEntityInfo: boolean
    endInfo: {
        ended: boolean
        winner: string
    }
    currentBattlefield: Battlefield
    entitiesInfo:
        | {
              [key: string]: EntityInfoTooltip
          }
        | undefined
    controlledEntities: Array<EntityInfoFull>
    activeEntity: EntityInfoTurn
    chosenMenu: string
}

export interface StoreState {
    notify: notifyState
    turn: TurnState
    lobby: LobbyState
    info: InfoState
}
