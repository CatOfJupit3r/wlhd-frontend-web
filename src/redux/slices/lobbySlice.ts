import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LobbyState, StoreState } from '../../models/Redux'

const initialState: LobbyState = {
    lobbyId: '',
    combats: [],
    players: [],
    gm: '',
    layout: 'default',
    controlledEntity: null,
}

const LobbySlice = createSlice({
    name: 'lobby',
    initialState,
    reducers: {
        setLobbyInfo: (state, action: PayloadAction<LobbyState>) => {
            return { ...state, ...action.payload }
        },
    },
})

export default LobbySlice.reducer

export const selectLobbyInfo = (state: StoreState) => state.lobby
export const selectLobbyId = (state: StoreState) => state.lobby.lobbyId

export const { setLobbyInfo } = LobbySlice.actions
