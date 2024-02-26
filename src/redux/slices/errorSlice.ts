import {createSlice} from "@reduxjs/toolkit";
import {StoreState} from "../../types/Redux";

const initialState: string = ''

const ErrorSlice = createSlice({
    name: 'error',
    initialState,
    reducers: {
        setError: (_, action) => {
            return action.payload
        },
        clearError: () => {
            return initialState
        }
    }
})

export default ErrorSlice.reducer;

export const {
    setError,
    clearError
} = ErrorSlice.actions

export const selectErrorMessage = (state: StoreState) => state.error