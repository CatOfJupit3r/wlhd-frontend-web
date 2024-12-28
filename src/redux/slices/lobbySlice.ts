import { iLobbyInformation, LobbyState } from '@models/Redux'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

const initialState: LobbyState = {
    name: '',
    lobbyId: '',
    combats: [],
    players: [],
    characters: [],
    gm: '',
    layout: 'default',
}

const LobbySlice = createSlice({
    name: 'lobby',
    initialState,
    reducers: {
        setLobbyInfo: (state, action: PayloadAction<iLobbyInformation>) => {
            return { ...state, ...action.payload }
        },
    },
})

export default LobbySlice.reducer

export const selectLobbyInfo = (state: RootState) => state.lobby
export const selectLobbyId = (state: RootState) => state.lobby.lobbyId

export const { setLobbyInfo } = LobbySlice.actions
