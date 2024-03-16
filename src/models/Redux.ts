import {EntityInfo, GameStateMessages} from "./Battlefield";
import {ActionInput as ActionInputInterface} from "./ActionInput";

export interface notifyState {
    message: string;
    code: number;
}


export interface GameState {
    user_name: string;
    game_id: string;
    isActive: boolean;
}


export interface TurnState {
    isTurnActive: boolean, // If false, the action input is disabled
    readyToSubmit: boolean, // If true, the action input is ready to be sent to the server
    squareChoice: boolean // if false, chosenSquare cannot be changed
    isLoadingCurrentActions: boolean
    currentActions: ActionInputInterface
    interactableSquares: { // used for styles on the battlefield
        [key: string]: { [key: string]: boolean }
    },
    chosenSquare: string, // value changed by buttons. Format is "line/column"
    chosenAction: { // action that the user has chosen and this is sent to the server
        [key: string]: string
    },
    displayedActions: { // This is a readable version of the actions, with the translated name as the key
        [key: string]: string
    }
}


export interface InfoState {
    round: number;
    allMessages: GameStateMessages;
    isLoadingBattlefield: boolean;
    isLoadingEntitiesInfo: boolean;
    isLoadingCurrentEntityInfo: boolean;
    endInfo: {
        ended: boolean,
        winner: string
    };
    current_battlefield: {
        battlefield: string[][],
        game_descriptors: {
            lines: string[],
            columns: string[]
            field_components: {
                "0": string,
                [key: string]: string
            },
            separators: string
            connectors: string
        },
    };
    entities_info: {
        [key: string]: EntityInfo
    } | undefined
}

export interface StoreState {
    notify: notifyState
    turn: TurnState
    game: GameState
    info: InfoState
}

