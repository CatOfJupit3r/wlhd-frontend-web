import { configureStore } from '@reduxjs/toolkit'
import infoReducer from './slices/infoSlice'
import lobbyReducer from './slices/lobbySlice'
import notifyReducer from './slices/notifySlice'
import turnReducer from './slices/turnSlice'

export const store = configureStore({
    reducer: {
        notify: notifyReducer,
        turn: turnReducer,
        lobby: lobbyReducer,
        info: infoReducer,
    },
})

export type AppDispatch = typeof store.dispatch
