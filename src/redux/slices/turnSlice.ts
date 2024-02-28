import { createSlice } from "@reduxjs/toolkit";
import {TurnState} from "../../types/Redux";

const initialState: TurnState = {
    squareChoice: false,
    interactableCells: {},
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
        setInteractableCells: (state: TurnState, action: {
            type: string,
            payload: {
                lines: string[]
                columns: string[]
            }
        }) => {
            const {lines, columns} = action.payload;
            for (let line of lines) {
                state.interactableCells[line] = {};
                for (let column of columns) {
                    state.interactableCells[line][column] = true;
                }
            }
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
    setInteractableCells,
    setChosenCell,
    setChosenAction,
    setDisplayedActions,
    setIsTurnActive,
} = turnSlice.actions;

export const selectSquareChoice = (state: {turn: TurnState}) => state.turn.squareChoice;
export const selectActiveCells = (state: {turn: TurnState}) => state.turn.interactableCells;
export const selectChosenCell = (state: {turn: TurnState}) => state.turn.chosenCell;
export const selectChosenAction = (state: {turn: TurnState}) => state.turn.chosenAction;
export const selectDisplayedActions = (state: {turn: TurnState}) => state.turn.displayedActions;
export const selectIsTurnActive = (state: {turn: TurnState}) => state.turn.isTurnActive;
