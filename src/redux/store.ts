import { configureStore } from '@reduxjs/toolkit'
import gameReducer from './slices/gameSlice'
import infoReducer from './slices/infoSlice'
import notifyReducer from './slices/notifySlice'
import turnReducer from './slices/turnSlice'

export const store = configureStore({
    reducer: {
        notify: notifyReducer,
        turn: turnReducer,
        game: gameReducer,
        info: infoReducer,
    },
})

export type AppDispatch = typeof store.dispatch
