import { configureStore } from '@reduxjs/toolkit'
import errorReducer from './slices/errorSlice'
import turnReducer from './slices/turnSlice'


export default configureStore({
    reducer: {
        error: errorReducer,
        turn: turnReducer
    }
})