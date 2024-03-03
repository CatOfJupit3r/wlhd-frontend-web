import { createSlice } from "@reduxjs/toolkit";
import {TurnState} from "../../models/Redux";

const initialState: TurnState = {
    squareChoice: false,
    interactableSquares: {},
    chosenSquare: "",
    chosenAction: {},
    displayedActions: {},
    isTurnActive: false,
    readyToSubmit: false,
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
        }}
})

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
    setReadyToSubmit
} = turnSlice.actions;

export const selectSquareChoice = (state: {turn: TurnState}) => state.turn.squareChoice;
export const selectActiveSquares = (state: {turn: TurnState}) => state.turn.interactableSquares;
export const selectChosenSquare = (state: {turn: TurnState}) => state.turn.chosenSquare;
export const selectChosenAction = (state: {turn: TurnState}) => state.turn.chosenAction;
export const selectDisplayedActions = (state: {turn: TurnState}) => state.turn.displayedActions;
export const selectIsTurnActive = (state: {turn: TurnState}) => state.turn.isTurnActive;
export const selectReadyToSubmit = (state: {turn: TurnState}) => state.turn.readyToSubmit;