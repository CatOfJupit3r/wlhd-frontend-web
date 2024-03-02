import { configureStore } from '@reduxjs/toolkit'
import notifyReducer from './slices/notifySlice'
import turnReducer from './slices/turnSlice'
import gameReducer from './slices/gameSlice'


export default configureStore({
    reducer: {
        notify: notifyReducer,
        turn: turnReducer,
        game: gameReducer
    }
})