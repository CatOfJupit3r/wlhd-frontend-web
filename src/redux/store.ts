import { configureStore } from '@reduxjs/toolkit'
import errorReducer from './slices/errorSlice'
import turnReducer from './slices/turnSlice'
import gameReducer from './slices/gameSlice'


export default configureStore({
    reducer: {
        error: errorReducer,
        turn: turnReducer,
        game: gameReducer
    }
})