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

export type LoadingState = 'idle' | 'pending' | 'fulfilled' | 'rejected'

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
    characters: Array<CharacterInLobby>
    gm: string
    layout: 'default' | 'gm'
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
    player: {
        handle: string
        nickname: string
        avatar: string
        userId: string
    }
    characters: [CharacterInLobby]
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

export interface CharacterInLobby {
    descriptor: string
    name: string
    description: string
    sprite: string
}
