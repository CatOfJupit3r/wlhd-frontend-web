export interface GameCommand {
    command: string,
    payload?: {
        [key: string]: any
    }
}

export interface TakeActionCommand extends GameCommand {
    payload: {
        game_id: string,
        entity_id: string,
        user_token: string,
        action: string
    }
}

export interface GameFinishedCommand extends GameCommand {
    payload: {
        result: string,
        code: 420 | 500,
    }
}


export interface ActionResultCommand extends GameCommand {
    payload: {
        message: string,
        code: 200 | 400 | 406 | 500,
    }
}

export interface StateUpdatedCommand extends GameCommand {
    payload: {
        memory_cell: string,
    }
}

