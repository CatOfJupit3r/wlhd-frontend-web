import { ActionInput as ActionInputInterface } from './ActionInput'
import { Battlefield, EntityInfoFull, EntityInfoTooltip, EntityInfoTurn, GameStateContainer } from './Battlefield'

export interface CosmeticsState {
    notification: {
        message: string
        code: number
    }
    pageTitle: string
}

export interface LobbyState {
    name: string
    lobbyId: string
    combats: Array<CombatInfo>
    players: Array<LobbyPlayerInfo>
    gm: string
    layout: 'default' | 'gm'
    controlledEntity: {
        name: string
        id: string
    } | null
}

export interface TurnState {
    playersTurn: boolean
    needToChooseSquare: boolean
    entityActions: ActionInputInterface
    actionOutputs: {
        [key: string]: string
    } | null
    halted: boolean
}

export interface InfoState {
    round: string
    messages: {
        start: number
        end: number
        length: number
        loaded: GameStateContainer
    }
    gameFlow: {
        type: 'pending' | 'active' | 'ended' | 'aborted'
        details: string
        // pending: 'waiting for GM' | 'waiting for game start'
        // active: ???
        // ended: winner
        // aborted: reason why (if possible)
    }
    entityTooltips: {
        [square: string]: EntityInfoTooltip | null
    }
    controlledEntities: Array<EntityInfoFull> | null
    activeEntity: EntityInfoTurn | null
    chosenMenu: string | null
}

export interface BattlefieldState {
    currentBattlefield: Battlefield
    battlefieldMode: 'info' | 'selection'
    clickedSquare: string | null
    interactableTiles: {
        [key: string]: boolean
    }
    highlightedSquares: {
        [key: string]: number
    }
}

export interface CombatInfo {
    nickname: string
    isActive: boolean
    roundCount: number
    activePlayers: Array<string>
    _id: string
}

export interface LobbyPlayerInfo {
    player: {
        handle: string
        nickname: string
        avatar: string
        userId: string
    }
    character: {
        name: string
        sprite: string
    } | null
}

export interface LobbyInfo {
    name: string
    combats: Array<CombatInfo>
    players: Array<LobbyPlayerInfo>
    gm: string
    layout: 'default' | 'gm'
    controlledEntity: {
        name: string
        id: string
    } | null
}
