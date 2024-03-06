import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {TurnState, StoreState} from "../../models/Redux";
import {ActionInput as ActionInputInterface} from "../../models/ActionInput";
import {GET_ACTIONS} from "../../config/endpoints";

const initialState: TurnState = {
    squareChoice: false,
    isTurnActive: false,
    readyToSubmit: false,
    isLoadingCurrentActions: false,
    currentActions: {} as ActionInputInterface,
    interactableSquares: {},
    chosenSquare: "",
    chosenAction: {},
    displayedActions: {},
}


export const fetchActions = createAsyncThunk(
    'turn/fetchActions',
    async ({
        game_id,
        entity_id
           }: {game_id: string, entity_id: string}) => {
        const response = await fetch(GET_ACTIONS(game_id, entity_id))
        return response.json()
    }
)


const turnSlice = createSlice({
    name: 'turn',
    initialState,
    reducers: {
        resetTurn: (state) => ({...initialState, isTurnActive: state.isTurnActive}),
        setSquareChoice: (state: TurnState, action: {
            type: string,
            payload: {
                flag: boolean
            }
        }) => {
            const {flag} = action.payload;
            return {...state, squareChoice: flag}
        },
        setCurrentActions: (state: TurnState, action: {
            type: string,
            payload: {
                actions: ActionInputInterface
            }
        }) => {
            const {actions} = action.payload;
            return {...state, currentActions: actions}
        },
        setInteractableSquares: (state: TurnState, action: {
            type: string,
            payload: {
                lines: string[]
                columns: string[]
            }
        }) => {
            const {lines, columns} = action.payload;
            for (let line of lines) {
                state.interactableSquares[line] = {};
                for (let column of columns) {
                    state.interactableSquares[line][column] = true;
                }
            }
        },
        resetInteractableSquares: (state: TurnState) => {
            return {...state, interactableSquares: {}}
        },
        setChosenSquare: (state: TurnState, action: {
            type: string,
            payload: {
                square: string
            }
        }) => {
            const {square} = action.payload;
            return state.squareChoice ? {...state, chosenSquare: square} : state;
        },
        setChosenAction: (state: TurnState, action: {
            type: string,
            payload: {
                key: string,
                action_value: string,
            }
        }) => {
            const {key, action_value} = action.payload;
            return {...state, chosenAction: {...state.chosenAction, [key]: action_value}}
        },
        setDisplayedActions: (state: TurnState, action: {
            type: string,
            payload: {
                key: string,
                action_value: string,
            }
        }) => {
            const {key, action_value} = action.payload;
            return {...state, displayedActions: {...state.displayedActions, [key]: action_value}}
        },
        setIsTurnActive: (state: TurnState, action: {
            type: string,
            payload: {
                flag: boolean
            }
        }) => {
            const {flag} = action.payload;
            return {...state, isTurnActive: flag}
        },
        setReadyToSubmit: (state: TurnState, action) => {
            return {...state, readyToSubmit: action.payload.flag}
        },
        setIsLoadingActions: (state: TurnState, action) => {
            return {...state, isLoadingCurrentActions: action.payload.flag}
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchActions.fulfilled, (state, action) => {
            state.currentActions = action.payload
            setIsLoadingActions({flag: false})
        })
        builder.addCase(fetchActions.rejected, (state, action) => {
            console.error(action.error)
            state.currentActions = {
                actions: [],
                entity_name: "",
                line: 0,
                column: 0,
                current_ap: 0,
                max_ap: 0
            }
            setIsLoadingActions({flag: false})
        })
        builder.addCase(fetchActions.pending, (state) => {
            state.currentActions = {
                actions: [],
                entity_name: "",
                line: 0,
                column: 0,
                current_ap: 0,
                max_ap: 0
            }
            setIsLoadingActions({flag: true})
        })
    },
}
)

export default turnSlice.reducer;

export const {
    resetTurn,
    setSquareChoice,
    setInteractableSquares,
    setChosenSquare,
    setChosenAction,
    setDisplayedActions,
    setIsTurnActive,
    resetInteractableSquares,
    setReadyToSubmit,
    setCurrentActions,
    setIsLoadingActions
} = turnSlice.actions;

export const selectSquareChoice = (state: StoreState) => state.turn.squareChoice;
export const selectActiveSquares = (state: StoreState) => state.turn.interactableSquares;
export const selectChosenSquare = (state: StoreState) => state.turn.chosenSquare;
export const selectChosenAction = (state: StoreState) => state.turn.chosenAction;
export const selectDisplayedActions = (state: StoreState) => state.turn.displayedActions;
export const selectIsTurnActive = (state: StoreState) => state.turn.isTurnActive;
export const selectReadyToSubmit = (state: StoreState) => state.turn.readyToSubmit;
export const selectCurrentActions = (state: StoreState) => state.turn.currentActions;
export const selectIsLoadingCurrentActions = (state: StoreState) => state.turn.isLoadingCurrentActions;
export const selectEntityInControlInfo = (state: StoreState) => {
    const {entity_name, current_ap, max_ap, line, column} = state.turn.currentActions;
    return {entity_name, current_ap, max_ap, line, column}
};