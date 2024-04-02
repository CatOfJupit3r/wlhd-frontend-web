import { ActionInput as ActionInputInterface } from './ActionInput'
import { EntityInfo, GameStateContainer } from './Battlefield'

export interface notifyState {
    message: string
    code: number
}

export interface GameState {
    user_name: string
    game_id: string
    chosenMenu: string
    isActive: boolean
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
    current_battlefield: {
        battlefield: string[][]
        game_descriptors: {
            lines: string[]
            columns: string[]
            field_components: {
                '0': string
                [key: string]: string
            }
            separators: string
            connectors: string
        }
    }
    entities_info:
        | {
              [key: string]: EntityInfo
          }
        | undefined
}

export interface StoreState {
    notify: notifyState
    turn: TurnState
    game: GameState
    info: InfoState
}
