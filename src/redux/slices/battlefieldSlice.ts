import { Battlefield } from '@models/Battlefield'
import { BattlefieldState } from '@models/Redux'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

const initialState: BattlefieldState = {
    currentBattlefield: {
        field: [
            ['0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0'],
        ],
        columns: ['builtins:one', 'builtins:two', 'builtins:three', 'builtins:four', 'builtins:five', 'builtins:six'],
        lines: [
            'builtins:safe_line',
            'builtins:ranged_line',
            'builtins:melee_line',
            'builtins:melee_line',
            'builtins:ranged_line',
            'builtins:safe_line',
        ],
        connectors: 'builtins:connector',
        separators: 'builtins:separator',
        pawns: { '0': 'builtins:tile' },
    },
    battlefieldMode: 'info',
    clickedSquare: null,
    alreadyClickedSquares: {},
    interactableSquares: (() => {
        const interactableSquares: { [key: string]: boolean } = {}
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 6; j++) {
                interactableSquares[`${i + 1}/${j + 1}`] = false
            }
        }
        return interactableSquares
    })(),
}

const InfoSlice = createSlice({
    name: 'battlefield',
    initialState,
    reducers: {
        setBattlefieldMode: (state, action) => {
            state.battlefieldMode = action.payload
        },
        setClickedSquare: (state, action: PayloadAction<string>) => {
            state.clickedSquare = action.payload
        },
        setInteractableSquares: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
            state.interactableSquares = { ...state.interactableSquares, ...action.payload }
        },
        resetInteractableSquares: (state) => {
            state.interactableSquares = initialState.interactableSquares
        },
        resetState: () => {
            return initialState
        },
        setBattlefield: (state, action: PayloadAction<Battlefield>) => {
            return { ...state, currentBattlefield: action.payload }
        },
        resetStateAfterSquareChoice: (state) => {
            return {
                ...state,
                battlefieldMode: initialState.battlefieldMode,
                interactableSquares: initialState.interactableSquares,
                clickedSquare: null,
            }
        },
        addClickedSquare: (state, action: PayloadAction<string>) => {
            if (state.alreadyClickedSquares[action.payload]) {
                state.alreadyClickedSquares[action.payload]++
            } else {
                state.alreadyClickedSquares[action.payload] = 1
            }
        },
        alreadyClickedOnlyThisSquare: (state, action: PayloadAction<string>) => {
            state.alreadyClickedSquares = { [action.payload]: 1 }
        },
        resetAlreadyClickedSquares: (state) => {
            state.alreadyClickedSquares = {}
        },
    },
})

export default InfoSlice.reducer

export const {
    setBattlefieldMode,
    setClickedSquare,
    resetStateAfterSquareChoice,
    setBattlefield,
    setInteractableSquares,
    resetState,
    resetInteractableSquares,
    addClickedSquare,
    resetAlreadyClickedSquares,
    alreadyClickedOnlyThisSquare,
} = InfoSlice.actions

export const selectBattlefieldMold = (state: RootState) => state.battlefield.currentBattlefield,
    selectColumns = (state: RootState) => state.battlefield.currentBattlefield.columns,
    selectConnectors = (state: RootState) => state.battlefield.currentBattlefield.connectors,
    selectFieldComponents = (state: RootState) => state.battlefield.currentBattlefield.pawns,
    selectLines = (state: RootState) => state.battlefield.currentBattlefield.lines,
    selectSeparators = (state: RootState) => state.battlefield.currentBattlefield.separators,
    selectBattlefieldMode = (state: RootState) => state.battlefield.battlefieldMode,
    selectClickedSquare = (state: RootState) => state.battlefield.clickedSquare,
    selectInteractableSquares = (state: RootState) => state.battlefield.interactableSquares,
    selectAlreadyClickedSquares = (state: RootState) => state.battlefield.alreadyClickedSquares
