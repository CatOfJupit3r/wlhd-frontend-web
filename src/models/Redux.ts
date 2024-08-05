import { ActionInput as ActionInputInterface } from './ActionInput'
import {
    AttributeInfo,
    Battlefield,
    EntityInfoFull,
    EntityInfoTooltip,
    EntityInfoTurn,
    GameStateContainer,
    ItemInfo,
    SpellInfo,
    StatusEffectInfo,
    WeaponInfo,
} from './Battlefield'
import { UserInformation } from '@models/APIData'
import { IndividualTurnOrder } from '@models/GameHandshake'

export type LoadingState = 'idle' | 'pending' | 'fulfilled' | 'rejected'

export interface CosmeticsState {
    user: UserInformation & {
        loading: LoadingState
    }
    pageTitle: string
}

export type LobbyState = LobbyInfo

export interface TurnState {
    playersTurn: boolean
    needToChooseSquare: boolean
    entityActions: ActionInputInterface
    actionOutputs: {
        [key: string]: string
    } | null
    actionResult: {
        type: 'pending' | 'success' | 'failure'
        details: string | null
    }
    halted: boolean
}

export interface InfoState {
    round: string
    turnOrder: IndividualTurnOrder
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
    chosenMenu: string | null
}

export interface BattlefieldState {
    currentBattlefield: Battlefield
    battlefieldMode: 'info' | 'selection'
    clickedSquare: string | null
    interactableSquares: {
        [key: string]: boolean
    }
    alreadyClickedSquares: {
        [key: string]: number
    }
}

export interface CharacterState {
    descriptor: string
    fetched: {
        inventory: Array<ItemInfo>
        weaponry: Array<WeaponInfo>
        spells: {
            spellBook: Array<SpellInfo>
            spellLayout: {
                layout: Array<string>
                conflicts: unknown
            }
        }
        statusEffects: Array<StatusEffectInfo>
        attributes: AttributeInfo
    }
    loading: {
        inventory: LoadingState
        weaponry: LoadingState
        spells: LoadingState
        statusEffects: LoadingState
        attributes: LoadingState
    }
}

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

type CharacterInTurnOrder = {
    controlledByYou: boolean
    square: {
        line: number
        column: number
    }
} & CharacterInLobby
