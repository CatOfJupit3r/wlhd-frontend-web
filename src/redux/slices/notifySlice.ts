import {createSlice} from "@reduxjs/toolkit";
import {notifyState, StoreState} from "../../models/Redux";

const initialState: notifyState = {
    message: "",
    code: 200
}

const NotifySlice = createSlice({
    name: 'notify',
    initialState,
    reducers: {
        setNotify: (state, action: {
            type: string,
                payload: {
                    message: string,
                    code: number
            }
        }) => {
            const {message, code} = action.payload;
            return {...state, message, code}
        },
        clearNotify: () => {
            return initialState
        }
    }
})

export default NotifySlice.reducer;

export const {
    setNotify,
    clearNotify
} = NotifySlice.actions

export const selectNotificationMessage = (state: StoreState) => state.notify.message
export const selectNotificationCode = (state: StoreState) => state.notify.code
