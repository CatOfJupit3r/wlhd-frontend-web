export interface ErrorState {
    message: string;
    code: number;
}


export interface GameState {
    user_name: string;
}


export interface TurnState {
    squareChoice: boolean // if false, chosenSquare cannot be changed
    interactableSquares: {
        [key: string]: { [key: string]: boolean }
    }, // used for styles on the battlefield
    chosenSquare: string, // value changed by buttons. Format is "line/column"
    chosenAction: { // action that the user has chosen and this is sent to the server
        [key: string]: string
    },
    displayedActions: { // This is a readable version of the actions, with the translated name as the key
        [key: string]: string
    },
    isTurnActive: boolean, // If false, the action input is disabled
}

export interface StoreState {
    error: ErrorState
    turn: TurnState
    game: GameState
}

