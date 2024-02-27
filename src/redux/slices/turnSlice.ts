import { createSlice } from "@reduxjs/toolkit";
import {TurnState} from "../../types/Redux";

const initialState: TurnState = {
    squareChoice: false,
    activeCells: {},
    chosenCell: "",
    chosenAction: {},
    displayedActions: {},
    isTurnActive: false,
}


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
        setActiveCells: (state: TurnState, action: {
            type: string,
            payload: {
                lines: string[]
            }
        }) => {
            const {lines} = action.payload;
            const newState = {...state};
            for (let line of lines) {
                newState.activeCells[line] = {};
                for (let i = 1; i <= 6; i++) {
                    newState.activeCells[line][i.toString()] = true;
                }
            }
            return newState;
        },
        resetActiveCells: (state: TurnState, payload: {
            type: string,
            payload: {
                line: string
            }
        }) => {
            const {line} = payload.payload;
            const newState = {...state};
            newState.activeCells[line] = {};
            for (let column in newState.activeCells[line]) {
                newState.activeCells[line][column] = false;
            }
            return newState;
        },
        resetAllActiveCells: (state: TurnState) => {
            return {...state, activeCells: {}}
        },
        setChosenCell: (state: TurnState, action: {
            type: string,
            payload: {
                cell: string
            }
        }) => {
            const {cell} = action.payload;
            return state.squareChoice ? {...state, chosenCell: cell} : state;
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
        resetChosenActions: (state: TurnState) => {
            return {...state, chosenAction: {}}
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
        resetDisplayedActions: (state: TurnState) => {
            return {...state, displayedActions: {}}
        },
        setIsTurnActive: (state: TurnState, action: {
            type: string,
            payload: {
                value: boolean
            }
        }) => {
            const {value} = action.payload;
            return {...state, isTurnActive: value}
        },

    }
})

export default turnSlice.reducer;

export const {
    resetTurn,
    setSquareChoice,
    setActiveCells,
    resetActiveCells,
    resetAllActiveCells,
    setChosenCell,
    setChosenAction,
    setDisplayedActions,
    setIsTurnActive,
} = turnSlice.actions;

export const selectSquareChoice = (state: {turn: TurnState}) => state.turn.squareChoice;
export const selectActiveCells = (state: {turn: TurnState}) => state.turn.activeCells;
export const selectChosenCell = (state: {turn: TurnState}) => state.turn.chosenCell;
export const selectChosenAction = (state: {turn: TurnState}) => state.turn.chosenAction;
export const selectDisplayedActions = (state: {turn: TurnState}) => state.turn.displayedActions;
export const selectIsTurnActive = (state: {turn: TurnState}) => state.turn.isTurnActive;
