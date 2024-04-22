import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BattlefieldState, StoreState } from '../../models/Redux'
import APIService from '../../services/APIService'

const initialState: BattlefieldState = {
    isLoadingBattlefield: true,
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
        field_pawns: { '0': 'builtins:tile' },
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

export const fetchBattlefield = createAsyncThunk('battlefield/fetchBattlefield', async (game_id: string) => {
    return await APIService.getGameField(game_id)
        .then((response) => response)
        .catch((error) => {
            console.error('There was a problem with the fetch operation: ', error)
            return initialState.currentBattlefield
        })
})

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
        resetClickedSquare: (state) => {
            state.clickedSquare = null
        },
        setInteractableTiles: (state, action: PayloadAction<{ [key: string]: boolean }>) => {
            state.interactableTiles = { ...state.interactableTiles, ...action.payload }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchBattlefield.fulfilled, (state, action) => {
            return { ...state, current_battlefield: action.payload, isLoadingBattlefield: false }
        })
        builder.addCase(fetchBattlefield.pending, (state) => {
            return { ...state, isLoadingBattlefield: true }
        })
        builder.addCase(fetchBattlefield.rejected, (state) => {
            return { ...state, isLoadingBattlefield: false }
        })
    },
})

export default InfoSlice.reducer

export const { setBattlefieldMode, setClickedSquare, resetClickedSquare, setInteractableTiles } = InfoSlice.actions

export const selectBattlefieldMold = (state: StoreState) => state.battlefield.currentBattlefield,
    selectColumns = (state: StoreState) => state.battlefield.currentBattlefield.columns,
    selectConnectors = (state: StoreState) => state.battlefield.currentBattlefield.connectors,
    selectFieldComponents = (state: StoreState) => state.battlefield.currentBattlefield.field_pawns,
    selectLines = (state: StoreState) => state.battlefield.currentBattlefield.lines,
    selectSeparators = (state: StoreState) => state.battlefield.currentBattlefield.separators,
    selectIsLoadingBattlefield = (state: StoreState) => state.battlefield.isLoadingBattlefield,
    selectBattlefieldMode = (state: StoreState) => state.battlefield.battlefieldMode,
    selectClickedSquare = (state: StoreState) => state.battlefield.clickedSquare,
    selectInteractableTiles = (state: StoreState) => state.battlefield.interactableTiles
