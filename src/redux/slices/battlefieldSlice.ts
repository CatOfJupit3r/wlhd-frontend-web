import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Battlefield } from '../../models/Battlefield'
import { BattlefieldState } from '../../models/Redux'
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
    highlightedSquares: {},
    interactableTiles: (() => {
        const interactableTiles: { [key: string]: boolean } = {}
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 6; j++) {
                interactableTiles[`${i + 1}/${j + 1}`] = false
            }
        }
        return interactableTiles
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
        setInteractableTiles: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
            state.interactableTiles = { ...state.interactableTiles, ...action.payload }
        },
        resetInteractableTiles: (state) => {
            state.interactableTiles = initialState.interactableTiles
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
                interactableTiles: initialState.interactableTiles,
                clickedSquare: null,
            }
        },
        addHighlightedSquare: (state, action: PayloadAction<string>) => {
            if (state.highlightedSquares[action.payload]) {
                state.highlightedSquares[action.payload]++
            } else {
                state.highlightedSquares[action.payload] = 1
            }
        },
        highlightOnlyThisSquare: (state, action: PayloadAction<string>) => {
            state.highlightedSquares = { [action.payload]: 1 }
        },
        resetHighlightedSquares: (state) => {
            state.highlightedSquares = {}
        },
    },
})

export default InfoSlice.reducer

export const {
    setBattlefieldMode,
    setClickedSquare,
    resetStateAfterSquareChoice,
    setBattlefield,
    setInteractableTiles,
    resetState,
    resetInteractableTiles,
    addHighlightedSquare,
    resetHighlightedSquares,
    highlightOnlyThisSquare,
} = InfoSlice.actions

export const selectBattlefieldMold = (state: RootState) => state.battlefield.currentBattlefield,
    selectColumns = (state: RootState) => state.battlefield.currentBattlefield.columns,
    selectConnectors = (state: RootState) => state.battlefield.currentBattlefield.connectors,
    selectFieldComponents = (state: RootState) => state.battlefield.currentBattlefield.pawns,
    selectLines = (state: RootState) => state.battlefield.currentBattlefield.lines,
    selectSeparators = (state: RootState) => state.battlefield.currentBattlefield.separators,
    selectBattlefieldMode = (state: RootState) => state.battlefield.battlefieldMode,
    selectClickedSquare = (state: RootState) => state.battlefield.clickedSquare,
    selectInteractableTiles = (state: RootState) => state.battlefield.interactableTiles,
    selectHighlightedSquares = (state: RootState) => state.battlefield.highlightedSquares
