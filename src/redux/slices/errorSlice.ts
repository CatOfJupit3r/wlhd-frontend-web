import {createSlice} from "@reduxjs/toolkit";
import {StoreState} from "../../types/Redux";

const initialState: {
    message: string,
    code: string
} = {
    message: "",
    code: ""
}

const ErrorSlice = createSlice({
    name: 'error',
    initialState,
    reducers: {
        setError: (state, action) => {
            return {...state, message: action.payload.message, code: action.payload.code}
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