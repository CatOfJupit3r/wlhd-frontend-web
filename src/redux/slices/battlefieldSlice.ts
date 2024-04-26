import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Battlefield } from '../../models/Battlefield'
import { BattlefieldState, StoreState } from '../../models/Redux'

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
} = InfoSlice.actions

export const selectBattlefieldMold = (state: StoreState) => state.battlefield.currentBattlefield,
    selectColumns = (state: StoreState) => state.battlefield.currentBattlefield.columns,
    selectConnectors = (state: StoreState) => state.battlefield.currentBattlefield.connectors,
    selectFieldComponents = (state: StoreState) => state.battlefield.currentBattlefield.pawns,
    selectLines = (state: StoreState) => state.battlefield.currentBattlefield.lines,
    selectSeparators = (state: StoreState) => state.battlefield.currentBattlefield.separators,
    selectBattlefieldMode = (state: StoreState) => state.battlefield.battlefieldMode,
    selectClickedSquare = (state: StoreState) => state.battlefield.clickedSquare,
    selectInteractableTiles = (state: StoreState) => state.battlefield.interactableTiles
