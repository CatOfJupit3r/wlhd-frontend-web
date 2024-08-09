import { configureStore } from '@reduxjs/toolkit'
import battlefieldReducer from './slices/battlefieldSlice'
import cosmeticsSlice from './slices/cosmeticsSlice'
import infoReducer from './slices/infoSlice'
import lobbyReducer from './slices/lobbySlice'
import turnReducer from './slices/turnSlice'

export const store = configureStore({
    reducer: {
        cosmetics: cosmeticsSlice,
        turn: turnReducer,
        lobby: lobbyReducer,
        info: infoReducer,
        battlefield: battlefieldReducer,
    },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
