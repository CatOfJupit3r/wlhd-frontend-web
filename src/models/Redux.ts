import { UserInformation } from '@models/APIData'
import {
    ActionInput as ActionInputInterface,
    Battlefield,
    EntityInfoFull,
    GameHandshake,
    GameStateContainer,
    IndividualTurnOrder,
} from './GameModels'

export type LoadingState = 'idle' | 'pending' | 'fulfilled' | 'rejected'

export interface CosmeticsState {
    user: UserInformation & {
        loading: LoadingState
    }
    pageTitle: string
}

export type LobbyState = LobbyInfo

export interface CombatInfo {
    nickname: string
    isActive: boolean
    roundCount: number
    activePlayers: Array<{
        handle: string
        nickname: string
    }>
    _id: string
}

export interface LobbyPlayerInfo {
    handle: string
    nickname: string
    avatar: string
    userId: string
    characters: Array<string>
}

export interface LobbyInfo {
    name: string
    lobbyId: string
    combats: Array<CombatInfo>
    players: Array<LobbyPlayerInfo>
    characters: Array<CharacterInLobby>
    gm: string
    layout: 'default' | 'gm'
}

export interface CharacterInLobby {
    descriptor: string
    decorations: {
        name: string
        description: string
        sprite: string
    }
}

export interface GameScreenState {
    battlefield: Battlefield
    actions: null | ActionInputInterface
    round: {
        current: GameHandshake['roundCount']
        order: IndividualTurnOrder
    }
    messages: GameStateContainer
    gameFlow: {
        type: 'pending' | 'active' | 'ended' | 'aborted'
        details: string
    }
    controlledEntities: Array<EntityInfoFull> | null
    yourTurn: boolean
}
